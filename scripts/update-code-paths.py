#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能代码路径更新工具

根据文件重命名映射表自动更新代码中的硬编码路径。

功能：
1. 扫描 src 目录下所有 JS/JSX 文件
2. 智能匹配并替换路径引用
3. 支持干运行模式（预览不执行）
4. 生成详细的更新报告
5. 支持回滚操作
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

class CodePathUpdater:
    def __init__(self, mapping_data, src_dir, dry_run=True):
        """
        初始化代码路径更新器
        
        Args:
            mapping_data: 重命名映射数据（dict或文件路径）
            src_dir: 源代码目录
            dry_run: 是否为干运行模式
        """
        self.src_dir = Path(src_dir)
        self.dry_run = dry_run
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # 加载映射数据
        if isinstance(mapping_data, dict):
            self.mappings = mapping_data.get('mappings', [])
        else:
            with open(mapping_data, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.mappings = data.get('mappings', [])
        
        # 构建路径映射字典（旧路径 -> 新路径）
        self.path_map = {}
        for item in self.mappings:
            # 处理相对路径格式（去掉目录前缀）
            old_rel = item['old'].replace('\\', '/')
            new_rel = item['new'].replace('\\', '/')
            
            # 提取文件名
            old_filename = Path(old_rel).name
            new_filename = Path(new_rel).name
            
            # 同时存储完整路径和文件名映射
            self.path_map[old_rel] = new_rel
            self.path_map[old_filename] = new_filename
        
        # 统计信息
        self.stats = {
            'files_scanned': 0,
            'files_modified': 0,
            'paths_updated': 0,
            'errors': 0
        }
        
        # 更新记录
        self.update_records = []
        
    def scan_and_update(self):
        """扫描并更新所有源代码文件"""
        print(f"🔍 开始扫描代码目录: {self.src_dir}")
        print("=" * 80)
        
        if not self.src_dir.exists():
            print(f"❌ 错误：目录不存在 {self.src_dir}")
            return
        
        # 遍历所有 JS/JSX 文件
        for file_path in self.src_dir.rglob('*.js'):
            self._process_file(file_path)
        
        for file_path in self.src_dir.rglob('*.jsx'):
            self._process_file(file_path)
        
        # 显示报告
        self._print_report()
        
        # 执行更新（如果不是干运行）
        if not self.dry_run and self.update_records:
            self._execute_updates()
            self._save_backup()
    
    def _process_file(self, file_path):
        """处理单个文件"""
        self.stats['files_scanned'] += 1
        
        try:
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            updates_in_file = []
            
            # 查找并替换所有匹配的路径
            for old_path, new_path in self.path_map.items():
                # 只处理完整路径格式的映射（包含斜杠的）
                if '/' not in old_path:
                    continue
                
                # 匹配多种路径格式
                patterns = [
                    # 完整路径: '/gallery/material-texture/板绘1/page_032_img_001 1.png'
                    re.compile(re.escape(old_path), re.IGNORECASE),
                ]
                
                for pattern in patterns:
                    if pattern.search(content):
                        # 记录替换位置
                        matches = list(pattern.finditer(content))
                        for match in matches:
                            line_num = content[:match.start()].count('\n') + 1
                            updates_in_file.append({
                                'line': line_num,
                                'old': match.group(0),
                                'new': new_path
                            })
                        
                        # 执行完整路径替换
                        content = pattern.sub(new_path, content)
            
            # 如果有更新
            if content != original_content:
                self.stats['files_modified'] += 1
                self.stats['paths_updated'] += len(updates_in_file)
                
                self.update_records.append({
                    'file': str(file_path.relative_to(self.src_dir.parent)),
                    'updates': updates_in_file,
                    'new_content': content,
                    'old_content': original_content
                })
                
        except Exception as e:
            print(f"   ❌ 处理文件失败: {file_path} -> {e}")
            self.stats['errors'] += 1
    
    def _print_report(self):
        """打印更新报告"""
        print("\n" + "=" * 80)
        print("📊 代码路径更新报告")
        print("=" * 80)
        
        print(f"\n📁 扫描统计:")
        print(f"   • 扫描文件数: {self.stats['files_scanned']}")
        print(f"   • 需要修改: {self.stats['files_modified']}")
        print(f"   • 路径更新数: {self.stats['paths_updated']}")
        print(f"   • 错误数: {self.stats['errors']}")
        
        if self.update_records:
            print(f"\n📝 文件修改清单:")
            for i, record in enumerate(self.update_records[:10], 1):
                print(f"\n   {i}. {record['file']}")
                for update in record['updates'][:3]:
                    print(f"      L{update['line']}: {update['old']}")
                    print(f"            → {update['new']}")
                if len(record['updates']) > 3:
                    print(f"      ... 还有 {len(record['updates']) - 3} 处更新")
            
            if len(self.update_records) > 10:
                print(f"\n   ... 还有 {len(self.update_records) - 10} 个文件")
        else:
            print("\n✅ 没有需要更新的文件")
        
        print("\n" + "=" * 80)
        
        if self.dry_run:
            print("🔍 【干运行模式】以上为预览，未执行实际修改")
        else:
            print("⚠️  【执行模式】即将执行实际修改操作")
    
    def _execute_updates(self):
        """执行文件更新"""
        print("\n🚀 开始执行代码更新...")
        
        success = 0
        failed = 0
        
        for record in self.update_records:
            try:
                file_path = self.src_dir.parent / record['file']
                
                # 写入新内容
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(record['new_content'])
                
                success += 1
                
                if success % 5 == 0:
                    print(f"   ✅ 已更新 {success} 个文件...")
                    
            except Exception as e:
                print(f"   ❌ 更新失败: {record['file']} -> {e}")
                failed += 1
        
        print(f"\n✅ 更新完成: 成功 {success} 个, 失败 {failed} 个")
    
    def _save_backup(self):
        """保存备份信息（用于回滚）"""
        backup_file = self.src_dir.parent / f'code-update-backup-{self.timestamp}.json'
        
        backup_data = {
            'timestamp': self.timestamp,
            'dry_run': self.dry_run,
            'stats': self.stats,
            'updates': [
                {
                    'file': rec['file'],
                    'updates': rec['updates'],
                    'old_content': rec['old_content']
                }
                for rec in self.update_records
            ]
        }
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 备份已保存: {backup_file}")
        print(f"   （可用于回滚操作）")
    
    def rollback(self, backup_file):
        """根据备份文件回滚"""
        print(f"🔄 开始回滚代码更新...")
        
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)
        
        success = 0
        failed = 0
        
        for record in backup_data['updates']:
            try:
                file_path = self.src_dir.parent / record['file']
                
                # 恢复旧内容
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(record['old_content'])
                
                success += 1
                
            except Exception as e:
                print(f"   ❌ 回滚失败: {record['file']} -> {e}")
                failed += 1
        
        print(f"\n✅ 回滚完成: 成功 {success} 个, 失败 {failed} 个")


def generate_mapping_from_rename(gallery_dir):
    """
    从实际文件系统生成映射（用于已经重命名但未保存映射的情况）
    
    这个函数会扫描实际文件并与配置文件对比，生成映射表
    """
    print("⚠️  警告：此功能用于紧急情况，从现有文件反推映射")
    print("建议：以后使用 rename-files.py 时保存映射表")
    
    # TODO: 实现从实际文件反推映射的逻辑
    pass


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='智能代码路径更新工具')
    parser.add_argument('--mapping', '-m', required=True, help='重命名映射文件路径（JSON）')
    parser.add_argument('--execute', '-e', action='store_true', help='执行模式（默认为干运行）')
    parser.add_argument('--rollback', '-r', help='回滚：指定备份文件路径')
    
    args = parser.parse_args()
    
    # 获取路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    src_dir = project_root / 'src'
    
    # 回滚模式
    if args.rollback:
        updater = CodePathUpdater({}, src_dir, dry_run=False)
        updater.rollback(args.rollback)
        return
    
    # 更新模式
    dry_run = not args.execute
    updater = CodePathUpdater(args.mapping, src_dir, dry_run=dry_run)
    updater.scan_and_update()


if __name__ == '__main__':
    main()

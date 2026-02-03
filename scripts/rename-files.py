#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能文件重命名工具

功能：
1. 自动识别各种命名模式（MD5、page_xxx、Frame/Group等）
2. 根据配置规则生成新文件名
3. 干运行模式（预览不执行）
4. 生成映射表支持回滚
5. 详细日志记录
"""

import os
import re
import json
import shutil
import subprocess
from pathlib import Path
from datetime import datetime
from collections import defaultdict

class FileRenamer:
    def __init__(self, config_file, gallery_dir, dry_run=True):
        self.gallery_dir = Path(gallery_dir)
        self.dry_run = dry_run
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # 加载配置
        with open(config_file, 'r', encoding='utf-8') as f:
            self.config = json.load(f)
        
        # 重命名映射
        self.rename_map = []
        self.stats = defaultdict(int)
        
    def process_directory(self, target_dir=None):
        """处理指定目录或整个gallery"""
        if target_dir:
            target_path = self.gallery_dir / target_dir
            if not target_path.exists():
                print(f"❌ 错误：目录不存在 {target_path}")
                return
            print(f"🎯 处理目标目录: {target_dir}")
            self._process_module(target_dir, target_path)
        else:
            print(f"🎯 处理整个 gallery 目录")
            for module_dir in self.gallery_dir.iterdir():
                if module_dir.is_dir():
                    self._process_module(module_dir.name, module_dir)
        
        # 显示预览或执行重命名
        self._show_preview()
        
        if not self.dry_run and self.rename_map:
            self._execute_rename()
            mapping_file = self._save_mapping()
            
            # 自动更新代码中的路径引用
            if mapping_file:
                self._update_code_paths(mapping_file)
        elif self.rename_map:
            # 即使是干运行，也生成映射表（但标记为 dry_run）
            print("\n💡 提示：如需保存映射表，请使用 --execute 模式")
    
    def _process_module(self, module_name, module_path):
        """处理单个模块目录"""
        print(f"\n📂 扫描模块: {module_name}")
        
        # 检查是否需要保留原始命名
        if self._should_preserve(module_name):
            print(f"   ℹ️  保留原始命名（配置中指定）")
            return
        
        # 获取模块配置
        module_config = self.config['category_mappings'].get(module_name, {})
        
        # 遍历子目录
        for subcat_dir in module_path.iterdir():
            if subcat_dir.is_dir():
                self._process_subcategory(module_name, subcat_dir, module_config)
    
    def _process_subcategory(self, module_name, subcat_path, module_config):
        """处理子分类目录"""
        subcat_name = subcat_path.name
        print(f"   📁 {subcat_name}")
        
        # 获取子分类的拼音映射
        subcategories = module_config.get('subcategories', {})
        subcat_pinyin = subcategories.get(subcat_name, subcat_name)
        
        # 收集所有文件并排序
        files = sorted([f for f in subcat_path.iterdir() if f.is_file()])
        
        # 生成新文件名
        for idx, file_path in enumerate(files, start=1):
            old_name = file_path.name
            new_name = self._generate_new_name(
                module_name,
                subcat_pinyin,
                old_name,
                idx
            )
            
            if new_name != old_name:
                rel_path = file_path.relative_to(self.gallery_dir)
                self.rename_map.append({
                    'old': str(rel_path),
                    'new': str(rel_path.parent / new_name),
                    'old_abs': str(file_path),
                    'new_abs': str(file_path.parent / new_name),
                    'module': module_name,
                    'subcategory': subcat_name
                })
                self.stats['renamed'] += 1
            else:
                self.stats['unchanged'] += 1
    
    def _generate_new_name(self, module, subcat_pinyin, old_name, sequence):
        """生成新文件名"""
        # 提取扩展名
        _, ext = os.path.splitext(old_name)
        
        # 生成序号
        seq_str = str(sequence).zfill(self.config['naming_rules']['sequence_digits'])
        
        # 生成新文件名：{subcategory}-{sequence}.ext
        new_name = f"{subcat_pinyin}-{seq_str}{ext}"
        
        return new_name
    
    def _should_preserve(self, module_name):
        """检查是否应保留原始命名"""
        preserve_list = self.config['naming_rules'].get('preserve_original', [])
        return module_name in preserve_list
    
    def _show_preview(self):
        """显示预览"""
        print("\n" + "=" * 80)
        print("📋 重命名预览")
        print("=" * 80)
        
        if not self.rename_map:
            print("✅ 没有需要重命名的文件")
            return
        
        print(f"\n📊 统计:")
        print(f"   • 需要重命名: {self.stats['renamed']} 个文件")
        print(f"   • 保持不变: {self.stats['unchanged']} 个文件")
        
        print(f"\n📝 重命名清单（显示前20个）:")
        for i, item in enumerate(self.rename_map[:20], 1):
            print(f"\n   {i}. [{item['module']}/{item['subcategory']}]")
            print(f"      旧: {Path(item['old']).name}")
            print(f"      新: {Path(item['new']).name}")
        
        if len(self.rename_map) > 20:
            print(f"\n   ... 还有 {len(self.rename_map) - 20} 个文件")
        
        print("\n" + "=" * 80)
        
        if self.dry_run:
            print("🔍 【干运行模式】以上为预览，未执行实际重命名")
        else:
            print("⚠️  【执行模式】即将执行实际重命名操作")
    
    def _execute_rename(self):
        """执行重命名"""
        print("\n🚀 开始执行重命名...")
        
        success = 0
        failed = 0
        
        for item in self.rename_map:
            try:
                old_path = Path(item['old_abs'])
                new_path = Path(item['new_abs'])
                
                # 检查新文件是否已存在
                if new_path.exists():
                    print(f"   ⚠️  跳过（目标已存在）: {new_path.name}")
                    failed += 1
                    continue
                
                # 执行重命名
                old_path.rename(new_path)
                success += 1
                
                if success % 10 == 0:
                    print(f"   ✅ 已处理 {success} 个文件...")
                    
            except Exception as e:
                print(f"   ❌ 失败: {item['old']} -> {e}")
                failed += 1
        
        print(f"\n✅ 重命名完成: 成功 {success} 个, 失败 {failed} 个")
    
    def _save_mapping(self):
        """保存映射表（用于回滚）"""
        # 保存到项目根目录，便于其他工具使用
        mapping_file = Path(__file__).parent.parent / 'public' / f'rename-mapping-{self.timestamp}.json'
        
        mapping_data = {
            'timestamp': self.timestamp,
            'dry_run': self.dry_run,
            'stats': dict(self.stats),
            'mappings': self.rename_map
        }
        
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(mapping_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 映射表已保存: {mapping_file}")
        print(f"   （可用于回滚操作）")
        
        return mapping_file
    
    def rollback(self, mapping_file):
        """根据映射表回滚"""
        print(f"🔄 开始回滚...")
        
        with open(mapping_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        success = 0
        failed = 0
        
        for item in data['mappings']:
            try:
                new_path = Path(item['new_abs'])
                old_path = Path(item['old_abs'])
                
                if new_path.exists():
                    new_path.rename(old_path)
                    success += 1
                else:
                    print(f"   ⚠️  文件不存在: {new_path}")
                    failed += 1
                    
            except Exception as e:
                print(f"   ❌ 回滚失败: {item['new']} -> {e}")
                failed += 1
        
        print(f"\n✅ 回滚完成: 成功 {success} 个, 失败 {failed} 个")
    
    def _update_code_paths(self, mapping_file):
        """调用代码路径更新工具"""
        print("\n" + "=" * 80)
        print("🔄 开始自动更新代码路径引用...")
        print("=" * 80)
        
        # 获取 update-code-paths.py 路径
        script_dir = Path(__file__).parent
        update_script = script_dir / 'update-code-paths.py'
        
        if not update_script.exists():
            print("⚠️  警告：未找到 update-code-paths.py，跳过代码更新")
            print("   请手动运行：python scripts/update-code-paths.py --mapping <映射文件>")
            return
        
        try:
            # 调用更新脚本（执行模式）
            result = subprocess.run(
                ['python', str(update_script), '--mapping', str(mapping_file), '--execute'],
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            # 显示输出
            if result.stdout:
                print(result.stdout)
            
            if result.returncode == 0:
                print("✅ 代码路径更新完成")
            else:
                print(f"⚠️  代码更新返回码: {result.returncode}")
                if result.stderr:
                    print(f"错误信息: {result.stderr}")
                    
        except Exception as e:
            print(f"❌ 调用代码更新工具失败: {e}")
            print(f"   请手动运行：python scripts/update-code-paths.py --mapping {mapping_file} --execute")


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='智能文件重命名工具')
    parser.add_argument('--target', '-t', help='目标目录（相对于gallery，如 fly-in）')
    parser.add_argument('--execute', '-e', action='store_true', help='执行模式（默认为干运行）')
    parser.add_argument('--rollback', '-r', help='回滚：指定映射文件路径')
    
    args = parser.parse_args()
    
    # 获取路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    config_file = script_dir / 'naming-config.json'
    gallery_dir = project_root / 'public' / 'gallery'
    
    # 回滚模式
    if args.rollback:
        renamer = FileRenamer(config_file, gallery_dir, dry_run=False)
        renamer.rollback(args.rollback)
        return
    
    # 重命名模式
    dry_run = not args.execute
    renamer = FileRenamer(config_file, gallery_dir, dry_run=dry_run)
    renamer.process_directory(args.target)


if __name__ == '__main__':
    main()

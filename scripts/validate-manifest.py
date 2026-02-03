#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gallery Manifest 验证工具

功能：
1. 检查 manifest 中的所有文件是否存在
2. 检查实际文件是否都在 manifest 中
3. 检测孤立文件和死链接
4. 生成健康度报告

这是一个只读工具，不会修改任何文件。
"""

import json
from pathlib import Path
from collections import defaultdict

class ManifestValidator:
    def __init__(self, base_dir, manifest_file=None):
        """
        初始化验证器
        
        Args:
            base_dir: 项目根目录
            manifest_file: manifest文件路径（默认为 public/gallery-manifest.json）
        """
        self.base_dir = Path(base_dir)
        self.gallery_dir = self.base_dir / 'public' / 'gallery'
        
        if manifest_file:
            self.manifest_file = Path(manifest_file)
        else:
            self.manifest_file = self.base_dir / 'public' / 'gallery-manifest.json'
        
        self.manifest = None
        self.errors = defaultdict(list)
        self.warnings = defaultdict(list)
        self.stats = {
            'total_files_in_manifest': 0,
            'total_files_on_disk': 0,
            'dead_links': 0,
            'orphan_files': 0,
            'passed': 0
        }
    
    def validate(self):
        """执行完整验证"""
        print("🔍 开始验证 Gallery Manifest...")
        print("=" * 80)
        
        # 加载 manifest
        if not self._load_manifest():
            return False
        
        # 验证 manifest 中的文件
        print("\n📝 第1步：验证 manifest 中的所有文件...")
        self._validate_manifest_files()
        
        # 检查磁盘上的文件
        print("\n📁 第2步：检查磁盘上的所有文件...")
        self._validate_disk_files()
        
        # 生成报告
        self._print_report()
        
        return len(self.errors) == 0
    
    def _load_manifest(self):
        """加载 manifest 文件"""
        if not self.manifest_file.exists():
            print(f"❌ 错误：manifest 文件不存在 {self.manifest_file}")
            return False
        
        try:
            with open(self.manifest_file, 'r', encoding='utf-8') as f:
                self.manifest = json.load(f)
            print(f"✅ 成功加载 manifest: {self.manifest_file}")
            return True
        except Exception as e:
            print(f"❌ 错误：无法加载 manifest: {e}")
            return False
    
    def _validate_manifest_files(self):
        """验证 manifest 中记录的所有文件是否存在"""
        for module_name, module_data in self.manifest['modules'].items():
            for subcat_name, subcat_data in module_data['subcategories'].items():
                for file_info in subcat_data['files']:
                    self.stats['total_files_in_manifest'] += 1
                    
                    # 构造完整路径
                    file_path = self.base_dir / 'public' / file_info['relativePath']
                    
                    # 检查文件是否存在
                    if not file_path.exists():
                        self.errors['dead_links'].append({
                            'module': module_name,
                            'subcategory': subcat_name,
                            'file': file_info['filename'],
                            'path': str(file_path),
                            'manifest_path': file_info['path']
                        })
                        self.stats['dead_links'] += 1
                    else:
                        self.stats['passed'] += 1
        
        if self.stats['dead_links'] == 0:
            print(f"   ✅ 所有文件都存在 ({self.stats['total_files_in_manifest']} 个)")
        else:
            print(f"   ❌ 发现 {self.stats['dead_links']} 个死链接")
    
    def _validate_disk_files(self):
        """检查磁盘上的文件是否都在 manifest 中"""
        # 从 manifest 构建文件集合
        manifest_files = set()
        for module_data in self.manifest['modules'].values():
            for subcat_data in module_data['subcategories'].values():
                for file_info in subcat_data['files']:
                    manifest_files.add(file_info['relativePath'])
        
        # 扫描磁盘文件
        image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'}
        disk_files = []
        
        for module_dir in self.gallery_dir.iterdir():
            if module_dir.is_dir():
                for subcat_dir in module_dir.iterdir():
                    if subcat_dir.is_dir():
                        for file_path in subcat_dir.iterdir():
                            if file_path.is_file() and file_path.suffix.lower() in image_extensions:
                                rel_path = file_path.relative_to(self.base_dir / 'public')
                                disk_files.append({
                                    'path': str(file_path),
                                    'relative': str(rel_path).replace('\\', '/')
                                })
                                self.stats['total_files_on_disk'] += 1
        
        # 检查孤立文件
        for disk_file in disk_files:
            if disk_file['relative'] not in manifest_files:
                self.warnings['orphan_files'].append(disk_file)
                self.stats['orphan_files'] += 1
        
        if self.stats['orphan_files'] == 0:
            print(f"   ✅ 所有文件都在 manifest 中 ({self.stats['total_files_on_disk']} 个)")
        else:
            print(f"   ⚠️  发现 {self.stats['orphan_files']} 个孤立文件")
    
    def _print_report(self):
        """打印验证报告"""
        print("\n" + "=" * 80)
        print("📊 验证报告")
        print("=" * 80)
        
        # 总体统计
        print(f"\n📈 总体统计:")
        print(f"   • Manifest 中的文件: {self.stats['total_files_in_manifest']}")
        print(f"   • 磁盘上的文件: {self.stats['total_files_on_disk']}")
        print(f"   • 验证通过: {self.stats['passed']}")
        print(f"   • 死链接（文件不存在）: {self.stats['dead_links']}")
        print(f"   • 孤立文件（未在manifest中）: {self.stats['orphan_files']}")
        
        # 错误详情
        if self.errors['dead_links']:
            print(f"\n❌ 死链接详情 ({len(self.errors['dead_links'])} 个):")
            for i, error in enumerate(self.errors['dead_links'][:10], 1):
                print(f"\n   {i}. {error['module']}/{error['subcategory']}")
                print(f"      文件: {error['file']}")
                print(f"      路径: {error['path']}")
            
            if len(self.errors['dead_links']) > 10:
                print(f"\n   ... 还有 {len(self.errors['dead_links']) - 10} 个错误")
        
        # 警告详情
        if self.warnings['orphan_files']:
            print(f"\n⚠️  孤立文件详情 ({len(self.warnings['orphan_files'])} 个):")
            for i, warning in enumerate(self.warnings['orphan_files'][:10], 1):
                print(f"   {i}. {warning['relative']}")
            
            if len(self.warnings['orphan_files']) > 10:
                print(f"   ... 还有 {len(self.warnings['orphan_files']) - 10} 个孤立文件")
        
        # 健康度评分
        print("\n" + "=" * 80)
        
        if self.stats['dead_links'] == 0 and self.stats['orphan_files'] == 0:
            print("✅ 健康度：100% - 完美！")
            print("   所有文件完全匹配，无问题发现")
        elif self.stats['dead_links'] == 0:
            print("⚠️  健康度：95% - 良好")
            print(f"   有 {self.stats['orphan_files']} 个孤立文件，建议重新扫描生成 manifest")
        elif self.stats['orphan_files'] == 0:
            print("❌ 健康度：低 - 需要修复")
            print(f"   有 {self.stats['dead_links']} 个死链接，文件可能被删除或移动")
        else:
            print("❌ 健康度：低 - 需要修复")
            print(f"   有 {self.stats['dead_links']} 个死链接和 {self.stats['orphan_files']} 个孤立文件")
        
        print("=" * 80)
        
        # 建议
        print("\n💡 建议:")
        if self.stats['dead_links'] > 0:
            print("   1. 检查是否有文件被意外删除或移动")
            print("   2. 重新运行 gallery-scanner.py 更新 manifest")
        if self.stats['orphan_files'] > 0:
            print("   1. 重新运行 gallery-scanner.py 更新 manifest")
            print("   2. 或者删除不需要的图片文件")
        if self.stats['dead_links'] == 0 and self.stats['orphan_files'] == 0:
            print("   ✅ 无需任何操作，manifest 与文件系统完全同步")
        
        print()


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Gallery Manifest 验证工具')
    parser.add_argument('--manifest', '-m', help='manifest 文件路径（默认为 public/gallery-manifest.json）')
    
    args = parser.parse_args()
    
    # 获取项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # 创建验证器并执行
    validator = ManifestValidator(project_root, args.manifest)
    success = validator.validate()
    
    # 返回退出码
    exit(0 if success else 1)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gallery 目录自动扫描工具

功能：
1. 递归扫描 public/gallery 和 public/images 目录
2. 读取图片元信息（尺寸、文件大小、格式等）
3. 按模块和子目录组织数据
4. 生成标准化的 gallery-manifest.json

生成的 manifest 可用于：
- 消除硬编码路径
- 动态加载图片资源
- 验证文件完整性
- 前端自动化配置
"""

import os
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from PIL import Image

class GalleryScanner:
    def __init__(self, base_dir, output_file=None):
        """
        初始化扫描器
        
        Args:
            base_dir: 项目根目录
            output_file: 输出文件路径（默认为 public/gallery-manifest.json）
        """
        self.base_dir = Path(base_dir)
        self.gallery_dir = self.base_dir / 'public' / 'gallery'
        self.images_dir = self.base_dir / 'public' / 'images'
        
        if output_file:
            self.output_file = Path(output_file)
        else:
            self.output_file = self.base_dir / 'public' / 'gallery-manifest.json'
        
        self.manifest = {
            'version': '1.0.0',
            'generated': datetime.now().isoformat(),
            'modules': {},
            'statistics': {
                'totalModules': 0,
                'totalSubcategories': 0,
                'totalFiles': 0,
                'totalSize': 0
            }
        }
        
        # 模块显示名称映射
        self.module_display_names = {
            'material-texture': 'Material & Texture',
            'form-structure': 'Form & Structure',
            'narrative-imagery': 'Narrative Imagery',
            'fly-in': 'Fly In Animation'
        }
        
    def scan(self):
        """扫描所有目录"""
        print("🔍 开始扫描 gallery 目录...")
        print("=" * 80)
        
        if not self.gallery_dir.exists():
            print(f"❌ 错误：gallery 目录不存在 {self.gallery_dir}")
            return
        
        # 扫描 gallery 目录下的所有模块
        for module_dir in sorted(self.gallery_dir.iterdir()):
            if module_dir.is_dir():
                self._scan_module(module_dir)
        
        # 计算统计信息
        self._calculate_statistics()
        
        # 保存 manifest
        self._save_manifest()
        
        # 显示报告
        self._print_report()
    
    def _scan_module(self, module_path):
        """扫描单个模块目录"""
        module_name = module_path.name
        print(f"\n📂 扫描模块: {module_name}")
        
        module_data = {
            'displayName': self.module_display_names.get(module_name, module_name),
            'description': '',
            'subcategories': {},
            'totalFiles': 0,
            'lastModified': datetime.fromtimestamp(module_path.stat().st_mtime).isoformat()
        }
        
        # 扫描子目录
        for subcat_dir in sorted(module_path.iterdir()):
            if subcat_dir.is_dir():
                files = self._scan_subcategory(module_name, subcat_dir)
                if files:
                    module_data['subcategories'][subcat_dir.name] = {
                        'displayName': subcat_dir.name,
                        'files': files
                    }
                    module_data['totalFiles'] += len(files)
                    print(f"   ✅ {subcat_dir.name}: {len(files)} 个文件")
        
        if module_data['totalFiles'] > 0:
            self.manifest['modules'][module_name] = module_data
    
    def _scan_subcategory(self, module_name, subcat_path):
        """扫描子分类目录中的所有文件"""
        files = []
        
        # 支持的图片格式
        image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'}
        
        # 获取所有图片文件
        image_files = sorted([
            f for f in subcat_path.iterdir()
            if f.is_file() and f.suffix.lower() in image_extensions
        ])
        
        for idx, file_path in enumerate(image_files, start=1):
            try:
                file_info = self._get_file_info(module_name, subcat_path.name, file_path, idx)
                files.append(file_info)
            except Exception as e:
                print(f"      ⚠️  无法处理文件 {file_path.name}: {e}")
        
        return files
    
    def _get_file_info(self, module_name, subcat_name, file_path, index):
        """获取单个文件的详细信息"""
        # 基本信息
        file_stat = file_path.stat()
        relative_path = file_path.relative_to(self.base_dir / 'public')
        
        file_info = {
            'filename': file_path.name,
            'path': '/' + str(relative_path).replace('\\', '/'),
            'relativePath': str(relative_path).replace('\\', '/'),
            'fileSize': file_stat.st_size,
            'format': file_path.suffix.lower().lstrip('.'),
            'index': index,
            'lastModified': datetime.fromtimestamp(file_stat.st_mtime).isoformat()
        }
        
        # 读取图片尺寸（仅对位图格式）
        if file_path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.webp'}:
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
                    file_info['dimensions'] = {
                        'width': width,
                        'height': height
                    }
                    
                    # 计算宽高比
                    aspect_ratio = width / height
                    if abs(aspect_ratio - 16/9) < 0.1:
                        file_info['aspectRatio'] = '16:9'
                    elif abs(aspect_ratio - 4/3) < 0.1:
                        file_info['aspectRatio'] = '4:3'
                    elif abs(aspect_ratio - 1) < 0.1:
                        file_info['aspectRatio'] = '1:1'
                    else:
                        file_info['aspectRatio'] = f'{width}:{height}'
                    
                    # 判断方向
                    if width > height * 1.2:
                        file_info['orientation'] = 'landscape'
                    elif height > width * 1.2:
                        file_info['orientation'] = 'portrait'
                    else:
                        file_info['orientation'] = 'square'
            except Exception as e:
                # 无法读取图片尺寸时，只记录文件信息
                print(f"      ⚠️  无法读取 {file_path.name} 的尺寸: {e}")
        
        return file_info
    
    def _calculate_statistics(self):
        """计算全局统计信息"""
        total_files = 0
        total_size = 0
        total_subcategories = 0
        
        for module_data in self.manifest['modules'].values():
            total_files += module_data['totalFiles']
            total_subcategories += len(module_data['subcategories'])
            
            for subcat_data in module_data['subcategories'].values():
                for file_info in subcat_data['files']:
                    total_size += file_info.get('fileSize', 0)
        
        self.manifest['statistics'] = {
            'totalModules': len(self.manifest['modules']),
            'totalSubcategories': total_subcategories,
            'totalFiles': total_files,
            'totalSize': total_size
        }
    
    def _save_manifest(self):
        """保存 manifest 文件"""
        print(f"\n💾 保存 manifest 到: {self.output_file}")
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(self.manifest, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Manifest 已保存")
    
    def _print_report(self):
        """打印扫描报告"""
        print("\n" + "=" * 80)
        print("📊 扫描完成报告")
        print("=" * 80)
        
        stats = self.manifest['statistics']
        
        print(f"\n📁 总体统计:")
        print(f"   • 模块数量: {stats['totalModules']}")
        print(f"   • 子分类数: {stats['totalSubcategories']}")
        print(f"   • 文件总数: {stats['totalFiles']}")
        print(f"   • 总大小: {self._format_size(stats['totalSize'])}")
        
        print(f"\n📂 各模块详情:")
        for module_name, module_data in self.manifest['modules'].items():
            print(f"\n   {module_data['displayName']} ({module_name})")
            print(f"      • 子分类: {len(module_data['subcategories'])} 个")
            print(f"      • 文件数: {module_data['totalFiles']} 个")
        
        print("\n" + "=" * 80)
        print(f"✅ Manifest 文件: {self.output_file}")
        print("=" * 80)
    
    def _format_size(self, size):
        """格式化文件大小"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} TB"


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Gallery 目录自动扫描工具')
    parser.add_argument('--output', '-o', help='输出文件路径（默认为 public/gallery-manifest.json）')
    
    args = parser.parse_args()
    
    # 获取项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # 创建扫描器并执行
    scanner = GalleryScanner(project_root, args.output)
    scanner.scan()


if __name__ == '__main__':
    main()

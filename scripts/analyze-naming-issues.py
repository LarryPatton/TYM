#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件命名问题分析工具

扫描 public/gallery 目录，识别并统计各类命名问题：
- MD5哈希命名
- page_xxx 格式
- Frame/Group 命名
- 尾缀空格问题
- 特殊字符问题
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import json

class NamingAnalyzer:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.stats = {
            'total_files': 0,
            'total_dirs': 0,
            'issues': defaultdict(list),
            'patterns': defaultdict(int),
            'by_module': defaultdict(lambda: defaultdict(int))
        }
        
        # 命名模式识别正则
        self.patterns = {
            'md5_hash': re.compile(r'^[a-f0-9]{32}'),
            'page_format': re.compile(r'^page_\d+_img_\d+'),
            'frame_group': re.compile(r'^(Frame|Group)\s+\d+'),
            'trailing_space': re.compile(r'\s+\d+\.(png|jpg|jpeg|gif|svg)$', re.I),
            'contains_space': re.compile(r'\s'),
            'special_chars': re.compile(r'[^\w\u4e00-\u9fff.\-]', re.U),  # 允许中文、字母、数字、点、横线
        }
    
    def analyze(self):
        """执行分析"""
        print(f"🔍 开始扫描目录: {self.base_dir}")
        print("=" * 80)
        
        if not self.base_dir.exists():
            print(f"❌ 错误：目录不存在 {self.base_dir}")
            return
        
        # 遍历所有文件
        for root, dirs, files in os.walk(self.base_dir):
            root_path = Path(root)
            rel_path = root_path.relative_to(self.base_dir)
            
            self.stats['total_dirs'] += len(dirs)
            
            # 分析模块（一级目录）
            parts = rel_path.parts
            module = parts[0] if len(parts) > 0 else 'root'
            
            for filename in files:
                self.stats['total_files'] += 1
                self._analyze_file(filename, rel_path, module)
        
        # 输出报告
        self._print_report()
        self._save_report()
    
    def _analyze_file(self, filename, rel_path, module):
        """分析单个文件"""
        issues = []
        
        # 检查 MD5 哈希命名
        if self.patterns['md5_hash'].match(filename):
            issues.append('md5_hash')
            self.patterns['md5_hash']
            self.stats['patterns']['md5_hash'] += 1
            self.stats['by_module'][module]['md5_hash'] += 1
        
        # 检查 page_xxx 格式
        if self.patterns['page_format'].match(filename):
            issues.append('page_format')
            self.stats['patterns']['page_format'] += 1
            self.stats['by_module'][module]['page_format'] += 1
        
        # 检查 Frame/Group 命名
        if self.patterns['frame_group'].match(filename):
            issues.append('frame_group')
            self.stats['patterns']['frame_group'] += 1
            self.stats['by_module'][module]['frame_group'] += 1
        
        # 检查尾缀空格（如 " 1.png"）
        if self.patterns['trailing_space'].search(filename):
            issues.append('trailing_space')
            self.stats['patterns']['trailing_space'] += 1
            self.stats['by_module'][module]['trailing_space'] += 1
        
        # 检查是否包含空格（除了已识别的pattern）
        if self.patterns['contains_space'].search(filename) and 'frame_group' not in issues:
            issues.append('contains_space')
            self.stats['patterns']['contains_space'] += 1
            self.stats['by_module'][module]['contains_space'] += 1
        
        # 检查特殊字符
        name_without_ext = os.path.splitext(filename)[0]
        if self.patterns['special_chars'].search(name_without_ext):
            # 排除已识别的合法空格情况
            if not any(p in issues for p in ['frame_group', 'trailing_space']):
                issues.append('special_chars')
                self.stats['patterns']['special_chars'] += 1
                self.stats['by_module'][module]['special_chars'] += 1
        
        # 记录有问题的文件
        if issues:
            file_path = rel_path / filename
            self.stats['issues'][tuple(issues)].append(str(file_path))
    
    def _print_report(self):
        """打印分析报告"""
        print("\n")
        print("📊 文件命名问题分析报告")
        print("=" * 80)
        
        print(f"\n📁 总体统计:")
        print(f"   • 总文件数: {self.stats['total_files']}")
        print(f"   • 总目录数: {self.stats['total_dirs']}")
        print(f"   • 有问题文件数: {sum(len(files) for files in self.stats['issues'].values())}")
        
        print(f"\n🔴 问题类型统计:")
        pattern_names = {
            'md5_hash': 'MD5哈希命名',
            'page_format': 'page_xxx 格式',
            'frame_group': 'Frame/Group 命名',
            'trailing_space': '尾缀空格（" 1.png"）',
            'contains_space': '包含空格',
            'special_chars': '特殊字符'
        }
        
        for pattern, count in sorted(self.stats['patterns'].items(), key=lambda x: x[1], reverse=True):
            if count > 0:
                name = pattern_names.get(pattern, pattern)
                percentage = (count / self.stats['total_files']) * 100
                print(f"   • {name}: {count} ({percentage:.1f}%)")
        
        print(f"\n📦 按模块统计:")
        for module, patterns in sorted(self.stats['by_module'].items()):
            if any(patterns.values()):
                print(f"\n   [{module}]")
                for pattern, count in sorted(patterns.items(), key=lambda x: x[1], reverse=True):
                    if count > 0:
                        name = pattern_names.get(pattern, pattern)
                        print(f"      - {name}: {count}")
        
        print(f"\n📝 典型示例（前10个）:")
        shown = 0
        for issue_types, files in sorted(self.stats['issues'].items(), key=lambda x: len(x[1]), reverse=True):
            if shown >= 10:
                break
            issue_names = ', '.join(pattern_names.get(i, i) for i in issue_types)
            print(f"\n   问题类型: [{issue_names}]")
            for file in files[:3]:  # 每种问题显示3个示例
                print(f"      - {file}")
            if len(files) > 3:
                print(f"      ... 共 {len(files)} 个文件")
            shown += 1
    
    def _save_report(self):
        """保存报告为JSON"""
        output_file = self.base_dir.parent / 'naming-analysis-report.json'
        
        # 转换为可序列化格式
        report = {
            'summary': {
                'total_files': self.stats['total_files'],
                'total_dirs': self.stats['total_dirs'],
                'total_issues': sum(len(files) for files in self.stats['issues'].values())
            },
            'patterns': dict(self.stats['patterns']),
            'by_module': {k: dict(v) for k, v in self.stats['by_module'].items()},
            'issues': {
                '_'.join(k): v for k, v in self.stats['issues'].items()
            }
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 详细报告已保存至: {output_file}")


def main():
    """主函数"""
    # 获取项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    gallery_dir = project_root / 'public' / 'gallery'
    
    analyzer = NamingAnalyzer(gallery_dir)
    analyzer.analyze()


if __name__ == '__main__':
    main()

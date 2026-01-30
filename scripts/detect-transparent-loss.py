#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
PNG 透明通道丢失检测工具
扫描 public 目录下的所有 PNG 文件，检测哪些图片丢失了透明通道
"""

import os
from pathlib import Path
from PIL import Image
from typing import List, Dict
import json

# 配置
SCAN_DIR = "public"
OUTPUT_JSON = "scripts/transparent-loss-report.json"

def format_bytes(bytes_num: int) -> str:
    """格式化字节数"""
    if bytes_num < 1024:
        return f"{bytes_num} B"
    elif bytes_num < 1024 * 1024:
        return f"{bytes_num / 1024:.1f} KB"
    else:
        return f"{bytes_num / (1024 * 1024):.2f} MB"

def check_png_transparency(file_path: Path) -> Dict:
    """
    检查 PNG 文件是否有透明通道
    返回检测结果字典
    """
    try:
        img = Image.open(file_path)
        file_size = file_path.stat().st_size
        
        result = {
            'path': str(file_path.relative_to(SCAN_DIR)),
            'mode': img.mode,
            'size': f"{img.size[0]}x{img.size[1]}",
            'file_size': format_bytes(file_size),
            'has_transparency': False,
            'issue': None
        }
        
        # 检查模式
        if img.mode == 'RGBA':
            # 有 Alpha 通道
            result['has_transparency'] = True
            result['issue'] = None
        elif img.mode == 'LA':
            # 灰度 + Alpha
            result['has_transparency'] = True
            result['issue'] = None
        elif img.mode == 'P':
            # 调色板模式，检查是否有透明色
            if 'transparency' in img.info:
                result['has_transparency'] = True
                result['issue'] = None
            else:
                result['has_transparency'] = False
                result['issue'] = '调色板模式但无透明色'
        elif img.mode == 'RGB':
            # 纯 RGB，没有透明通道
            result['has_transparency'] = False
            result['issue'] = '⚠️ RGB 模式（可能被强制转换）'
        elif img.mode == 'L':
            # 灰度，没有透明通道
            result['has_transparency'] = False
            result['issue'] = '⚠️ 灰度模式（无透明通道）'
        else:
            result['has_transparency'] = False
            result['issue'] = f'⚠️ 未知模式: {img.mode}'
        
        return result
        
    except Exception as e:
        return {
            'path': str(file_path.relative_to(SCAN_DIR)),
            'error': str(e)
        }

def find_all_pngs(directory: str) -> List[Path]:
    """查找所有 PNG 文件"""
    png_files = []
    
    print(f"🔍 正在扫描 {directory} 目录...")
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.png'):
                file_path = Path(root) / file
                png_files.append(file_path)
    
    return png_files

def main():
    print("=" * 70)
    print("      🔬 PNG 透明通道丢失检测工具")
    print("=" * 70)
    print()
    
    # 查找所有 PNG 文件
    png_files = find_all_pngs(SCAN_DIR)
    
    if not png_files:
        print("❌ 没有找到任何 PNG 文件")
        return
    
    print(f"📊 找到 {len(png_files)} 个 PNG 文件")
    print()
    print("🎨 开始检测...")
    print()
    
    # 分类统计
    with_transparency = []
    without_transparency = []
    errors = []
    
    # 逐个检测
    for png_file in png_files:
        result = check_png_transparency(png_file)
        
        if 'error' in result:
            errors.append(result)
            print(f"❌ {result['path']:<50} 错误: {result['error']}")
        elif result['has_transparency']:
            with_transparency.append(result)
            print(f"✅ {result['path']:<50} {result['mode']:<8} {result['size']:<12} {result['file_size']}")
        else:
            without_transparency.append(result)
            print(f"⚠️  {result['path']:<50} {result['mode']:<8} {result['size']:<12} {result['file_size']} - {result['issue']}")
    
    # 打印统计报告
    print()
    print("=" * 70)
    print("📈 统计报告")
    print("=" * 70)
    print(f"✅ 有透明通道:   {len(with_transparency):>4} 个文件")
    print(f"⚠️  无透明通道:   {len(without_transparency):>4} 个文件 【需要检查】")
    print(f"❌ 检测失败:     {len(errors):>4} 个文件")
    print(f"📊 总计:         {len(png_files):>4} 个文件")
    print("=" * 70)
    
    # 生成 JSON 报告
    if without_transparency:
        print()
        print("⚠️  以下文件可能丢失了透明通道：")
        print()
        
        for item in without_transparency:
            print(f"   • {item['path']}")
            print(f"     模式: {item['mode']}, 尺寸: {item['size']}, 大小: {item['file_size']}")
            print(f"     问题: {item['issue']}")
            print()
    
    # 保存报告
    report = {
        'total': len(png_files),
        'with_transparency': len(with_transparency),
        'without_transparency': len(without_transparency),
        'errors': len(errors),
        'files_without_transparency': without_transparency,
        'files_with_transparency': with_transparency,
        'error_files': errors
    }
    
    output_path = Path(OUTPUT_JSON)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print()
    print(f"💾 详细报告已保存至: {OUTPUT_JSON}")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中止")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()

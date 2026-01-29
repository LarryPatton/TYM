#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
快速批量图片压缩脚本
只压缩大于 1MB 的图片，保持高质量
支持多线程并发处理
"""

import os
import sys
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Tuple
import time

# 配置参数
MIN_SIZE_MB = 1  # 只压缩大于 1MB 的文件
QUALITY_JPG = 85  # JPG 质量 (0-100)
QUALITY_PNG = 90  # PNG 质量 (0-100)
MAX_WORKERS = 10  # 并发线程数
IMAGE_DIR = "public"  # 图片目录

def format_bytes(bytes_num: int) -> str:
    """格式化字节数"""
    if bytes_num < 1024:
        return f"{bytes_num} B"
    elif bytes_num < 1024 * 1024:
        return f"{bytes_num / 1024:.1f} KB"
    else:
        return f"{bytes_num / (1024 * 1024):.2f} MB"

def find_large_images(directory: str, min_size_mb: float) -> List[Path]:
    """查找大于指定大小的图片文件"""
    min_size_bytes = min_size_mb * 1024 * 1024
    large_images = []
    
    supported_formats = {'.jpg', '.jpeg', '.png'}
    
    print(f"🔍 正在扫描 {directory} 目录...")
    
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in supported_formats:
                try:
                    size = file_path.stat().st_size
                    if size > min_size_bytes:
                        large_images.append(file_path)
                except Exception:
                    continue
    
    return large_images

def compress_image(file_path: Path) -> Tuple[str, str, str, str]:
    """压缩单个图片文件"""
    try:
        # 获取原始大小
        original_size = file_path.stat().st_size
        
        # 打开图片
        img = Image.open(file_path)
        
        # 转换 RGBA 为 RGB (如果是 PNG)
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')
        
        # 根据格式选择压缩参数
        ext = file_path.suffix.lower()
        
        if ext in ['.jpg', '.jpeg']:
            # JPG 压缩
            img.save(
                file_path,
                'JPEG',
                quality=QUALITY_JPG,
                optimize=True,
                progressive=True
            )
        elif ext == '.png':
            # PNG 压缩（通过降低质量并转为调色板模式）
            img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
            img.save(
                file_path,
                'PNG',
                optimize=True
            )
        
        # 获取压缩后大小
        compressed_size = file_path.stat().st_size
        saved_bytes = original_size - compressed_size
        saved_percent = (saved_bytes / original_size * 100) if original_size > 0 else 0
        
        return (
            file_path.name,
            format_bytes(original_size),
            format_bytes(compressed_size),
            f"{saved_percent:.1f}%"
        )
        
    except Exception as e:
        return (file_path.name, "错误", str(e), "0%")

def main():
    """主函数"""
    print("=" * 60)
    print("      🚀 快速批量图片压缩工具")
    print("=" * 60)
    print()
    
    start_time = time.time()
    
    # 查找大文件
    large_images = find_large_images(IMAGE_DIR, MIN_SIZE_MB)
    
    if not large_images:
        print(f"✅ 没有找到大于 {MIN_SIZE_MB}MB 的图片文件")
        return
    
    print(f"📊 找到 {len(large_images)} 个大于 {MIN_SIZE_MB}MB 的图片")
    print(f"⚙️  使用 {MAX_WORKERS} 个并发线程")
    print()
    print("🎨 开始压缩...")
    print()
    
    # 多线程并发压缩
    total_original = 0
    total_compressed = 0
    success_count = 0
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(compress_image, img): img for img in large_images}
        
        for future in as_completed(futures):
            name, original, compressed, saved = future.result()
            
            if "错误" not in original:
                print(f"✅ {name:<40} {original} → {compressed} (省 {saved})")
                success_count += 1
            else:
                print(f"❌ {name:<40} 压缩失败: {compressed}")
    
    elapsed_time = time.time() - start_time
    
    print()
    print("=" * 60)
    print(f"✨ 压缩完成！")
    print(f"📈 成功: {success_count}/{len(large_images)} 个文件")
    print(f"⏱️  耗时: {elapsed_time:.2f} 秒")
    print("=" * 60)
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中止")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        sys.exit(1)

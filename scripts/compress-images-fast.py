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
MAX_WORKERS = 20  # 并发线程数（提升到20）
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

def compress_image(file_path: Path, jpg_quality: int, png_quality: int) -> Tuple[str, str, str, str]:
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
                quality=jpg_quality,
                optimize=True,
                progressive=True
            )
        elif ext == '.png':
            # PNG 压缩（根据质量参数调整颜色数量）
            # 质量 100% = 256色, 50% = 128色, 以此类推
            colors = max(8, int(256 * (png_quality / 100)))  # 最少8色
            img = img.convert('P', palette=Image.ADAPTIVE, colors=colors)
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

def get_size_threshold() -> float:
    """获取用户输入的文件大小阈值"""
    print("📏 请设置要压缩的图片大小阈值")
    print()
    print("   常用选项：")
    print("   1 = 1MB   (压缩所有大于1MB的图片)")
    print("   2 = 2MB   (只压缩大于2MB的图片)")
    print("   5 = 5MB   (只压缩大于5MB的图片)")
    print("   0.5 = 512KB (压缩所有大于512KB的图片)")
    print()
    
    while True:
        try:
            user_input = input("请输入文件大小阈值(MB) [默认: 1]: ").strip()
            
            # 如果用户直接回车，使用默认值 1MB
            if not user_input:
                return 1.0
            
            threshold = float(user_input)
            
            if threshold <= 0:
                print("❌ 阈值必须大于0，请重新输入")
                continue
            
            if threshold > 100:
                print("❌ 阈值过大，请输入小于100MB的值")
                continue
            
            return threshold
            
        except ValueError:
            print("❌ 输入无效，请输入数字（如：1, 2, 0.5）")
        except KeyboardInterrupt:
            print("\n\n⚠️  用户取消")
            sys.exit(0)

def get_quality_settings() -> tuple:
    """获取用户输入的JPG和PNG质量参数"""
    print()
    print("🎨 请设置压缩质量参数")
    print()
    
    # 获取 JPG 质量
    while True:
        try:
            jpg_input = input("JPG 压缩质量 (0-100) [默认: 85]: ").strip()
            if not jpg_input:
                jpg_quality = 85
                break
            jpg_quality = int(jpg_input)
            if 0 <= jpg_quality <= 100:
                break
            print("❌ JPG质量必须在0-100之间")
        except ValueError:
            print("❌ 请输入有效数字")
        except KeyboardInterrupt:
            print("\n\n⚠️  用户取消")
            sys.exit(0)
    
    # 获取 PNG 质量
    while True:
        try:
            png_input = input("PNG 压缩质量 (0-100) [默认: 90]: ").strip()
            if not png_input:
                png_quality = 90
                break
            png_quality = int(png_input)
            if 0 <= png_quality <= 100:
                break
            print("❌ PNG质量必须在0-100之间")
        except ValueError:
            print("❌ 请输入有效数字")
        except KeyboardInterrupt:
            print("\n\n⚠️  用户取消")
            sys.exit(0)
    
    return jpg_quality, png_quality

def run_compression():
    """执行一次压缩任务"""
    # 获取用户输入的阈值
    min_size_mb = get_size_threshold()
    
    # 获取质量设置
    jpg_quality, png_quality = get_quality_settings()
    
    print()
    print(f"✅ 将压缩所有大于 {min_size_mb} MB 的图片")
    print(f"🎨 JPG 质量: {jpg_quality}%, PNG 质量: {png_quality}%")
    print(f"⚙️  并发线程数: {MAX_WORKERS}")
    print()
    
    start_time = time.time()
    
    # 查找大文件
    large_images = find_large_images(IMAGE_DIR, min_size_mb)
    
    if not large_images:
        print(f"✅ 没有找到大于 {min_size_mb}MB 的图片文件")
        return
    
    print(f"📊 找到 {len(large_images)} 个大于 {min_size_mb}MB 的图片")
    print()
    print("🎨 开始压缩...")
    print()
    
    # 多线程并发压缩
    success_count = 0
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # 使用 lambda 传递质量参数
        futures = {executor.submit(compress_image, img, jpg_quality, png_quality): img for img in large_images}
        
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

def main():
    """主函数 - 循环运行压缩任务"""
    print("=" * 60)
    print("      🚀 快速批量图片压缩工具")
    print("=" * 60)
    print()
    
    while True:
        try:
            # 执行一次压缩
            run_compression()
            
            # 询问是否继续
            print()
            print("=" * 60)
            continue_choice = input("是否继续压缩? (y/回车=继续, n=退出): ").strip().lower()
            
            if continue_choice == 'n':
                print()
                print("👋 感谢使用！再见！")
                print()
                break
            
            # 清屏效果（打印空行）
            print("\n" * 2)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  用户取消")
            break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中止")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        sys.exit(1)

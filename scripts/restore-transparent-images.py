#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
批量恢复丢失透明通道的 PNG 文件
从备份目录复制原始图片到当前项目
"""

import os
import json
import shutil
from pathlib import Path
from typing import List, Dict

# 配置
BACKUP_DIR = r"E:\ZPJ备份\public"
CURRENT_DIR = "public"
REPORT_FILE = "scripts/transparent-loss-report.json"

def load_report() -> Dict:
    """加载检测报告"""
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def restore_files(files_without_transparency: List[Dict]) -> None:
    """从备份恢复文件"""
    print("=" * 70)
    print("      🔄 批量恢复透明通道图片")
    print("=" * 70)
    print()
    print(f"📂 备份目录: {BACKUP_DIR}")
    print(f"📂 目标目录: {CURRENT_DIR}")
    print(f"📊 待恢复文件数: {len(files_without_transparency)}")
    print()
    
    # 统计
    success_count = 0
    skip_count = 0
    error_count = 0
    errors = []
    
    print("🔄 开始复制文件...")
    print()
    
    for item in files_without_transparency:
        relative_path = item['path']
        
        # 构建源文件和目标文件路径
        # 注意：relative_path 使用的是 \ 分隔符（从 Windows 扫描得到）
        source_file = Path(BACKUP_DIR) / relative_path
        target_file = Path(CURRENT_DIR) / relative_path
        
        try:
            # 检查源文件是否存在
            if not source_file.exists():
                skip_count += 1
                print(f"⚠️  源文件不存在: {relative_path}")
                errors.append({
                    'file': relative_path,
                    'error': '源文件不存在'
                })
                continue
            
            # 确保目标目录存在
            target_file.parent.mkdir(parents=True, exist_ok=True)
            
            # 复制文件
            shutil.copy2(source_file, target_file)
            success_count += 1
            print(f"✅ {relative_path}")
            
        except Exception as e:
            error_count += 1
            error_msg = str(e)
            print(f"❌ 复制失败: {relative_path}")
            print(f"   错误: {error_msg}")
            errors.append({
                'file': relative_path,
                'error': error_msg
            })
    
    # 打印统计报告
    print()
    print("=" * 70)
    print("📈 恢复统计")
    print("=" * 70)
    print(f"✅ 成功复制:   {success_count:>4} 个文件")
    print(f"⚠️  跳过:       {skip_count:>4} 个文件 (源文件不存在)")
    print(f"❌ 失败:       {error_count:>4} 个文件")
    print(f"📊 总计:       {len(files_without_transparency):>4} 个文件")
    print("=" * 70)
    
    if errors:
        print()
        print("⚠️  以下文件处理失败：")
        print()
        for err in errors:
            print(f"   • {err['file']}")
            print(f"     错误: {err['error']}")
            print()
    
    if success_count > 0:
        print()
        print(f"🎉 成功恢复 {success_count} 个文件的透明通道！")
        print()

def main():
    print()
    print("正在加载检测报告...")
    
    # 加载报告
    report = load_report()
    files_without_transparency = report.get('files_without_transparency', [])
    
    if not files_without_transparency:
        print("✅ 没有需要恢复的文件！")
        return
    
    print(f"找到 {len(files_without_transparency)} 个需要恢复的文件")
    print()
    
    # 自动执行，无需确认
    print("=" * 70)
    print("⚠️  注意：此操作将从备份目录复制文件，覆盖当前文件！")
    print("=" * 70)
    print()
    print("🚀 自动执行中...")
    print()
    
    # 执行恢复
    restore_files(files_without_transparency)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中止")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()

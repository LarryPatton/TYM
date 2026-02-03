#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置文件转换工具：将硬编码路径转换为 imageRef 引用

功能：
1. 读取 JavaScript 配置文件
2. 提取每个作品的 image 路径
3. 从路径解析出 module, subcategory, index
4. 生成新格式的配置（使用 imageRef）
5. 移除 aspectType 字段（从 manifest 自动获取）
"""

import re
import sys
from pathlib import Path

def extract_image_info(image_path):
    """
    从图片路径提取模块、子分类和索引
    
    例如: '/gallery/form-structure/写意人物/xieyi-renwu-001.png'
    返回: ('form-structure', '写意人物', 1)
    """
    # /gallery/{module}/{subcategory}/{filename}
    # 文件名格式: xxx-001.png 或 xxx-xx-001.png
    pattern = r'/gallery/([^/]+)/([^/]+)/.*-(\d+)\.'
    match = re.search(pattern, image_path)
    
    if match:
        module = match.group(1)
        subcategory = match.group(2)
        index = int(match.group(3))
        return (module, subcategory, index)
    else:
        print(f"警告：无法解析路径 {image_path}")
        return None

def convert_work_to_imageref(work_text, module_name):
    """
    将单个作品配置从旧格式转换为新格式
    
    旧格式:
    {
      id: 1,
      title: '写意人物·01',
      category: '写意人物',
      media: '国画',
      year: '2023',
      image: '/gallery/form-structure/写意人物/xieyi-renwu-001.png',
      aspectType: 'portrait'
    }
    
    新格式:
    {
      id: 1,
      title: '写意人物·01',
      category: '写意人物',
      media: '国画',
      year: '2023',
      imageRef: {
        module: 'form-structure',
        subcategory: '写意人物',
        index: 1
      }
    }
    """
    # 提取 image 路径
    image_match = re.search(r"image:\s*'([^']+)'", work_text)
    if not image_match:
        return work_text  # 已经是新格式或没有 image 字段
    
    image_path = image_match.group(1)
    image_info = extract_image_info(image_path)
    
    if not image_info:
        return work_text
    
    module, subcategory, index = image_info
    
    # 构建新的 imageRef
    imageref_text = f"""imageRef: {{
      module: '{module}',
      subcategory: '{subcategory}',
      index: {index}
    }}"""
    
    # 移除 image 和 aspectType 行
    new_text = re.sub(r",?\s*image:\s*'[^']+',?\s*\n", f",\n    {imageref_text}\n", work_text)
    new_text = re.sub(r",?\s*aspectType:\s*'[^']+',?\s*\n", "\n", new_text)
    
    return new_text

def convert_file(input_file, module_name, output_file=None):
    """
    转换整个配置文件
    """
    if output_file is None:
        output_file = input_file
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 添加模块名称常量（如果不存在）
    if 'const MODULE_NAME' not in content:
        # 在第一行注释后插入
        lines = content.split('\n')
        insert_index = 1  # 第二行
        for i, line in enumerate(lines):
            if line.strip().startswith('//'):
                insert_index = i + 1
            else:
                break
        
        module_const = f"\n// 模块名称常量\nconst MODULE_NAME = '{module_name}';\n"
        lines.insert(insert_index, module_const)
        content = '\n'.join(lines)
    
    # 找到所有作品对象（以 { id: 开头，} 结尾）
    work_pattern = r'(\{[^}]*?id:\s*\d+[^}]*?\})'
    
    def replace_work(match):
        work_text = match.group(1)
        return convert_work_to_imageref(work_text, module_name)
    
    new_content = re.sub(work_pattern, replace_work, content, flags=re.DOTALL)
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 转换完成: {input_file}")
    return new_content

def main():
    """主函数"""
    if len(sys.argv) < 3:
        print("用法: python convert-to-imageref.py <文件路径> <模块名>")
        print("例如: python convert-to-imageref.py src/data/formStructureWorks.js form-structure")
        sys.exit(1)
    
    input_file = sys.argv[1]
    module_name = sys.argv[2]
    
    if not Path(input_file).exists():
        print(f"错误：文件不存在 {input_file}")
        sys.exit(1)
    
    convert_file(input_file, module_name)

if __name__ == '__main__':
    main()

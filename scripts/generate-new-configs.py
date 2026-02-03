#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 manifest 和旧配置生成新格式的配置文件

策略：
1. 读取 manifest 获取所有文件信息
2. 读取旧配置获取元数据（title, category, media, year）
3. 合并生成新格式配置
"""

import json
import re
from pathlib import Path

def load_manifest():
    """加载 gallery-manifest.json"""
    manifest_file = Path('public/gallery-manifest.json')
    with open(manifest_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_old_metadata(config_file):
    """
    从旧配置文件提取元数据
    返回: {id: {title, category, media, year}}
    """
    with open(config_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取所有作品配置
    pattern = r'\{[^}]*?id:\s*(\d+)[^}]*?title:\s*\'([^\']+)\'[^}]*?category:\s*\'([^\']+)\'[^}]*?media:\s*\'([^\']+)\'[^}]*?year:\s*\'([^\']+)\'[^}]*?\}'
    
    metadata = {}
    for match in re.finditer(pattern, content, re.DOTALL):
        work_id = int(match.group(1))
        metadata[work_id] = {
            'title': match.group(2),
            'category': match.group(3),
            'media': match.group(4),
            'year': match.group(5)
        }
    
    return metadata

def get_helper_functions(module_name):
    """
    根据模块返回相应的辅助函数代码
    """
    if module_name == 'material-texture':
        return """
// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '板绘': ['板绘1', '板绘2', '板绘3', '板绘4', '板绘5'],
  '水彩': ['水彩1', '水彩2'],
  '色粉': ['色粉1', '色粉2', '色粉3', '色粉4', '色粉5']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 获取所有媒介类型
export const getAllMediaTypes = () => {
  return Object.keys(MEDIA_CATEGORIES);
};

// 判断图片比例类型
export const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 筛选作品
export const filterWorks = (works, mediaTypes, aspectType) => {
  return works.filter(work => {
    const mediaMatch = mediaTypes.includes(work.media);
    const aspectMatch = work.aspectType === aspectType;
    return mediaMatch && aspectMatch;
  });
};
"""
    elif module_name == 'form-structure':
        return """
// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '国画': ['写意人物', '小写意山水', '小写意花鸟', '工笔', '白描', '白描风景', '绢本组图'],
  '素描': ['素描'],
  '水彩': ['水彩'],
  '版画': ['版画'],
  '雕塑': ['雕塑'],
  '构成': ['平面构成', '立体', '画面构成分析', '材料探索', '综合材料']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 判断图片比例类型
export const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 获取所有媒介类别
export const getAllMediaTypes = () => Object.keys(MEDIA_CATEGORIES);

// 根据媒介筛选作品
export const filterByMedia = (works, selectedMedia) => {
  if (selectedMedia.length === 0 || selectedMedia.length === getAllMediaTypes().length) {
    return works;
  }
  return works.filter(work => selectedMedia.includes(work.media));
};

// 根据比例类型筛选作品
export const filterByAspectType = (works, aspectType) => {
  if (aspectType === 'portrait') {
    return works.filter(work => work.aspectType === 'portrait' || work.aspectType === 'square');
  } else if (aspectType === 'landscape') {
    return works.filter(work => work.aspectType === 'landscape' || work.aspectType === 'square');
  }
  return works;
};

// 组合筛选
export const filterWorks = (works, selectedMedia, aspectType) => {
  let filtered = filterByMedia(works, selectedMedia);
  filtered = filterByAspectType(filtered, aspectType);
  return filtered;
};
"""
    else:  # narrative-imagery
        return """
// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '综合': ['综合'],
  '板绘': ['板绘'],
  '国画': ['国画'],
  '水彩': ['水彩']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 获取所有媒介类型（返回数组）
export const getAllMediaTypes = () => {
  const allTypes = [];
  for (const types of Object.values(MEDIA_CATEGORIES)) {
    allTypes.push(...types);
  }
  return [...new Set(allTypes)];
};

// 筛选作品
export const filterWorks = (works, mediaTypes, aspectType) => {
  return works.filter(work => {
    const mediaMatch = mediaTypes.includes(work.media);
    const aspectMatch = work.aspectType === aspectType;
    return mediaMatch && aspectMatch;
  });
};
"""

def generate_new_config(module_name, module_display_name, metadata, manifest):
    """
    生成新格式的配置文件内容
    """
    module_data = manifest['modules'][module_name]
    
    # 文件头部
    # 转换模块名为驼峰格式：material-texture -> materialTexture
    camel_name = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(module_name.split('-')))
    
    output = f"""// {module_display_name} 模块作品数据配置

// 模块名称常量
const MODULE_NAME = '{module_name}';

// 作品数据配置
export const {camel_name}Works = [
"""
    
    work_id = 1
    for subcat_name, subcat_data in module_data['subcategories'].items():
        files = subcat_data['files']
        output += f"\n  // {subcat_name} ({len(files)}张)\n"
        
        for file_info in files:
            # 获取元数据
            meta = metadata.get(work_id, {
                'title': f'{subcat_name}·{file_info["index"]:02d}',
                'category': subcat_name,
                'media': '未知',
                'year': '2023'
            })
            
            output += f"""  {{
    id: {work_id},
    title: '{meta['title']}',
    category: '{meta['category']}',
    media: '{meta['media']}',
    year: '{meta['year']}',
    imageRef: {{
      module: MODULE_NAME,
      subcategory: '{subcat_name}',
      index: {file_info['index']}
    }}
  }},
"""
            work_id += 1
    
    output += "];\n\n"
    
    # 添加辅助函数
    output += get_helper_functions(module_name)
    
    return output

def main():
    """主函数"""
    manifest = load_manifest()
    
    # 转换 material-texture
    print("📦 处理 material-texture...")
    metadata_mt = extract_old_metadata('src/data/materialTextureWorks.js.backup')
    new_config_mt = generate_new_config('material-texture', 'Material & Texture', metadata_mt, manifest)
    
    with open('src/data/materialTextureWorks.js', 'w', encoding='utf-8') as f:
        f.write(new_config_mt)
    
    print(f"✅ material-texture 转换完成 ({len(metadata_mt)} 个作品)")
    
    # 转换 form-structure
    print("\n📦 处理 form-structure...")
    metadata_fs = extract_old_metadata('src/data/formStructureWorks.js.backup')
    new_config_fs = generate_new_config('form-structure', 'Form & Structure', metadata_fs, manifest)
    
    with open('src/data/formStructureWorks.js', 'w', encoding='utf-8') as f:
        f.write(new_config_fs)
    
    print(f"✅ form-structure 转换完成 ({len(metadata_fs)} 个作品)")
    
    # 转换 narrative-imagery
    print("\n📦 处理 narrative-imagery...")
    metadata_ni = extract_old_metadata('src/data/narrativeImageryWorks.js.backup')
    new_config_ni = generate_new_config('narrative-imagery', 'Narrative Imagery', metadata_ni, manifest)
    
    with open('src/data/narrativeImageryWorks.js', 'w', encoding='utf-8') as f:
        f.write(new_config_ni)
    
    print(f"✅ narrative-imagery 转换完成 ({len(metadata_ni)} 个作品)")
    
    print(f"\n🎉 所有配置文件转换完成！总计 {len(metadata_mt) + len(metadata_fs) + len(metadata_ni)} 个作品")

if __name__ == '__main__':
    main()

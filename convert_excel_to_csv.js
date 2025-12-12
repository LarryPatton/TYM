import XLSX from 'xlsx';
import * as fs from 'fs';
import { join } from 'path';

const inputFilePath = 'ai关键词.xlsx';
const outputFilePath = 'public/themes.csv';

try {
  if (fs.existsSync(inputFilePath)) {
    const workbook = XLSX.readFile(inputFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 按行读取数据
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 3) {
      console.error('Excel file format error: Not enough rows.');
      process.exit(1);
    }

    const headerRow = data[0]; // 第一行：大类名称
    // const subHeaderRow = data[1]; // 第二行：类别/关键词 (不需要处理，仅作参考)
    const contentRows = data.slice(2); // 第三行开始是内容

    let csvContent = 'category,id,name,en,prompt,image_path,is_featured\n';
    let idCounters = {}; // 用于生成唯一ID

    // 中文大类到英文目录名的映射表
    const categoryMap = {
      "建筑": "architecture",
      "传统绘画": "traditional_painting",
      "数字艺术": "digital_art",
      "插画": "illustration",
      "平面设计": "graphic_design",
      "摄影": "photography",
      "动画": "animation",
      "工业设计": "industrial_design",
      "景观 / 城市设计": "landscape_urban",
      "材质表现": "material",
      "未来科幻": "sci_fi",
      "奇幻神话": "fantasy",
      "地域文化": "culture",
      "时尚服饰": "fashion",
      "自然生物": "nature",
      "实验抽象": "abstract",
      "影视语言": "cinematic",
      "游戏美术": "game_art",
      "氛围情绪": "mood",
      "艺术家风格": "artist_style"
    };

    // 遍历每一列（步长为2，因为每两列是一个大类）
    for (let col = 0; col < headerRow.length; col += 2) {
      const category = headerRow[col];
      
      if (!category) continue; // 跳过空列

      // 获取对应的英文目录名，如果没有映射则使用拼音或默认值
      const dirName = categoryMap[category] || 'others';

      // 初始化该分类的ID计数器
      if (!idCounters[category]) {
        idCounters[category] = 1;
      }

      // 遍历每一行，提取该分类下的数据
      for (let row = 0; row < contentRows.length; row++) {
        const rowData = contentRows[row];
        const name = rowData[col];      // 中文类别
        const en = rowData[col + 1];    // 英文关键词

        // 如果中文名或英文名为空，则跳过该行
        if (!name || !en) continue;

        const id = `cat${Math.floor(col/2) + 1}_item${idCounters[category]++}`;

        // 处理 CSV 转义
        const safeName = `"${String(name).replace(/"/g, '""')}"`;
        const safeEn = `"${String(en).replace(/"/g, '""')}"`;
        const safePrompt = safeEn; 

        // 生成图片路径: /images/themes/[dirName]/[中文]_[英文].png
        // 1. 移除英文中的非法文件名字符 (如 / \ : * ? " < > |)
        // 2. 保留空格 (因为您的示例中有空格)
        const cleanEn = String(en).replace(/[\/\\:*?"<>|]/g, '_');
        const cleanName = String(name).replace(/[\/\\:*?"<>|]/g, '_');
        
        const filename = `${cleanName}_${cleanEn}.png`;
        const imagePath = `/images/themes/${dirName}/${filename}`;

        // 默认逻辑：每个大类的前 4 个子项设为精选
        // idCounters[category] 在上面已经自增过了，所以这里判断是否 <= 5 (因为从1开始，且上面已经++)
        // 实际上 idCounters[category] 当前值是 下一个ID，所以当前ID是 idCounters[category] - 1
        const currentCount = idCounters[category] - 1;
        const isFeatured = (currentCount <= 4) ? 'true' : '';

        csvContent += `"${category}",${id},${safeName},${safeEn},${safePrompt},"${imagePath}",${isFeatured}\n`;
      }
    }

    // 写入 CSV 文件
    fs.writeFileSync(outputFilePath, csvContent, 'utf8');
    console.log(`Successfully converted Excel to CSV: ${outputFilePath}`);

  } else {
    console.log(`File not found: ${inputFilePath}`);
  }
} catch (error) {
  console.error('Error converting file:', error);
}
import XLSX from 'xlsx';
import * as fs from 'fs';

const inputFilePath = '项目提示词.xlsx';
const outputProjectsPath = 'public/projects.csv';
const outputSectionsPath = 'public/project_sections.csv'; // 新增输出文件

try {
  if (fs.existsSync(inputFilePath)) {
    const workbook = XLSX.readFile(inputFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 2) {
      console.error('Excel file format error: Not enough rows.');
      process.exit(1);
    }

    // --- 1. 准备 projects.csv 内容 ---
    let projectsCsvContent = 'id,type,name,cover,description,is_featured,template_type\n';
    
    // --- 2. 准备 project_sections.csv 内容 ---
    let sectionsCsvContent = 'project_id,category\n';

    let projectCounter = 0; 
    let currentType = ''; 
    let currentProjectId = '';
    
    // 用于去重：记录每个项目已经添加过的分类
    let projectCategories = {}; 

    const templateTypes = ['immersive', 'split', 'magazine'];

    // 从第 2 行开始遍历
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const typeRaw = row[0]; // 内外部信息
      const nameRaw = row[1]; // 游戏项目
      const categoryRaw = row[2]; // 分类 (第三列)

      // 更新内外部状态
      if (typeRaw) {
        currentType = typeRaw.trim();
      }

      // 检测新项目
      if (nameRaw) {
        const name = nameRaw.trim();
        if (currentType && name) {
          projectCounter++;
          currentProjectId = `proj_${projectCounter}`;
          projectCategories[currentProjectId] = new Set(); // 初始化该项目的分类集合

          // --- 写入 projects.csv ---
          const cover = '';
          const description = '';
          const isFeatured = (projectCounter <= 7) ? 'true' : '';
          const templateType = templateTypes[(projectCounter - 1) % 3];

          const safeName = `"${name.replace(/"/g, '""')}"`;
          const safeType = `"${currentType.replace(/"/g, '""')}"`;
          const safeDesc = "";
          const safeCover = "";

          projectsCsvContent += `${currentProjectId},${safeType},${safeName},${safeCover},${safeDesc},${isFeatured},${templateType}\n`;
        }
      }

      // --- 处理分类 (Section) ---
      // 只要当前行属于某个项目，且有分类信息
      if (currentProjectId && categoryRaw) {
        const category = categoryRaw.trim();
        
        // 如果该分类在这个项目中还没出现过，则添加
        if (!projectCategories[currentProjectId].has(category)) {
          projectCategories[currentProjectId].add(category);
          
          const safeCategory = `"${category.replace(/"/g, '""')}"`;
          sectionsCsvContent += `${currentProjectId},${safeCategory}\n`;
        }
      }
    }

    // 写入文件
    fs.writeFileSync(outputProjectsPath, projectsCsvContent, 'utf8');
    console.log(`Successfully converted: ${outputProjectsPath}`);

    fs.writeFileSync(outputSectionsPath, sectionsCsvContent, 'utf8');
    console.log(`Successfully converted: ${outputSectionsPath}`);

  } else {
    console.log(`File not found: ${inputFilePath}`);
  }
} catch (error) {
  console.error('Error converting file:', error);
}

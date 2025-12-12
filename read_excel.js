import XLSX from 'xlsx';
import * as fs from 'fs';

// 假设文件在根目录下，如果不是请告诉我
const filePath = 'ai关键词.xlsx';

try {
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 将工作表转换为 JSON 对象数组
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // header: 1 表示按行读取数组

    console.log(`Sheet Name: ${sheetName}`);
    console.log(`Total Rows: ${data.length}`);
    console.log('--- First 10 Rows ---');
    // 打印前10行，以便看清结构
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
  } else {
    console.log(`File not found: ${filePath}`);
  }
} catch (error) {
  console.error('Error reading file:', error);
}
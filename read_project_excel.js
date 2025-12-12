import XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = '项目提示词.xlsx';

try {
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log(`Sheet Name: ${sheetName}`);
    console.log(`Total Rows: ${data.length}`);
    console.log('--- First 10 Rows ---');
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
  } else {
    console.log(`File not found: ${filePath}`);
  }
} catch (error) {
  console.error('Error reading file:', error);
}

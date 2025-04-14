import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} ExcelRow
 * @property {number} Question Number
 * @property {string} Types
 * @property {string} Statements
 */

/**
 * @typedef {Object} TriadQuestion
 * @property {string} id
 * @property {number} questionNumber
 * @property {Array<{type: string, text: string}>} statements
 */

function convertExcelToJson() {
  const workbook = xlsx.readFile('Quiz-triad.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet);

  // Group statements by question number
  const questionGroups = {};
  
  rows.forEach(row => {
    const questionNum = row['Question Number'];
    if (!questionGroups[questionNum]) {
      questionGroups[questionNum] = {
        id: `triad-${questionNum}`,
        questionNumber: questionNum,
        statements: []
      };
    }
    
    // Extract just the number from the Types column
    const typeStr = String(row['Types']);
    const typeNumber = typeStr.match(/\d+/)?.[0] || typeStr;
    const formattedType = `type${typeNumber}`;
    
    questionGroups[questionNum].statements.push({
      type: formattedType,
      text: row['Statements']
    });
  });

  // Convert to array and sort by question number
  const triadQuestions = Object.values(questionGroups)
    .sort((a, b) => a.questionNumber - b.questionNumber);

  const outputPath = path.join(__dirname, '../src/data/triad-questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(triadQuestions, null, 2));
  
  // Debug logging
  console.log('✅ Successfully converted Quiz-triad.xlsx to triad-questions.json');
  console.log('First question sample:', triadQuestions[0]);
  console.log('Types in first question:', triadQuestions[0].statements.map(s => s.type));
}

convertExcelToJson(); 
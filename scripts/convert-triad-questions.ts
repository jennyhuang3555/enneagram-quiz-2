import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

interface ExcelRow {
  'Question Number': number;
  'Types': string;
  'Statements': string;
}

function convertExcelToJson() {
  const workbook = xlsx.readFile('Quiz-triad.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);

  const questions: { [key: number]: TriadQuestion } = {};

  rows.forEach(row => {
    const questionNum = row['Question Number'];
    
    if (!questions[questionNum]) {
      questions[questionNum] = {
        id: `triad-${questionNum}`,
        questionNumber: questionNum,
        statements: []
      };
    }

    questions[questionNum].statements.push({
      type: row['Types'],
      text: row['Statements']
    });
  });

  const outputPath = path.join(__dirname, '../src/data/triad-questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(Object.values(questions), null, 2));
  
  console.log('✅ Successfully converted Quiz-triad.xlsx to triad-questions.json');
}

convertExcelToJson(); 
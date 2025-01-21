import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Read the Excel file
const workbook = XLSX.readFile('quiz-questions.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Transform the data into our quiz format
const questions = jsonData.map((row: any) => ({
  id: crypto.randomUUID(),
  text: row.Question || row.question || '',
  category: row.Type || row.type || 'uncategorized',
}));

// Create the full quiz data structure
const quizData = {
  questions,
  resultRanges: [
    {
      id: "1",
      category: "type1",
      minScore: 0,
      maxScore: 25,
      title: "Result 1",
      description: "Description for result 1"
    },
    // Add more result ranges as needed
  ]
};

// Write to JSON file
fs.writeFileSync(
  path.join(__dirname, '../data/quiz-questions.json'),
  JSON.stringify(quizData, null, 2)
);

console.log('JSON file created successfully!'); 
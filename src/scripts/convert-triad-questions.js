import xlsx from 'xlsx';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertTriadQuestions() {
  try {
    // Read the triad questions Excel file
    const excelPath = join(__dirname, '../../Quiz-triad-1.xlsx');
    console.log('Reading Triad Excel file from:', excelPath);

    const workbook = xlsx.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Group questions by question number
    const triadQuestions = [];
    const questionGroups = {};

    jsonData.forEach(row => {
      const questionNumber = row['Question Number'];
      if (!questionGroups[questionNumber]) {
        questionGroups[questionNumber] = [];
      }
      questionGroups[questionNumber].push({
        text: row['Statements'],
        type: `type${row['Types']}`
      });
    });

    // Convert groups to final format
    Object.entries(questionGroups).forEach(([questionNumber, statements]) => {
      triadQuestions.push({
        questionNumber: parseInt(questionNumber),
        question: "Select in order of what you most agree with",
        statements: statements
      });
    });

    // Read existing quiz questions
    const quizPath = join(__dirname, '../data/quiz-questions.json');
    const quizData = JSON.parse(readFileSync(quizPath, 'utf8'));

    // Add triad questions to the data structure
    const updatedQuizData = {
      ...quizData,
      triadQuestions
    };

    // Write updated quiz data
    writeFileSync(
      quizPath,
      JSON.stringify(updatedQuizData, null, 2)
    );

    console.log('Successfully added triad questions to quiz data!');
  } catch (error) {
    console.error('Error converting triad questions:', error);
    console.error('Error stack:', error.stack);
  }
}

convertTriadQuestions(); 
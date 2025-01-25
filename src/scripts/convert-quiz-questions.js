import xlsx from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertQuizQuestions() {
  try {
    // Updated path to read from root directory
    const excelPath = join(__dirname, '../../quiz-questions.xlsx');
    console.log('Reading Excel file from:', excelPath);

    // Read Excel file
    const workbook = xlsx.readFile(excelPath);
    console.log('Available sheets:', workbook.SheetNames);
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log('Found', jsonData.length, 'questions');

    // Transform the data into our quiz format
    const questions = jsonData.map((row) => ({
      id: crypto.randomUUID(),
      text: row.Question || row.question || '',
      category: row.Type || row.type || 'uncategorized',
    }));

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
        }
      ]
    };

    // Write to src/data directory
    const outputPath = join(__dirname, '../data/quiz-questions.json');
    console.log('Writing JSON to:', outputPath);

    // Create data directory if it doesn't exist
    const dataDir = dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to JSON file
    writeFileSync(outputPath, JSON.stringify(quizData, null, 2));
    
    console.log('Quiz questions converted successfully!');
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
  }
}

convertQuizQuestions(); 
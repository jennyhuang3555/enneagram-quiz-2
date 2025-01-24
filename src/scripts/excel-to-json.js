import xlsx from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function formatListItem(content) {
  // Remove all bullet variations and clean up whitespace
  content = content
    .replace(/^• /, '')          // Remove the specific '• ' pattern
    .replace(/^[\s•\-•·]+/g, '') // Remove any other bullet variations
    .replace(/^\s*•?\s*/, '')    // Remove any remaining bullets
    .replace(/^\s*\*\s*/, '')    // Remove asterisks if present
    .trim();                     // Clean up whitespace
  
  return content;
}

function splitChallengingPatterns(content) {
  // Split the paragraph into separate items
  // Look for patterns like "1s" at the start of sentences or periods followed by "They"
  return content
    .split(/(?<=\.)\s*(?=They)|(?<=\.)\s*(?=1s)/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

function getTypeTitle(typeNumber) {
  const titles = {
    1: 'The Perfectionist',
    2: 'The Helper',
    3: 'The Achiever',
    4: 'The Individualist',
    5: 'The Observer',
    6: 'The Loyalist',
    7: 'The Enthusiast',
    8: 'The Challenger',
    9: 'The Peacemaker'
  };
  
  return `Type ${typeNumber}: ${titles[typeNumber]}`;
}

function convertExcelToTypeDescriptions() {
  try {
    // Read Excel file
    const workbook = xlsx.readFile(join(__dirname, '../data/type-descriptions.xlsx'));
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // Group by type
    const typeDescriptions = {};
    
    // First pass: Initialize all types and their arrays
    data.forEach(row => {
      const typeNumber = row['Type Number'];
      if (!typeDescriptions[`type${typeNumber}`]) {
        typeDescriptions[`type${typeNumber}`] = {
          title: getTypeTitle(typeNumber),
          inNutshell: '',
          motivationAndFears: '',
          worldview: '',
          blindSpots: [],
          strengths: [],
          triggers: [],
          challengingPatterns: [],
          growthDescription: '',    // Add this for Growth Questions intro paragraph
          growthQuestions: []
        };
      }
    });

    // Second pass: Process all content
    data.forEach(row => {
      const typeNumber = row['Type Number'];
      const sectionName = row['Section Name'];
      const contentType = row['Content Type'];
      const content = row['Content'] || '';
      
      const type = typeDescriptions[`type${typeNumber}`];
      
      switch(sectionName) {
        case 'In a nutshell':
          if (contentType === 'paragraph' && !type.inNutshell) {
            type.inNutshell = content.trim();
          }
          break;
          
        case 'Motivation and core fears':
          if (contentType === 'paragraph' && !type.motivationAndFears) {
            type.motivationAndFears = content.trim();
          }
          break;
          
        case 'Worldview and Focus of Attention':
          if (contentType === 'paragraph' && !type.worldview) {
            type.worldview = content.trim();
          }
          break;
          
        case 'Blind Spots':
          if (contentType === 'list') {
            type.blindSpots.push(formatListItem(content));
          }
          break;
          
        case 'Strengths and Gifts':
          if (contentType === 'list') {
            type.strengths.push(formatListItem(content));
          }
          break;
          
        case 'Triggers':
          if (contentType === 'list') {
            type.triggers.push(formatListItem(content));
          }
          break;
          
        case 'Challenging Patterns':
          if (contentType === 'list') {
            type.challengingPatterns.push(formatListItem(content));
          }
          break;
          
        case 'Growth Questions':
          if (contentType === 'paragraph') {
            // Handle the intro paragraphs
            if (!type.growthDescription) {
              type.growthDescription = content.trim();
            }
          } else if (contentType === 'list') {
            // Handle the actual questions
            type.growthQuestions.push(formatListItem(content));
          }
          break;
      }
    });
    
    // Clean up any empty arrays
    Object.values(typeDescriptions).forEach(type => {
      ['blindSpots', 'strengths', 'triggers', 'challengingPatterns', 'growthQuestions'].forEach(arrayProp => {
        type[arrayProp] = type[arrayProp]
          .filter(item => item && item.trim() !== '')
          .map(item => formatListItem(item));
      });
    });

    // Generate TypeScript file
    const tsContent = `// Auto-generated from Excel file
export const typeDescriptions = ${JSON.stringify(typeDescriptions, null, 2)} as const;

// Type definitions for better TypeScript support
export type TypeNumber = keyof typeof typeDescriptions;
export type TypeDescription = {
  title: string;
  inNutshell: string;
  motivationAndFears: string;
  worldview: string;
  blindSpots: string[];
  strengths: string[];
  triggers: string[];
  challengingPatterns: string[];
  growthDescription: string;
  growthQuestions: string[];
};
`;
    
    writeFileSync(join(__dirname, '../data/typeDescriptions.ts'), tsContent);
    
    console.log('TypeScript file generated successfully!');
  } catch (error) {
    console.error('Error converting Excel:', error);
  }
}

convertExcelToTypeDescriptions(); 
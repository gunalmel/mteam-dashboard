/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Directory containing JSON files
const templateDirectoryPath = path.join(dirname, 'expected-data');
const testDataOutputDirectoryPath = path.join(dirname, '../build/test-data');

// Improved regex pattern to match 'YYYY-MM-DD HH:MM:SS' date strings, allowing extra characters after the seconds
const datePattern = /\b(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\d*)\b/g;

// Get the current UTC date (year, month, day)
const now = new Date();
const currentYear = now.getUTCFullYear();
const currentMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
const currentDay = String(now.getUTCDate()).padStart(2, '0');

// Function to replace the year, month, and day in date strings with the current UTC values
function replaceDatePartsInDates(content) {
  return content.replace(datePattern, (match, year, month, day, hour, minute, second, extra = '') => {
    // Replace the year, month, and day with the current UTC year, month, and day
    return `${currentYear}-${currentMonth}-${currentDay} ${hour}:${minute}:${second}${extra}`;
  });
}

// Read all JSON files in the directory
fs.readdir(templateDirectoryPath, (err, files) => {
  if (err) {
    console.error(`Could not list the directory.`, err);
    process.exit(1);
  }

  files.forEach((file) => {
    // Check if the file is a JSON file
    if (path.extname(file) === '.json') {
      const filePath = path.join(templateDirectoryPath, file);

      // Read the JSON file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${filePath}:`, err);
          return;
        }

        // Replace the year, month, and day in date strings
        const updatedData = replaceDatePartsInDates(data);

        const outputFilePath = path.join(testDataOutputDirectoryPath, file);
        // Write the updated data back to the file
        if (!fs.existsSync(testDataOutputDirectoryPath)){
          fs.mkdirSync(testDataOutputDirectoryPath, { recursive: true });
        }
        fs.writeFile(outputFilePath, updatedData, 'utf8', (err) => {
          if (err) {
            console.error(`Error writing file ${outputFilePath}:`, err);
          } else {
            console.log(`Updated ${outputFilePath}`);
          }
        });
      });
    }
  });
});
/* eslint-enable no-undef */

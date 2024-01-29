const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

// Path ke file JSON
const classDataPath = path.join(__dirname, 'data', 'class-data.json');
const knnResultPath = path.join(__dirname, 'data', 'data-hasil-knn.json');
const knnFinalPath = path.join(__dirname, 'data', 'knn-final.json');

// Baca data dari file JSON
const classData = require(classDataPath);
const knnResult = require(knnResultPath);
const knnFinal = require(knnFinalPath);

// Buat workbook Excel baru
const workbook = xlsx.utils.book_new();

// Buat sheet1 untuk class-data.json
const classWorksheet = xlsx.utils.json_to_sheet(classData);
xlsx.utils.book_append_sheet(workbook, classWorksheet, 'Sheet1');

// Buat sheet2 untuk data-hasil-knn.json
const knnResultWorksheet = xlsx.utils.json_to_sheet(knnResult);
xlsx.utils.book_append_sheet(workbook, knnResultWorksheet, 'Sheet2');

// Buat sheet3 untuk knn-final.json
const knnFinalWorksheet = xlsx.utils.json_to_sheet(knnFinal);
xlsx.utils.book_append_sheet(workbook, knnFinalWorksheet, 'Sheet3');

// Simpan workbook ke file Excel
const excelFileName = path.join(__dirname, 'data', 'Hasil-KNN-Final.xlsx');
xlsx.writeFile(workbook, excelFileName);

console.log(`File Excel ${excelFileName} telah dibuat.`);

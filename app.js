const fs = require('fs');
const xlsx = require('xlsx');

// Fungsi untuk menghitung jarak Euclidean antara dua data
function euclideanDistance(data1, data2) {
  let sum = 0;
  for (let key in data1) {
    if (key !== 'id' && key !== 'CLASS cardio') {
      sum += Math.pow(data1[key] - data2[key], 2);
    }
  }
  return Math.sqrt(sum);
}

// Baca data dari file Excel
const workbook = xlsx.readFile('data/data.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Data testing
const testingData = {
  "gender": 2,
  "height": 166,
  "weight": "69.0",
  "ap_hi": 110,
  "ap_lo": 60,
  "cholesterol": 2,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1,
  "CLASS cardio": "?"
};

// Hitung jarak dari data testing ke setiap data dalam file JSON
const distances = data.map(d => ({
  ...d,
  "Square distance to query distance": Math.round(euclideanDistance(d, testingData))
}));

// Buat objek untuk data class-data.json
const classData = distances.map((d, index) => ({
  ...d,
  "Square distance to query distance": d["Square distance to query distance"]
}));

// Simpan data class-data.json ke dalam file JSON
fs.writeFile('data/class-data.json', JSON.stringify(classData, null, 2), err => {
  if (err) throw err;
  console.log('Data class-data.json telah disimpan.');
});

// Urutkan berdasarkan jarak terkecil
distances.sort((a, b) => a["Square distance to query distance"] - b["Square distance to query distance"]);

// Tentukan nilai KNN
const k = 5;
const kNearestNeighbors = distances.slice(0, k);

// Tentukan nilai y (kategori nearest neighbor)
let y;
const countClass1 = kNearestNeighbors.filter(n => n["CLASS cardio"] === 1).length;
const countClass0 = kNearestNeighbors.filter(n => n["CLASS cardio"] === 0).length;

if (countClass1 > countClass0) {
  y = 1;
} else {
  y = 0;
}

// Buat objek hasil KNN
const knnResult = distances.map((n, index) => ({
  ...n,
  "jarak terkecil": index + 1,
  "k": index < k ? "ya" : "tidak",
  "y": index < k ? y : "-"
}));

// Simpan hasil KNN ke dalam file JSON
fs.writeFile('data/data-hasil-knn.json', JSON.stringify(knnResult, null, 2), err => {
  if (err) throw err;
  console.log('Hasil KNN telah disimpan dalam file data-hasil-knn.json');

  // Buat file knn-final.json yang hanya berisi data dengan k = 'ya'
  const knnFinal = knnResult.filter(item => item.k === 'ya');
  fs.writeFile('data/knn-final.json', JSON.stringify(knnFinal, null, 2), err => {
    if (err) throw err;
    console.log('File knn-final.json telah dibuat.');
  });
});

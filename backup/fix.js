const fs = require('fs');

// Nombre del archivo de entrada
const inputFile = 'words-backup-2025-10-09T04-30-00-899Z.json';
const outputFile = 'words-backup-migrated.json';

// Campos válidos según el nuevo modelo (sin difficulty porque lo manejaremos aparte)
const validFields = [
  '_id',
  'word',
  'language',
  'definition',
  'examples',
  'sinonyms',
  'type',
  'IPA',
  'seen',
  'img',
  'codeSwitching',
  'spanish',
  'chat',
  'createdAt',
  'updatedAt'
];

// Leer el archivo JSON
console.log('📖 Leyendo archivo...');
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Procesar cada palabra
console.log(`🔄 Procesando ${data.data.totalWords} palabras...`);
const migratedWords = data.data.words.map((word, index) => {
  // Crear nuevo objeto solo con campos válidos
  const migratedWord = {};
  
  validFields.forEach(field => {
    if (word.hasOwnProperty(field)) {
      migratedWord[field] = word[field];
    }
  });
  
  // Mapear level -> difficulty (ignoramos el campo difficulty numérico antiguo)
  if (word.level) {
    migratedWord.difficulty = word.level;
  }
  
  if ((index + 1) % 100 === 0) {
    console.log(`   Procesadas ${index + 1} palabras...`);
  }
  
  return migratedWord;
});

// Crear nuevo objeto con la misma estructura
const migratedData = {
  success: data.success,
  message: `Migrated ${migratedWords.length} words successfully`,
  data: {
    totalWords: migratedWords.length,
    exportDate: new Date().toISOString(),
    words: migratedWords
  }
};

// Guardar el nuevo JSON
console.log('💾 Guardando archivo migrado...');
fs.writeFileSync(outputFile, JSON.stringify(migratedData, null, 2), 'utf8');

console.log('✅ Migración completada!');
console.log(`   Archivo original: ${inputFile}`);
console.log(`   Archivo migrado: ${outputFile}`);
console.log(`   Total palabras: ${migratedWords.length}`);
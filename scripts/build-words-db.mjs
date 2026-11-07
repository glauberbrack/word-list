import { existsSync, readFileSync, rmSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const SOURCE_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
const OUTPUT = fileURLToPath(new URL('../assets/database/words.db', import.meta.url));

async function loadDictionary(localPath) {
  if (localPath) return JSON.parse(readFileSync(localPath, 'utf8'));

  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`Falha ao baixar a lista: HTTP ${response.status}`);
  return response.json();
}

function toSortedWords(dictionary) {
  return Object.keys(dictionary)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => /^[a-z]+$/.test(word))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

function writeDatabase(words) {
  if (existsSync(OUTPUT)) rmSync(OUTPUT);

  const db = new DatabaseSync(OUTPUT);
  db.exec('CREATE TABLE words (id INTEGER PRIMARY KEY, word TEXT NOT NULL)');

  const insert = db.prepare('INSERT INTO words (id, word) VALUES (?, ?)');
  db.exec('BEGIN');
  words.forEach((word, index) => insert.run(index + 1, word));
  db.exec('COMMIT');
  db.exec('VACUUM');
  db.close();
}

const words = toSortedWords(await loadDictionary(process.argv[2]));
writeDatabase(words);
console.log(`${words.length} palavras gravadas em ${OUTPUT}`);

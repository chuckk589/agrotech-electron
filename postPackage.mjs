import fs from 'fs';
import path from 'path';


function walkDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Проверяем и чистим папку locales
      if (entry.name === 'locales') {
        cleanLocales(fullPath);
      }
      walkDirs(fullPath); // рекурсивно
    } else {
      // Удаляем LICENSES.chromium.html
      if (entry.name === 'LICENSES.chromium.html') {
        console.log('Удаляю:', fullPath);
        fs.unlinkSync(fullPath);
      }
    }
  }
}

function cleanLocales(localesPath) {
  const files = fs.readdirSync(localesPath);
  for (const file of files) {
    if (file !== 'ru.pak') {
      const fullFile = path.join(localesPath, file);
      console.log('Удаляю локализацию:', fullFile);
      fs.unlinkSync(fullFile);
    }
  }
}

walkDirs('./out');
console.log('🎉 postpackage завершён');

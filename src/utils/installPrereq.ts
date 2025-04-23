import axios from 'axios';
import { spawn } from 'child_process';
import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar';

async function installPrerequsites() {
  const INSTALL_DIR = '/opt/guardant/grdcontrol';
  const DOWNLOAD_URL = 'https://download.guardant.ru/Guardant_Control_Center/4.3.0/grdcontrol-4.3.0.tar.gz';
  const TEMP_DIR = path.join(app.getPath('userData'), 'temp', 'gcc');

  try {
    await fs.access(INSTALL_DIR);
    console.log('Guardant уже установлен');
    return;
  } catch {}

  await fs.mkdir(TEMP_DIR, { recursive: true });

  const archivePath = path.join(TEMP_DIR, 'guardant.tar.gz');
  console.log('Скачивание...', archivePath);
  await downloadFile(DOWNLOAD_URL, archivePath);

  console.log('Распаковка...');
  await tar.x({ file: archivePath, cwd: TEMP_DIR });

  const after = await fs.readdir(TEMP_DIR);
  const extractedDirectory = await findFirstDirectory(after, TEMP_DIR);

  if (!extractedDirectory) {
    throw new Error('Не удалось найти распакованную директорию');
  }

  const installScript = path.join(TEMP_DIR, extractedDirectory, 'install.sh');
  try {
    await fs.access(installScript);
  } catch {
    throw new Error('Установочный скрипт не найден');
  }

  await fs.chmod(installScript, 0o755);

  console.log('Установка...');
  await runAsRoot(installScript);
  console.log('Установка завершена');
}

async function findFirstDirectory(items: string[], dir: string): Promise<string | null> {
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) return item;
  }
  return null;
}

function runAsRoot(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('pkexec', [scriptPath], {
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Установка завершилась с кодом ${code}`));
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadFile(url: string, dest: string) {
  const writer = (await import('fs')).createWriteStream(dest);
  const response = await axios.get(url, { responseType: 'stream' });

  return new Promise<void>((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export default installPrerequsites;

import axios from 'axios';
import { spawn } from 'child_process';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import tar from 'tar';

async function installPrerequsites() {
  if(process.platform !== 'linux')  return;

  const INSTALL_DIR = '/opt/guardant/grdcontrol';
  const DOWNLOAD_URL = 'https://download.guardant.ru/Guardant_Control_Center/3.29/grdcontrol-3.29.tar.gz';
  const TEMP_DIR = path.join(app.getPath('userData'), 'temp', 'gcc');

  const isInstalled = fs.existsSync(INSTALL_DIR);
  if (isInstalled) {
    console.log('Guardant уже установлен');
    return;
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
  const archivePath = path.join(TEMP_DIR, 'guardant.tar.gz');
  console.log('Скачивание...', archivePath);

  await downloadFile(DOWNLOAD_URL, archivePath);

  console.log('Распаковка...');
  await tar.x({ file: archivePath, cwd: TEMP_DIR, });

  const after = fs.readdirSync(TEMP_DIR)

  const extractedDirectory = after.find((file) => fs.statSync(path.join(TEMP_DIR, file)).isDirectory());

  const installScript = path.join(TEMP_DIR, extractedDirectory, 'install.sh');
  if (!fs.existsSync(installScript)) {
    throw new Error('Установочный скрипт не найден');
  }

  fs.chmodSync(installScript, 0o755);

  console.log('Установка...');
  const child = spawn('pkexec', [installScript], {
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    if (code === 0) {
      console.log('Установка завершена успешно');
    } else {
      console.error(`Установка завершилась с ошибкой.Код: ${code}`);
    }
  });


}
async function downloadFile(url: string, dest: string) {

  const writer = fs.createWriteStream(dest);
  const response = await axios.get(url, { responseType: 'stream' });

  return new Promise<void>((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
export default installPrerequsites;
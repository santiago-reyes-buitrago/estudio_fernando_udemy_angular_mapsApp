const {writeFileSync,mkdirSync} = require('fs')
require('dotenv').config();

const targetPath = 'src/environments/environment.ts';
const targetPathDev = 'src/environments/environment.development.ts';

if (!process.env['MAPBOX_KEY']){
  throw new Error('Variables de entorno faltantes')
}

const envFilesContent = `
export const environment = {
  mapboxKey: '${process.env['MAPBOX_KEY']}'
};
`

mkdirSync('src/environments', { recursive: true });
writeFileSync(targetPath, envFilesContent);
writeFileSync(targetPathDev, envFilesContent);

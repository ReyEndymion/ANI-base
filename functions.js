import chalk from 'chalk';
import cfonts from 'cfonts';
import { fileURLToPath, pathToFileURL } from 'url'
import path, { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync  } from 'fs';
import { createRequire } from "module"; 
import { spawn } from 'child_process';
import syntaxerror from 'syntax-error';
import { platform } from 'process'
import { format } from 'util';

export async function runAnimation(name, nameProyect, author, description) {
const { say, render } = cfonts
console.log(chalk.cyan.bold('\n🌎 Preparando entorno para Bots... 🌏\n'));

const {ANIFramesAnimation} = await import('./constants.js')
const consoleWidth = process.stdout.columns || 80
let lastFrame = ANIFramesAnimation[ANIFramesAnimation.length - 1].split('\n').map(line => line.trimEnd())
const maxWidth = Math.max(...lastFrame.map(line => line.length))
const padding = Math.floor((consoleWidth - maxWidth) / 2)
const centeredFrames = ANIFramesAnimation.map(frame => {
return frame.split('\n').map(line => ' '.repeat(padding > 0 ? padding : 0) + line.trimEnd()).join('\n')}
)
let i = 0;
await new Promise(resolve => {
const interval = setInterval(() => {
console.clear();
console.log(chalk.magentaBright('\nCargando entorno...'));
console.log(chalk.blueBright(centeredFrames[i]));
i = (i + 1) % ANIFramesAnimation.length;
}, 250);
setTimeout(() => {
clearInterval(interval);
console.clear();
lastFrame = lastFrame.map(line => ' '.repeat(padding > 0 ? padding : 0) + line)
const rendered = render(nameProyect, {font: 'simple', align: 'center', colors: ['cyan', 'blue'], space: false, lineHeight: 1}).string.split('\n')

const mid = Math.floor((lastFrame.length - rendered.length) / 2)
for (let i = 0; i < rendered.length; i++) {
  if (lastFrame[mid + i] !== undefined) {
    lastFrame[mid + i] = rendered[i]
  } else {
    lastFrame.push(rendered[i])
  }
}
setTimeout(() => {
console.log(chalk.blueBright(lastFrame.join('\n')))
console.log('✅ㅤIniciando...')
say(`${nameProyect}\nWhatsApp - Bots`, {
font: 'chrome',
align: 'center',
gradient: ['red', 'magenta']
})
say(`${description} By @${author.name || author}`, {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']
})
setTimeout(() => resolve(), 500)
}, 80)
}, 2000);
})
}

export const __filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() };

export const __dirname = function dirname(pathURL) { return path.dirname(__filename(pathURL, true)) };

export const __require = function require(pathImport = import.meta.url) { return createRequire(pathImport) }

const pluginFilter = filename => /\.js$/.test(filename)

export let plugins = {}

export async function filesInit(conn, pluginFolder) {
for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
let file = __filename(join(pluginFolder, filename))
const module = await import(file)
plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete plugins[filename]
}}
}

export async function reload(_ev, filename, {conn, pluginFolder}) {
if (pluginFilter(filename)) {
const pathPlugin = join(pluginFolder, filename)
let pathImport = __filename(pathPlugin)
try {
if (filename in plugins) {
}
if (/unlink/i.test(_ev)) {
if (!existsSync(pathPlugin)) {
delete plugins[filename]
conn.logger.warn(`deleted plugin - '${filename}'`)
}
return 

}
if (/add/i.test(_ev)) conn.logger.info(`new plugin - '${filename}'`)
if (/change/i.test(_ev)) conn.logger.info(` updated plugin - '${filename}'`)
let err = syntaxerror(readFileSync(pathPlugin), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true
})
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
const module = (await import(`${pathImport}?update=${Date.now()}`))
plugins[filename] = module.default || module


} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
Object.keys(plugins).sort((a, b) => a.localeCompare(b)).forEach((key, i, arr) => {


})
}
}
}

export async function _quickTest() {
let test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version'])
].map(p => {
return Promise.race([
new Promise(resolve => {
p.on('close', code => {
resolve(code !== 127)
})}),
new Promise(resolve => {
p.on('error', _ => resolve(false))
})])}))
let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
let support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find }
Object.freeze(support)
}


export async function clearTmp() {
const {temp} = await import('./config.js')
const tmp = [temp]
const filename = []
tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
}

export async function delSessionError(pathFolder) {
readdirSync(pathFolder).forEach(file => {
unlinkSync(path.join(pathFolder, file), { recursive: true, force: true })})    
process.send('reset')
}

import fs, { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import path, { join } from 'path'
import { fileURLToPath } from 'url'
import { __filename, __dirname } from './functions.js'

export const owner = [
   ['5215517489568','𝓢𝓾𝓹𝓻𝓮𝓶𝓮 𝓔𝓷𝓭𝔂𝓶𝓲𝓸𝓷 - Creador 👁️', false],
    ['5215533827255', '𝓡𝓮𝔂 𝓔𝓷𝓭𝔂𝓶𝓲𝓸𝓷 - Creador 👑', true],
] // Cambia los numeros que quieras

export const prems = [] 
export const packname = '(☞ﾟ∀ﾟ)☞'
export const author = '★🌎ANI MX SCANS🌏★'
export const wm = '★🌎ANI MX SCANS🌏★'
export const igfg = '★🌎ANI MX SCANS🌏★'
export const raizPath = __dirname(import.meta.url)
export const temp = join(raizPath, 'tmp')
export const pluginPath = join(raizPath, 'plugins')
export const wait = '*⌛ _Cargando, aguarde un momento..._ ▬▬▬▭*'

export const imagen1 = join(raizPath, 'Menu2.jpg')
export const imagen2 = join(raizPath, 'src/nuevobot.jpg') 
export const imagen3 = join(raizPath, 'src/Pre Bot Publi.png')
export const imagen4 = join(raizPath, 'Menu.png')

export const mods = [] 

export const multiplier = 9999 

let file = __filename(import.meta.url, true)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'config.js'"))
import(`${__filename(file)}?update=${Date.now()}`)})

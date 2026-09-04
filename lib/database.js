import { resolve, dirname as _dirname } from 'path'
import _fs, { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import lodash from 'lodash';
import { __filename, opts} from '../functions.js';
import {src} from '../config.js'
const { chain } = lodash;

const { promises: fs } = _fs

class Database {
/**
* Create new Database
* @param {String} filepath Path to specified json database
* @param{...any} args JSON.stringify arguments
*/
constructor(filepath, ...args) {
console.log(`Instancia de Database creada para ${filepath}`);
this.file = resolve(filepath)
this.logger = console

this._load()

this._jsonargs = args
this._state = false
this._queue = []
this._interval = setInterval(async () => {
if (!this._state && this._queue && this._queue[0]) {
this._state = true
await this[this._queue.shift()]().catch(this.logger.error)
this._state = false
}
}, 1000)

}

get data() {
return this._data
}

set data(value) {
this._data = value
this.save()
}

/**
* Queue Load
*/
load() {
this._queue.push('_load')
}

/**
* Queue Save
*/
save() {
this._queue.push('_save')
}

_load() {
try {
return this._data = existsSync(this.file) ? JSON.parse(readFileSync(this.file)) : {}
} catch (e) {
this.logger.error(e)
return this._data = {}
}
}

async _save() {
let dirname = _dirname(this.file)
if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true })
await fs.writeFile(this.file, JSON.stringify(this._data, ...this._jsonargs))
return this.file
}
}

export default Database

export async function loadDatabase(db) {
if (db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!db.READ) {
clearInterval(this);
resolve(db.data == null ? loadDatabase() : db.data);
}
}, 1 * 1000));
}
if (db.data !== null) return;
db.READ = true;
await db.read().catch(console.error);
db.READ = null;
db.data = {
bot: {},
...(db.data || {}),
};
db.chain = chain(db.data);
};

/*
const dbBotsFile = path.join(src, 'bots_registred.json')
const createJson = new JSONFile(dbBotsFile)
export const dbRegisterBot = new Low(createJson)
*/
export async function registrerBot(name, user, options) {

try {
await dbRegisterBot.read()
} catch (error) {
console.error('[dataBot] Error leyendo JSON, intentando reparar...', error.message)
const raw = await fs.readFile(dbBotsFile, 'utf8')
repairJsonText(raw)
}
const now = new Date()
const timestamp = now.getTime()
const dateCal = now.toLocaleDateString('en-CA')
const uptime = process.uptime(); // en segundos
const prevLastGroupFetchAll = typeof options?.lastGroupFetchAll === 'number' ? options?.lastGroupFetchAll : dbRegisterBot.data?.bots?.[name]?.lastGroupFetchAll || 0
dbRegisterBot.data ||= {bots: {}}
dbRegisterBot.data.bots[name] = {
user,
name, 
updated: now,
timestamp,
dateCal,
uptime,
lastGroupFetchAll: prevLastGroupFetchAll
}
await dbRegisterBot.write()
return dbRegisterBot
}

export async function configDinamics(update = {}) {
const {raizPath} = await import('../config.js')
const dbConfigPath = path.join(raizPath, 'configDynamics.json')
const createJson = new JSONFile(dbConfigPath)
const dbconfig = new Low(createJson)
await dbconfig.read()
dbconfig.data ||= {}
const isFirstRun = !dbconfig.data.info && !dbconfig.data.start;
dbconfig.data.info ||= {
ganisubbots: '',
ganicmd: '',
lobby: '',
community: '',
gaportes: '',
channelANI: '',
channelOTK: ''
}
dbconfig.data.start ||= {
restartClean: false,
doReplies: process.argv.includes('--no-reply') ? process.argv.includes('--no-reply') : false,
qrTerminal: false,
usePairingCode: process.argv.includes('--pairing-code') ? process.argv.includes('--pairing-code') : false,
useMobile: process.argv.includes('--mobile') ? process.argv.includes('--mobile') : false,
useStore: process.argv.includes('--no-store') ? process.argv.includes('--no-store') : false,
aniJdbts: false,
buttons: true,
}
let hasUpdate = false
if (update.info) {
Object.assign(dbconfig.data.info, update.info)
hasUpdate = true
}
if (update.start) {
Object.assign(dbconfig.data.start, update.start)
hasUpdate = true
}
if (isFirstRun || hasUpdate) await dbconfig.write()

return dbconfig.data
}

export async function groupFetchAllParticipatingJson(conn, db, data, name, funcregistrerBot) {
await db.read()
const now = Date.now()
const lastGroupFetchAll = data.lastGroupFetchAll || 0
if (now - lastGroupFetchAll < 3 * 24 * 60 * 60 * 1000 && lastGroupFetchAll !== 0) return;
console.log('groupFetchAllParticipatingJson', data, name)
const groups = await conn.groupFetchAllParticipating();
await funcregistrerBot(name, conn.user, {lastGroupFetchAll: now})
db.data = groups
await db.write()
}
/*
const folderDB = path.join(src, `ANIMXSCANS`)
const dbSubBotsFile = path.join(folderDB, 'Subbots_registred.json')
const createSBJson = new JSONFile(dbSubBotsFile)
export const dbRegisterSubBot = new Low(createSBJson)
*/

export async function registrerSubBot(name, user, options) {
await dbRegisterSubBot.read()
const now = new Date()
const timestamp = now.getTime()
const dateCal = now.toLocaleDateString('en-CA')
const uptime = process.uptime(); // en segundos
const prevLastGroupFetchAll = typeof options?.lastGroupFetchAll === 'number' ? options?.lastGroupFetchAll : dbRegisterSubBot.data?.bots?.[name]?.lastGroupFetchAll || 0
dbRegisterSubBot.data ||= {bots: {}}
dbRegisterSubBot.data.bots[name] = {
user,
name, 
updated: now,
timestamp,
dateCal,
uptime,
lastGroupFetchAll: prevLastGroupFetchAll
}
await dbRegisterSubBot.write()
return dbRegisterSubBot
}


export async function repairAndReadLowdb(db, filePathFromYou) {
try {
await db.read()
db.data ||= {}
db.data.bots ||= {}
return
} catch (_) {
}

const file =
filePathFromYou ||
db?.adapter?.filename ||
db?.adapter?.file ||
db?.adapter?.source

if (!file) {
throw new Error('No pude determinar la ruta del JSON de lowdb. P�sala como segundo argumento.')
}

const raw = await fs.readFile(file, 'utf8')
const bak = file + '.' + Date.now() + '.bak'
try { fss.copyFileSync(file, bak) } catch {}

const fixedText = repairJsonText(raw)

const fixedObj = JSON.parse(fixedText)
await fs.writeFile(file, JSON.stringify(fixedObj, null, 2), 'utf8')

await db.read()
db.data ||= {}
db.data.bots ||= {}
}

function repairJsonText(input) {
let s = input
s = s.replace(/^\uFEFF/, '')
s = s.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
s = s.replace(/,\s*([}\]])/g, '$1')
s = trimToBalancedJSON(s).trim()
return s
}

function trimToBalancedJSON(s) {
let depthBrace = 0, depthBracket = 0
let inStr = false, esc = false, quote = ''
let root = null
let end = -1

for (let i = 0; i < s.length; i++) {
const c = s[i]
if (inStr) {
if (esc) { esc = false; continue }
if (c === '\\') { esc = true; continue }
if (c === quote) { inStr = false; quote = ''; continue }
continue
} else {
if (c === '"' || c === "'") { inStr = true; quote = c; continue }
if (c === '{') { if (!root) root = 'brace'; depthBrace++ }
else if (c === '}') {
if (depthBrace > 0) depthBrace--
if (root === 'brace' && depthBrace === 0) { end = i; break }
} else if (c === '[') { if (!root) root = 'bracket'; depthBracket++ }
else if (c === ']') {
if (depthBracket > 0) depthBracket--
if (root === 'bracket' && depthBracket === 0) { end = i; break }
}
}
}

if (end >= 0) return s.slice(0, end + 1)

if (root === 'brace' && depthBrace > 0) return s + '}'.repeat(depthBrace)
if (root === 'bracket' && depthBracket > 0) return s + ']'.repeat(depthBracket)

const last = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'))
return last >= 0 ? s.slice(0, last + 1) : s
}


export function saveIndex(indexFile, index) {
  writeFileSync(indexFile, JSON.stringify(index, null, 2));
}

export function loadPriv(privsDir, userID) {
  const file = path.join(privsDir, `${userID}.json`);
  if (!existsSync(file)) {
    const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;
  } else {
    try {
  return JSON.parse(readFileSync(file));      
    } catch (error) {
    const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;
    }
  };
}

export function savePriv(privsDir, userID, data, indexFile, index) {
  const file = path.join(privsDir, `${userID}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2));
  if (!index.privs.includes(userID)) {
    index.privs.push(userID);
    saveIndex(indexFile, index);
  }
}

export function loadGroup(groupsDir, groupID) {
  const file = path.join(groupsDir, `${groupID}.json`);
  if (!existsSync(file)) {
    const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;
  } else {
    try {
  return JSON.parse(readFileSync(file));
    } catch (error) {
    const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data; 
    }
  };
}

export function saveGroup(groupsDir, groupID, data, indexFile, index) {
  const file = path.join(groupsDir, `${groupID}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2));
  if (!index.groups.includes(groupID)) {
    index.groups.push(groupID);
    saveIndex(indexFile, index);
  }
}

export function loadStats(botDB) {
  const file = path.join(botDB, 'stats.json');
  if (!existsSync(file)) {
    return {};
  } else {
    try {
   return JSON.parse(readFileSync(file));
    } catch (error) {
const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;    }
  }
}

export function saveStats(botDB, data) {
  const file = path.join(botDB, 'stats.json');
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export function loadSticker(botDB) {
  const file = path.join(botDB, 'sticker.json');
  if (!existsSync(file)) {return {};} else {
    try {
  return JSON.parse(readFileSync(file));
    } catch (error) {
const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;    
      }
  }
}

export function saveSticker(botDB, data) {
  const file = path.join(botDB, 'sticker.json');
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export function loadMsgs(botDB) {
  const file = path.join(botDB, 'msgs.json');
  if (!existsSync(file)) {return {};} else {
    try {
  return JSON.parse(readFileSync(file));
    } catch (error) {
const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;    
      }
  }
}

export function saveMsgs(botDB, data) {
  const file = path.join(botDB, 'msgs.json');
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export function loadSettings(botDB) {
  const file = path.join(botDB, 'settings.json');
  if (!existsSync(file)) {return {};} else {
    try { 
  return JSON.parse(readFileSync(file));
    } catch (error) {
const data = {};
        writeFileSync(file, JSON.stringify(data, null, 2));
        return data;    
      }
  }
}

export function saveSettings(botDB, data) {
  const file = path.join(botDB, 'settings.json');
  writeFileSync(file, JSON.stringify(data, null, 2));
}
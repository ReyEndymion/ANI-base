process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = true;
import path, { join } from 'path'
import {__filename, __dirname, _quickTest, filesInit, plugins, reload} from './functions.js'
import {owner, raizPath, temp, pluginPath} from './config.js'
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch as fsWatch, rmSync, mkdirSync  } from 'fs';
import {watch as Cwatch} from 'chokidar'
import yargs from 'yargs';
import P from 'pino';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import store from './lib/store.js'
import { loadDatabase } from './lib/database.js';
import NodeCache from 'node-cache'
import { reloadHandler, patchMessageBeforeSending } from './connections.js';
protoType()
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, WAMessageKey, getHistoryMsg, isJidNewsletter } = await import('baileys')
import { makeWASocket, protoType, serialize } from './lib/simple.js';
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000
const timestamp = { start: new Date }
const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const prefix = new RegExp('^[' + (opts['prefix'] || 'xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-HhhHBb.aA').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
let db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`), {})

const authFolder = path.join(raizPath, `ANIMXSCANS`)
if (!existsSync(temp)) mkdirSync(temp)
const { state, saveState, saveCreds } = await useMultiFileAuthState(authFolder)
const {version} = await fetchLatestBaileysVersion();
const groupCache = new NodeCache()
const logger = P({ level: 'silent'})
const bind = store.bind()
const connectionOptions = {
version,
syncFullHistory: false,
markOnlineOnConnect: true,
connectTimeoutMs: 60_000,
auth: state,
logger,
getMessage: async (key = WAMessageKey) => (
bind.loadMessage(/** @type {string} */(key.remoteJid), key.id) ||
bind.loadMessage(/** @type {string} */(key.id)) || {}
).message || { conversation: 'Please send messages again' },
cachedGroupMetadata: async (jid) => groupCache.get(jid),
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, logger),
},
patchMessageBeforeSending,
browser: ['🌎ANI MX SCANS🌏','Opera','1.0.0']
}
const options = {
opts,
}
let conn = makeWASocket(connectionOptions, options)
serialize()
conn.isInit = false
if (!opts['test']) {
if (db) setInterval(async () => {
if (db.data) await db.write()
if (opts['autocleartmp'] && (support || {}).find) (temp = [os.tmpdir(), 'tmp', "jadibts"], temp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)}
if (opts['server']) (await import('./server.js')).default(conn, PORT)

process.on('uncaughtException', err => {
  console.error('⚠️ uncaughtException en', err?.stack || err);
});

process.on('unhandledRejection', err => {
  console.error('⚠️ unhandledRejection en', err?.stack || err);
});
let isInit = true;
const pluginFolder = __dirname(`${pluginPath}/index`) 
const objs = {opts, db, plugins, authFolder, prefix, loadDatabase, pluginFolder, makeWASocket, connectionOptions, options, isInit, timestamp, saveCreds, bind, DisconnectReason}
Object.assign(conn, objs)
await reloadHandler.call(conn, false)
if (conn.user) {
_quickTest()
await filesInit(conn, pluginFolder).then(_ => {
conn.logger.info(`PLUGINS CARGANDOS．．．`, Object.keys(plugins).length)
}).catch(console.error)
Cwatch(pluginFolder, {
persistent: true,
ignoreInitial: true,
depth: Infinity,
awaitWriteFinish: {
stabilityThreshold: 200,
pollInterval: 100
}
}).on('add', (file) => { 
const filename = path.relative(pluginFolder, file) 
reload('add', filename, {conn, pluginFolder}) 
}).on('change', (file) => { 
const filename = path.relative(pluginFolder, file) 
reload('change', filename, {conn, pluginFolder}) 
}).on('unlink', (file) => { 
const filename = path.relative(pluginFolder, file) 
reload('unlink', filename, {conn, pluginFolder}) 
}).on('addDir', (dir) => { 
const dirname = path.relative(pluginFolder, dir) 
reload('addDir', dirname, {conn, pluginFolder}) 
}).on('unlinkDir', (dir) => { 
const dirname = path.relative(pluginFolder, dir) 
reload('unlinkDir', dirname, {conn, pluginFolder}) 
})

}

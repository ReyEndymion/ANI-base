let beforeConn = {}
export async function connectionUpdate(update) {
const { Boom } = await import('@hapi/boom');
const {delSessionError} = await import('./functions.js')
const { CONNECTING } = await import('ws');
const {default: chalk} = await import('chalk')
const QR = await import('qrcode-terminal').then(m => m.default || m).catch(() => {
conn.logger.error('El terminal de código QR no se agregó como dependencia');
});
var conn = this || beforeConn
let {DisconnectReason, db, loadDatabase, timestamp, authFolder} = conn

let {loggedOut, connectionLost, timedOut, multideviceMismatch, connectionClosed, connectionReplaced, badSession, restartRequired} = DisconnectReason
let { connection, lastDisconnect, isNewLogin } = update
if (update.qr != 0 && update.qr != undefined) {
console.log(chalk.yellow('🚩ㅤEscanea este codigo QR, el codigo QR expira en 60 segundos.'));
QR === null || QR === void 0 ? void 0 : QR.generate(update.qr, { small: true });
}
if (isNewLogin) conn.isInit = true
let code, output, payload, msg
if (lastDisconnect && lastDisconnect.error) {
const err = new Boom(lastDisconnect?.error)
output = err?.output
payload = output?.payload
code = err?.output?.statusCode || payload?.statusCode;
}
if (code && code !== DisconnectReason.loggedOut && conn?.ws.readyState !== CONNECTING) {
console.log(await reloadHandler(true).catch(console.error))
}
if (connection == 'open') {
if (Object.keys(db.data).length === 0) await loadDatabase(db)
console.log(chalk.yellow('▣─────────────────────────────···\n│\n│❧ CONECTADO CORRECTAMENTE AL WHATSAPP ✅\n│\n▣─────────────────────────────···'))
} else {
if (code === 401) {
    delSessionError(authFolder)
    msg = conn.logger.error(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 403) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.error(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 405) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 408 && code === timedOut) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 408 && code === connectionLost) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 411 && code === multideviceMismatch) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 428 && payload?.error === 'Precondition Required') {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 428 && code === connectionClosed) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 440 && code === connectionReplaced) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.error(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 500 && code === badSession) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 503) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.warn(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
if (code === 515 && code === restartRequired) {
    await reloadHandler(true).catch(console.error)
    msg = conn.logger.info(`Conexion ${connection}... motivo: ${DisconnectReason[code]}`)
}
timestamp.connect = new Date

}
return msg
}

export async function reloadHandler(restatConn) {
let handler = await import('./handler.js')
var conn = this || beforeConn
let {makeWASocket, connectionOptions, options, isInit, saveCreds, bind} = conn
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e)
}
beforeConn = conn
if (restatConn) {
var newconn = {}
const oldChats = beforeConn.chats
try { 
isInit = false
conn.ws.close() 
conn.ev.removeAllListeners()
} catch {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('group-participants.update', conn.participantsUpdate)
conn.ev.off('groups.update', conn.groupsUpdate)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('call', conn.onCall)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
} finally {
newconn = makeWASocket(connectionOptions, Object.assign(options, { chats: oldChats }))
const safeKeys = Object.keys(newconn).filter(k => {
  const desc = Object.getOwnPropertyDescriptor(beforeConn, k)
  return !desc || desc.writable || desc.configurable
})
for (const key of safeKeys) {
  try {
    beforeConn[key] = newconn[key]
  } catch {

   }
}
conn = beforeConn
isInit = true
}
}
if (!isInit) {
}
try {
  
conn.welcome = '*╔══════════════*\n*╟❧ @subject*\n*╠══════════════*\n*╟❧ @user*\n*╟❧ BIENVENIDO/A* \n*║*\n*╟❧ DESCRIPCIÓN DEL GRUPO:*\n*╟❧* @desc\n*║*\n*╟❧ DISFRUTA TU ESTANCIA!!*\n*╚══════════════*'
conn.bye = '╔══════════════*\n*║〘 *ADIÓS* 〙*\n*╠══════════════*\n║*_☠ Se fue @user_*\n║*_Si no regresa..._*\n║ *_Nadie l@ va a extrañar 😇👍🏼_*\n*╚══════════════*'
conn.spromote = '*@user SE SUMA AL GRUPO DE ADMINS!!*'
conn.sdemote = '*@user ABANDONA EL GRUPO DE ADMINS !!*'
conn.sDesc = '*SE HA MODIFICADO LA DESCRIPCIÓN DEL GRUPO*\n\n*NUEVA DESCRIPCIÓN:* @desc'
conn.sSubject = '*SE HA MODIFICADO EL NOMBRE DEL GRUPO*\n *NUEVO NOMBRE:* @subject'
conn.sIcon = '*SE HA CAMBIADO LA FOTO DEL GRUPO!!*'
conn.sRevoke = '*SE HA ACTUALIZADO EL LINK DEL GRUPO!!*\n*LINK NUEVO:* @revoke'

  conn.handler = handler.handler.bind(conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(conn)
  conn.onCall = handler.callUpdate.bind(conn)
  conn.onDelete = handler.deleteUpdate.bind(conn)
  conn.connectionUpdate = connectionUpdate.bind(conn)
  conn.credsUpdate = saveCreds.bind(conn, true)

bind.events(conn)

conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
return conn
} catch (error) {
console.error('ReloadHError: ', error)
}
}

export async function templateResponse(m, {chatUpdate}) {
const { proto, generateWAMessage, areJidsSameUser, decryptPollVote, } = (await import('baileys'));
const { prefix, opts, plugins } = await import('../lib/functions.js');
if (m.isBaileys) {
return
}
if (!m.message) {
return
}
if (!(m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage || m.message.listResponseMessage || m.message.interactiveResponseMessage)) {
return
}
let id
if (m.message.buttonsResponseMessage) {
id = m.message.buttonsResponseMessage.selectedButtonId
} else if (m.message.templateButtonReplyMessage) {
id = m.message.templateButtonReplyMessage.selectedId
} else if (m.message.listResponseMessage) {
id = m.message.listResponseMessage.singleSelectReply?.selectedRowId;
} else if (m.message.interactiveResponseMessage) {
id = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
}
const text = m.message.buttonsResponseMessage?.selectedDisplayText || m.message.templateButtonReplyMessage?.selectedDisplayText || m.message.listResponseMessage?.title || m.message.interactiveResponseMessage.body?.text
let isIdMessage = false
let usedPrefix
for (const [link, plugin] of plugins.entries()) {
if (!plugin) {
continue
}
if (plugin.disabled) {
continue
}
if (!opts['restrict']) {
if (plugin.tags && plugin.tags.includes('admin')) {
continue
}}
if (typeof plugin !== 'function') {
continue
}
if (!plugin.command) {
continue
}
const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
const _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : prefix
const match = (_prefix instanceof RegExp ? [[_prefix.exec(id), _prefix]] : Array.isArray(_prefix) ? _prefix.map((p) => {
const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
return [re.exec(id), re]
}) :
typeof _prefix === 'string' ?
[[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find((p) => p[1])
usedPrefix = (match && match[0]) ? match[0][0] : '';
if ((usedPrefix = (match[0] || '')[0])) {
const noPrefix = id.replace(usedPrefix, '')
let [command] = noPrefix.trim().split(` `).filter((v) => v)
command = (command || '').toLowerCase()
const isId = plugin.command instanceof RegExp ?
plugin.command.test(command) :
Array.isArray(plugin.command) ?
plugin.command.some((cmd) => cmd instanceof RegExp ?
cmd.test(command) :
cmd === command,
) :
typeof plugin.command === 'string' ?
plugin.command === command :
false
if (!isId) {
continue
}
isIdMessage = true
}}
const messages = await generateWAMessage(m.chat, {text: isIdMessage ? id : text, mentions: m.mentionedJid}, {
userJid: this.user.id,
quoted: m.quoted && m.quoted?.fakeObj,
})
messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
messages.key.id = m.key.id
messages.pushName = m.name
if (m.isGroup) {
messages.key.participant = messages.participant = m.sender
}
const clean = JSON.parse(JSON.stringify(messages, (k, v) => {
if (typeof v === 'function') return undefined
if (v && typeof v === 'object' && (v._idleNext || v._idlePrev)) return undefined
if (k === 'conn') return undefined
return v
}))
const msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.create(messages)],
type: 'append',
}
this.ev.emit('messages.upsert', msg)
}

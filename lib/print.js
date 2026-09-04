export default async function (m, conn, propers) {
let {senderJid, isAnnounce, isCommunityAnnounce, chat} = propers
if (chat.muteconsole) return
const urlRegex = (await import('url-regex-safe')).default({strict: false});
const {default: fs} = await import('fs')
const {WAMessageStubType, isLidUser, isPnUser, isJidBroadcast, isJidGroup, isJidNewsletter} = await import('@whiskeysockets/baileys')
let { userID, groupID, lid, sBroadCastID, newsletterID } = await import('../config.js');
let { opts, __filename, prefix, isNumericString } = await import('./functions.js');
const {default: PhoneNumber} = await import('awesome-phonenumber')
const {default: chalk} = await import('chalk')
const terminalImage = opts['img'] ? require('terminal-image') : '';
if (WAMessageStubType[m.messageStubType] === 'CIPHERTEXT' || /Protocol|protocolMessage/ig.test(m.mtype)) return
let statusChat
if (isAnnounce || isCommunityAnnounce || isJidNewsletter(m.key.remoteJid)) {
statusChat = `Estado del chat: cerrado`
} else {
statusChat = 'Estado del chat: abierto'
}
let chatType
if (m.isGroup) {
chatType = 'Grupo'
} else if (isJidBroadcast(m.key.remoteJid)) {
chatType = 'Estado de Whatsapp'
} else if (isJidNewsletter(m.key.remoteJid)) {
chatType = 'Canal'
} else {
chatType =  'Privado'
}
if (m.messageStubParameters.length !== 0) {
console.log(m.messageStubParameters.map((value) => {

if (!(value.startsWith('{') || value.startsWith('['))) return value
const data = JSON.parse(value)
}).join(', '));
}
const idChat = isJidBroadcast(m.chat) ? m.key.participant || m.participant : m.chat
let chatName = m.isGroup ? conn.chats[idChat]?.subject : conn.chats[idChat]?.name;
let jidSender = isJidGroup(m.chat) ? m.fromMe ? conn.user.jid : m.key.participantAlt ? m.key.participantAlt : undefined : m.fromMe ? conn.user.jid : isJidBroadcast(m.chat) ? m.key.remoteJidAlt ? m.key.remoteJidAlt : undefined : m.key.remoteJidAlt ? m.key.remoteJidAlt : undefined
let number = jidSender ? PhoneNumber(`+${jidSender.split('@')[0]}`).getNumber('international') : undefined
let numberChat = isJidGroup(m.chat) ? undefined : isPnUser(m.senderJid) ? PhoneNumber(`+${m.senderJid.split('@')[0]}`).getNumber('international') : undefined
let username = isJidGroup(m.chat) ? m.key.participantUsername : m.key.remoteJidUsername || m.key.participantUsername
let nameSender = m.fromMe ? conn.user.name : m?.pushName ? m?.pushName !== null ? m.pushName : await conn.getName(m.sender) : ''
let type = m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : ''
let img
try {
if (opts['img']) {
img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
}
} catch (e) {
console.error(e);
}
let filesize = (m.msg ?
m.msg.vcard ?
m.msg.vcard.length :
m.msg.fileLength ?
m.msg.fileLength.low || m.msg.fileLength :
m.msg.axolotlSenderKeyDistributionMessage ?
m.msg.axolotlSenderKeyDistributionMessage.length :
m?.text ?
m.text.length :
0 : 
m?.text ? m.text?.length : 0) || 0;

let me = PhoneNumber('+' + (conn.user?.jid).replace(userID, '')).getNumber('international');
if (img) console.log(img.trimEnd());

if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`);
else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`);
else if (/audio/i.test(m.mtype)) {
const duration = m.msg.seconds;
console.log(`${m.msg.ptt ? '🎤ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`);
}

const tamaño = filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1)
const unidad = ['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || ''
const log = [
`│ ${chalk.redBright(me + ' ~ ' + conn.user.name)}`,
`│⏰ㅤ${chalk.black(chalk.bgYellow(new Date().toLocaleTimeString('es-MX', {hour12: false, timeZoneName: 'long', timeZone: 'America/Mexico_City'})))}`,
`│📑ㅤ${chalk.black(chalk.bgGreen(`Tipo de chat: ${chatType}`))}`,
`│📤ㅤ${chalk.green(m.messageStubType ? `Evento en chat: ${WAMessageStubType[m.messageStubType]}` : statusChat)}`,
`│📤ㅤ${chalk.green(`ID del chat: ${idChat}`)}`,
(numberChat ? [`│📃ㅤ${chalk.green(`Numero: ${numberChat}`)}`] : username ? [`│📃ㅤ${chalk.green(`Nombre de Usuario: ${username}`)}`] : []),
(chatName ? [`│📤ㅤ${chalk.green(`Nombre del chat: ${chatName}`)}`] : []),
`│📃ㅤ${chalk.yellow(`ID del usuario: ${m.fromMe ? conn.user.jid : m.sender}`)}`,
(number ? [`│📃ㅤ${chalk.yellow(`Numero: ${number}`)}`] : []),
`│📃ㅤ${chalk.yellow(`Nickname: ~${nameSender}`)}`,
`│💬ㅤ${chalk.black(chalk.bgYellow(`Tipo de mensaje: ${type}`))}`,
`│📊ㅤ${chalk.magenta(`tamaño de ${type}: ${tamaño} [${tamaño} ${unidad}B]`)}`
]

console.log(`▣────────────···
${log.join('\n')}
▣────────────···`)
if (typeof m.text === 'string' && m.text) {
let log = m.text.replace(/\u200e+/g, '');
let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
let mdFormat = (depth = 4) => (_, type, text, monospace) => {
let types = {
'_': 'italic',
'*': 'bold',
'~': 'strikethrough'
};
text = text || monospace;
let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
return formatted;
};
if (log.length < 1024) {
log = log.replace(urlRegex, (url, i, text) => {
let end = url.length + i;
return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.bgBlue(url) : url;
});
}
log = log.replace(mdRegex, mdFormat(4));
if (m.mentionedJid.length !== 0) {
for (let user of m.mentionedJid) {
const id = user.split`@`[0]
const name = await conn.getName(user)
console.log('print', user, name, id);
log = log.replace(`@${id}`, chalk.blueBright(`@${name}`));
}
}
let match = (
prefix instanceof RegExp
? [[prefix.exec(m.text), prefix]]
: Array.isArray(prefix)
? prefix.map(p => {
let re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
return [re.exec(m.text), re];
})
: typeof _prefix === 'string'
? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(prefix))]]
: [[[], new RegExp()]]
).find(p => p[1]);

if (match && (match[0] || '')[0]) {
propers.isCommand = true;
}

console.log(m.error != null ? chalk.red(log) : propers.isCommand ? chalk.yellow(log) : log);
}
}

import { smsg } from './lib/simple.js'
import { format } from 'util'
import path, { join } from 'path'
import {readFileSync, unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import { mods, prems, author, owner, raizPath, imagen1, imagen2, imagen3, imagen4 } from './config.js'
import { APIKeys } from './apis.js'
/**
 * @type {import('baileys')}
 */
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate, options) {

    let {db, opts, plugins, prefix, loadDatabase, pluginFolder} = this
    const consts = { mods, prems, author, owner, raizPath, imagen1, imagen2, imagen3, imagen4 }
    if (Object.keys(db.data).length === 0) await loadDatabase()
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return

        const groupMetadata = (m.isGroup ? ((this.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?
        const isROwner = [this.decodeJid(this.user.id), ...owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.conn = this
        m.exp = 0
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            let user = db.data.users[m.sender]
            if (typeof user !== 'object')
                db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.limit)) user.limit = 10
                if (!isNumber(user.lastclaim)) user.lastclaim = 0
                if (!('registered' in user)) user.registered = false
              if (!user.registered) {
                if (!('name' in user)) user.name = m.name
                if (!isNumber(user.age)) user.age = -1
                if (!isNumber(user.regTime)) user.regTime = -1
               }
                if (!isNumber(user.afk)) user.afk = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!('banned' in user)) user.banned = false
                if (!isNumber(user.warn)) user.warn = 0
                if (!isNumber(user.level)) user.level = 0
                if (!('role' in user)) user.role = 'Novato'
                if (!('autolevelup' in user)) user.autolevelup = true
                if (!isNumber(user.money)) user.money = 0
                if (!isNumber(user.limit)) user.limit = 10
                if (!isNumber(user.lastclaim)) user.lastclaim = 0
            } else
                db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    lastclaim: 0,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    warn: 0,
                    level: 0,
                    role: 'Novato',
                    autolevelup: true,
                    money: 0,
                    limit: 10,
                    lastclaim: 0,
                    lastweekly: 0,
                    lastmonthly: 0,
                }
            let chat = db.data.chats[m.chat]
            if (typeof chat !== 'object')
                db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('welcome' in chat)) chat.welcome = true
                if (!('detect' in chat)) chat.detect = true
                if (!('sWelcome' in chat)) chat.sWelcome = ''
                if (!('sBye' in chat)) chat.sBye = ''
                if (!('sPromote' in chat)) chat.sPromote = ''
                if (!('sDemote' in chat)) chat.sDemote = ''
                if (!('delete' in chat)) chat.delete = true
                if (!('modohorny' in chat)) chat.modohorny = false    
                if (!('autosticker' in chat)) chat.autosticker = false                    
                if (!('audios' in chat)) chat.audios = false                            
                if (!('antiLink' in chat)) chat.antiLink = false
                if (!('antiLink2' in chat)) chat.antiLink2 = false
                if (!('antiviewonce' in chat)) chat.antiviewonce = false
                if (!('antiToxic' in chat)) chat.antiToxic = false
                if (!('antiTraba' in chat)) chat.antiTraba = false
                if (!('antiArab' in chat)) chat.antiArab = false
                if (!('asistente' in chat)) chat.asistente = false
                if (!('gRol' in chat)) chat.gruposRol = false
                if (!isNumber(chat.expired)) chat.expired = 0
            } else
                db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: true,
                    detect: true,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: true,
                    modohorny: true,
                    autosticker: false,
                    audios: true,
                    antiLink: false,
                    antiLink2: false,
                    antiviewonce: false,
                    antiToxic: false,
                    antiTraba: false,
                    antiArab: false,
                    asistente: false,
                    gruposRol: false,
                    expired: 0,
                }
            let settings = db.data.settings[this.user.jid]
            if (typeof settings !== 'object') db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = false
                if (!('antiCall' in settings)) settings.antiCall = false
                if (!('antiPrivate' in settings)) settings.antiPrivate = false
            } else db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                restrict: false,
                antiCall: false,
                antiPrivate: false
            }
        } catch (e) {
            console.error('ErrorHandlerDB', e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''


        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let chatsdb =  db.data && db.data.chats && db.data.chats
        let chatdb =  chatsdb[m.chat]
        let usersdb = db.data && db.data.users && db.data.users
        let userdb = usersdb[m.sender]
        let stats = db.data.stats
        let settings = db.data.settings[this.user.jid]
        for (let name in plugins) {
            let plugin = plugins[name]
            if (!plugin) continue
            if (plugin.disabled) continue
            const pluginPath = join(pluginFolder, name)
            const params = {
                        chatUpdate,
                        pluginFolder,
                        pluginPath,
                        db,
                        stats,
                        settings,
                        consts
                    }
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, params)
                } catch (e) {
                    console.error(e)
                    for (let [jid] of owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await this.onWhatsApp(jid))[0] || {}
                        if (data.exists && !m.fromMe)
                            m.reply(`*[REPORTE DE COMANDO CON FALLOS]*\n\n*PLUGIN:* ${name}\n*USUARIO:* ${m.sender}\n*COMANDO:* ${m.text}\n\n*ERROR:*\n\`\`\`${format(e)}\`\`\`\n\n*[!] REPORTELO AL CREADOR, EL TRATARA DE DARLE SOLUCIÓN, PUEDE USAR EL COMANDO #reporte*`.trim(), data.jid)
                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            const paramsBefore = Object.assign(params, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatsdb,
                    chatdb,
                    usersdb,
                    userdb,
                    imagen1: readFileSync(imagen1),
                    imagen2: readFileSync(imagen2),
                    imagen3: readFileSync(imagen3),
                    imagen4: readFileSync(imagen4)
                })
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, paramsBefore))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in db.data.chats || m.sender in db.data.users) {
                    if (name != 'owner-unbanchat.js' && chatdb?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && userdb?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && userdb.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('Ngecit -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `*[! INFO!] SUS DIAMANTES SE HAN AGOTADO, PUEDE COMPRAR MÁS USANDO EL COMANDO ${usedPrefix}buy <cantidad>*`, m)
                    continue // Limit habis
                }
                if (plugin.level > userdb.level) {
                    this.reply(m.chat, `*¡SE REQUIERE EL NIVEL! ${plugin.level} PARA USAR ESTE COMANDO. TU NIVEL ES ${userdb.level}*`, m)
                    continue // If the level has not been reached
                }
                const paramsHandler = Object.assign(paramsBefore, {
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                })
                try {
                    await plugin.call(this, m, paramsHandler)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await this.onWhatsApp(jid))[0] || {}
                                if (data.exists && !m.fromMe)
                                    m.reply(`*[¡REPORTE DE COMANDO CON FALLOS!]*\n\n*PLUGIN:* ${m.plugin}\n*USUARIO:* ${m.sender}\n*COMANDO:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\`\n\n*[!] REPORTELO AL CREADOR, EL TRATARA DE DARLE SOLUCION, PUEDE USAR EL COMANDO #reporte*`.trim(), data.jid)
                            }
                        if (!m.fromMe) m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + ' DIAMANTE 💎 USADO')
                }
                break
            }
        }
        if (m) {
            if (m.sender && userdb) {
                userdb.exp += m.exp
                userdb.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

    } catch (e) {
        console.error('ErrorHandler: ', e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this, options)
        } catch (e) {
            console.log('printError', e)
        }
        if (opts['autoread'])
            await this.readMessages([m.key])
        
       if (!m.fromMem && m.text.match(/(Rey Endymion|@5215517489568|@5215533827255|ANIMXSCANS|ANI MX SCANS)/gi)) {
        let emot = pickRandom(["🎃", "❤", "😘", "😍", "💕", "😎", "🙌", "⭐", "👻", "🔥"])
        this.sendMessage(m.chat, { react: { text: emot, key: m.key }})}
        function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]}
    }
    await templateResponse(m, {chatUpdate})
}

/**
 * Handle groups participants update
 * @param {import('baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }, objs) {
    const {opts, db} = objs
    if (opts['self'])
        return
    if (this.isInit)
        return
    if (db.data == null)
        await loadDatabase()
    let chat = db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (this.chats[id] || {}).metadata
                for (let user of participants) {
                    let pp = './src/avatar_contact.png'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) {
                    } finally {
                        text = (action === 'add' ? (chat.sWelcome || this.welcome || this.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || '*SIN DESCRIPCION*') :
                            (chat.sBye || this.bye || this.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
                            let apii = await this.getFile(pp)
                        this.sendButton(id, text, groupMetadata.subject, pp, [
                        [(action == 'add' ? 'BIENVENIDO' : 'ADIOS'), (action == 'add' ? '#welcomegc' : '#byegc')],
                        ['MENU PRINCIPAL', `#menu`]
                        ], '',  { mentions: [user]})
                    }
                }
            }
            break
        case 'promote':
        case 'daradmin':
        case 'darpoder':
            text = (chat.sPromote || this.spromote || this.spromote || '@user ```is now Admin```')
        case 'demote':
        case 'quitarpoder':
        case 'quitaradmin':
            if (!text)
                text = (chat.sDemote || this.sdemote || this.sdemote || '@user ```is no longer Admin```')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)
                this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}

/**
 * Handle groups update
 * @param {import('baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate, objs) {
    const {opts, db} = objs
    let text, id
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
    if (groupUpdate.isComunityAnnounce) continue
        id = groupUpdate.id
        if (!id) continue
        let chats = db.data.chats[id] 
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || this.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || this.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || this.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || this.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
    }
        if (!text) return
        return this.sendMessage(id, { text, mentions: this.parseMention(text) })
}

export async function callUpdate(callUpdate, objs) {
    const {db} = objs
    let isAnticall = db.data.settings[this.user.jid].antiCall
    if (!isAnticall) return
    for (let nk of callUpdate) {
    if (nk.isGroup == false) {
    if (nk.status == "offer") {
    await this.reply(nk.from, `Hola *@${nk.from.split('@')[0]}*, las ${nk.isVideo ? 'videollamadas' : 'llamadas'} no están permitidas, serás bloqueado.\n-\nSi accidentalmente llamaste póngase en contacto con mi creador para que te desbloquee!`, false, { mentions: [nk.from] })
    await this.updateBlockStatus(nk.from, 'block')
    }
    }
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        await this.reply(msg.chat, `
━━━━⬣  *ANTI DELETE*  ⬣━━━━
*■ Nombre:* @${participant.split`@`[0]}
*■ Enviando el mensaje..*
*■ Para desactivar esta función escriba el comando:*
*—◉ #disable antidelete*
*—◉ #enable delete*
━━━━⬣  *ANTI DELETE*  ⬣━━━━
`.trim(), msg, {
            mentions: [participant]
        })
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

export const dfail = (type, m, conn) => {
    let msg = {
        rowner: '*[ ⚠️ *ALERTA* ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO POR EL/LA PROPIETARIO/A (OWNER) DEL BOT*',
        owner: '*[ ⚠️ *ALERTA* ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO POR EL/LA PROPIETARIO/A (OWNER) DEL BOT*',
        mods: '*[ ⚠️ *ALERTA* ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO POR MODERADORES Y EL/LA PROPIETARIO/A (OWNER) DEL BOT*',
        premium: '*[ ⚠️ *ALERTA* ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO POR USUARIOS PREMIUM Y EL/LA PROPIETARIO/A OWNER DEL BOT*',
        group: '*[ ⚠️ *ALERTA* ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO EN GRUPOS*',
        private: '*[ ⚠️ ALERTA ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO EN CHAT PRIVADO DEL BOT*',
        admin: '*[ ⚠️ ALERTA ⚠️ ] ESTE COMANDO SOLO PUEDE SER UTILIZADO POR ADMINS DEL GRUPO*',
        botAdmin: '*[ ⚠️ ALERTA ⚠️ ] PARA PODER USAR ESTE COMANDO ES NECESARIO QUE EL BOT SEA ADMIN, ASCENDER A ADMIN ESTE NUMERO*',
        unreg: '*[ 🛑 HEY!! ALTO, NO ESTAS REGISTRADO 🛑 ]*\n\n*—◉ PARA USAR ESTE COMANDO DEBES REGISTRARTE, USA EL COMANDO*\n*➣ #verificar*',
        restrict: '*[ ⚠️ ALERTA ⚠️ ] ESTE COMANDO ESTA RESTRINGIDO/DESACTIVADO POR DESICION DEL PROPIETARIO/A (OWNER) DEL BOT*'
    }[type]
    if (msg) return m.reply(msg)
}
/*
*/
const {__filename} = await import('./functions.js')
let file = __filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
     console.log(chalk.redBright("Update 'handler.js'"))
    const {reloadHandler} = await import('./connections.js')
    if (reloadHandler) await reloadHandler(true)
})

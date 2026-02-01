import fs from 'fs';
import path from 'path';
import { config } from '../../config.js';

export class MenuHandler {
    constructor() {
        this.menuImage = config.menu.image;
        this.menuVideo = config.menu.video;
    }

    async sendMainMenu(bot, jid) {
        try {
            // Try to send video menu
            if (config.menu.showVideo && fs.existsSync(this.menuVideo)) {
                await bot.sendMessage(jid, {
                    video: fs.readFileSync(this.menuVideo),
                    caption: this.generateMenuText(),
                    gifPlayback: true
                });
            }
            // Fallback to image
            else if (fs.existsSync(this.menuImage)) {
                await bot.sendMessage(jid, {
                    image: fs.readFileSync(this.menuImage),
                    caption: this.generateMenuText()
                });
            }
            // Fallback to text
            else {
                await bot.sendMessage(jid, {
                    text: this.generateMenuText()
                });
            }
        } catch (error) {
            console.error('Menu error:', error);
            await bot.sendMessage(jid, {
                text: this.generateMenuText()
            });
        }
    }

    generateMenuText() {
        return `
🤖 *SKY BOT AI v7.0*
⚡ 600+ Commands | 8-Digit Pairing | META AI

📌 *CORE COMMANDS*
${config.prefix}menu - Menu ini
${config.prefix}allmenu - Semua menu (600+)
${config.prefix}ping - Test bot
${config.prefix}owner - Owner bot
${config.prefix}speed - Speed test
${config.prefix}status - Status bot

🔑 *PAIRING CODE*
${config.prefix}pairing - Info pairing
${config.prefix}getcode - Dapatkan code
${config.prefix}showcode - Lihat code aktif

📥 *DOWNLOADER (50+)*
${config.prefix}play <query> - Download lagu
${config.prefix}yt <url> - YouTube downloader
${config.prefix}tiktok <url> - TikTok downloader
${config.prefix}ig <url> - Instagram downloader
${config.prefix}fb <url> - Facebook downloader

🖼️ *STICKER & MEDIA*
${config.prefix}sticker - Buat sticker
${config.prefix}toimg - Sticker ke gambar
${config.prefix}ttp <text> - Text to sticker
${config.prefix}attp <text> - Animated text

🎮 *GAMES & FUN*
${config.prefix}slot - Slot machine
${config.prefix}rpg - Game RPG
${config.prefix}tebakgambar - Tebak gambar
${config.prefix}family100 - Family 100
${config.prefix}tebaklagu - Tebak lagu

👥 *GROUP MANAGEMENT*
${config.prefix}add <number> - Add member
${config.prefix}kick @tag - Kick member
${config.prefix}promote @tag - Promote admin
${config.prefix}demote @tag - Demote admin
${config.prefix}tagall - Mention all

🔐 *SECURITY & ANTI*
${config.prefix}antilink on/off
${config.prefix}antibadword on/off
${config.prefix}antispam on/off
${config.prefix}antitoxic on/off
${config.prefix}antiporn on/off

🧠 *AI & CHAT*
${config.prefix}ai <pertanyaan>
${config.prefix}translate <text>
${config.prefix}summarize <text>
${config.prefix}rewrite <text>
${config.prefix}codeai <kode>

💰 *ECONOMY & RPG*
${config.prefix}bank - Bank system
${config.prefix}daily - Daily reward
${config.prefix}shop - Toko item
${config.prefix}hunt - Berburu monster
${config.prefix}mine - Mining

☪️ *ISLAMIC*
${config.prefix}jadwalsholat <kota>
${config.prefix}alquran <surah>
${config.prefix}doaharian - Doa harian
${config.prefix}ayatkursi - Ayat kursi
${config.prefix}hadits - Hadits Nabi

⚙️ *AUTOMATION*
${config.prefix}autoreply - Auto reply
${config.prefix}broadcast - Broadcast
${config.prefix}schedule - Jadwal pesan
${config.prefix}reminder - Pengingat

👑 *OWNER ONLY*
${config.prefix}ban @tag - Ban user
${config.prefix}addowner <num> - Add owner
${config.prefix}bcgc <msg> - Broadcast group
${config.prefix}eval <code> - Eval code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 *Pairing Code:* 8 digit WhatsApp
💎 *Premium:* Unlimited commands
🔧 *Total Commands:* 600+
📅 ${new Date().toLocaleDateString('id-ID')}

Ketik ${config.prefix}allmenu untuk melihat semua 600+ commands!
        `.trim();
    }

    async sendAllMenu(bot, jid) {
        const allMenu = `
🤖 *SKY BOT AI - ALL 600+ COMMANDS*

══════════════════════════════════════════
📌 *CORE & INFO (30 Commands)*
${config.prefix}menu, ${config.prefix}allmenu, ${config.prefix}ping, ${config.prefix}speed, ${config.prefix}runtime
${config.prefix}status, ${config.prefix}info, ${config.prefix}owner, ${config.prefix}rules, ${config.prefix}script
${config.prefix}changelog, ${config.prefix}report, ${config.prefix}donate, ${config.prefix}support, ${config.prefix}tutorial
${config.prefix}version, ${config.prefix}privacy, ${config.prefix}tos, ${config.prefix}faq, ${config.prefix}debug
${config.prefix}log, ${config.prefix}health, ${config.prefix}selftest, ${config.prefix}restart, ${config.prefix}shutdown
${config.prefix}update, ${config.prefix}checkupdate, ${config.prefix}backup, ${config.prefix}clearcache

══════════════════════════════════════════
📥 *DOWNLOADER (50+ Commands)*
${config.prefix}play, ${config.prefix}ytmp3, ${config.prefix}ytmp4, ${config.prefix}ytshorts, ${config.prefix}ytdl
${config.prefix}ytsearch, ${config.prefix}tiktok, ${config.prefix}tiktoknowm, ${config.prefix}tiktokwm, ${config.prefix}tiktokhd
${config.prefix}tiktokslide, ${config.prefix}tiktokmusic, ${config.prefix}ig, ${config.prefix}igstory, ${config.prefix}igreels
${config.prefix}igphoto, ${config.prefix}igvideo, ${config.prefix}fb, ${config.prefix}twitter, ${config.prefix}threads
${config.prefix}spotify, ${config.prefix}joox, ${config.prefix}soundcloud, ${config.prefix}mediafire, ${config.prefix}gdrive
${config.prefix}terabox, ${config.prefix}mega, ${config.prefix}zippyshare, ${config.prefix}pixeldrain, ${config.prefix}anonfiles
${config.prefix}apkdl, ${config.prefix}playstore, ${config.prefix}appstore, ${config.prefix}wallpaper, ${config.prefix}ringtone
${config.prefix}capcut, ${config.prefix}snackvideo, ${config.prefix}likee, ${config.prefix}pinterest, ${config.prefix}pixiv

══════════════════════════════════════════
🖼️ *MEDIA & CONVERTER (50+ Commands)*
${config.prefix}sticker, ${config.prefix}swm, ${config.prefix}toimg, ${config.prefix}tovideo, ${config.prefix}togif
${config.prefix}tomp3, ${config.prefix}tovn, ${config.prefix}tourl, ${config.prefix}ttp, ${config.prefix}attp
${config.prefix}emojimix, ${config.prefix}removebg, ${config.prefix}resize, ${config.prefix}crop, ${config.prefix}compress
${config.prefix}enhance, ${config.prefix}upscale, ${config.prefix}hdr, ${config.prefix}blur, ${config.prefix}sharpen
${config.prefix}invert, ${config.prefix}grayscale, ${config.prefix}pixelate, ${config.prefix}cartoon, ${config.prefix}anime
${config.prefix}triggered, ${config.prefix}wasted, ${config.prefix}wanted, ${config.prefix}rip, ${config.prefix}fire

══════════════════════════════════════════
😂 *FUN & GAMES (40+ Commands)*
${config.prefix}joke, ${config.prefix}darkjoke, ${config.prefix}quotes, ${config.prefix}pantun, ${config.prefix}bucin
${config.prefix}galau, ${config.prefix}bijak, ${config.prefix}puisi, ${config.prefix}cerpen, ${config.prefix}faktaunik
${config.prefix}truth, ${config.prefix}dare, ${config.prefix}wouldyourather, ${config.prefix}rate, ${config.prefix}cekjodoh
${config.prefix}cekhoki, ${config.prefix}siapakahaku, ${config.prefix}caklontong, ${config.prefix}tebaktebakan, ${config.prefix}tebakgambar
${config.prefix}tebaklagu, ${config.prefix}tebakkata, ${config.prefix}tebakkimia, ${config.prefix}susunkata, ${config.prefix}asahotak
${config.prefix}math, ${config.prefix}quiz, ${config.prefix}family100, ${config.prefix}slot, ${config.prefix}casino
${config.prefix}tictactoe, ${config.prefix}chess, ${config.prefix}suit, ${config.prefix}werewolf, ${config.prefix}mafia

══════════════════════════════════════════
☪️ *ISLAMIC (30+ Commands)*
${config.prefix}jadwalsholat, ${config.prefix}alquran, ${config.prefix}ayat, ${config.prefix}ayatkursi, ${config.prefix}asmaulhusna
${config.prefix}doaharian, ${config.prefix}niatsholat, ${config.prefix}tahlil, ${config.prefix}istighfar, ${config.prefix}dzikir
${config.prefix}wirid, ${config.prefix}hadits, ${config.prefix}kisahnabi, ${config.prefix}kisahrasul, ${config.prefix}niatpuasa
${config.prefix}imsak, ${config.prefix}buka, ${config.prefix}zakat, ${config.prefix}infaq, ${config.prefix}sedekah
${config.prefix}arahkiblat, ${config.prefix}haji, ${config.prefix}umrah, ${config.prefix}rukyat, ${config.prefix}qiblat

══════════════════════════════════════════
👥 *GROUP (40+ Commands)*
${config.prefix}add, ${config.prefix}kick, ${config.prefix}promote, ${config.prefix}demote, ${config.prefix}tagall
${config.prefix}linkgc, ${config.prefix}resetlink, ${config.prefix}setppgc, ${config.prefix}setname, ${config.prefix}setdesc
${config.prefix}welcome, ${config.prefix}goodbye, ${config.prefix}open, ${config.prefix}close, ${config.prefix}lock
${config.prefix}unlock, ${config.prefix}mute, ${config.prefix}unmute, ${config.prefix}slowmode, ${config.prefix}revoke
${config.prefix}listadmin, ${config.prefix}listmember, ${config.prefix}groupinfo, ${config.prefix}gcstats, ${config.prefix}gcsettings
${config.prefix}poll, ${config.prefix}anonymous, ${config.prefix}confess, ${config.prefix}grouplist, ${config.prefix}setrules

══════════════════════════════════════════
🔐 *SECURITY (30+ Commands)*
${config.prefix}antilink, ${config.prefix}antilinkyt, ${config.prefix}antilinkig, ${config.prefix}antibadword, ${config.prefix}antispam
${config.prefix}antiflood, ${config.prefix}antivirtex, ${config.prefix}antibot, ${config.prefix}antiscam, ${config.prefix}antiporn
${config.prefix}antitoxic, ${config.prefix}warn, ${config.prefix}unwarn, ${config.prefix}kickwarn, ${config.prefix}clearwarn
${config.prefix}blockcmd, ${config.prefix}unblockcmd, ${config.prefix}lockcmd, ${config.prefix}unlockcmd, ${config.prefix}cmdstatus
${config.prefix}cmdlist, ${config.prefix}blacklist, ${config.prefix}whitelist, ${config.prefix}antiphishing, ${config.prefix}antimalware

══════════════════════════════════════════
🔎 *SEARCH (40+ Commands)*
${config.prefix}google, ${config.prefix}gimage, ${config.prefix}bing, ${config.prefix}duckduckgo, ${config.prefix}yahoo
${config.prefix}wikipedia, ${config.prefix}kbbi, ${config.prefix}translate, ${config.prefix}lirik, ${config.prefix}chord
${config.prefix}cuaca, ${config.prefix}news, ${config.prefix}covid, ${config.prefix}kodepos, ${config.prefix}jarak
${config.prefix}maps, ${config.prefix}anime, ${config.prefix}manga, ${config.prefix}character, ${config.prefix}film
${config.prefix}jadwaltv, ${config.prefix}jadwalbola, ${config.prefix}jadwalkereta, ${config.prefix}jadwalpesawat, ${config.prefix}brainly

══════════════════════════════════════════
🎮 *GAME & RPG (40+ Commands)*
${config.prefix}rpg, ${config.prefix}profilegame, ${config.prefix}hunt, ${config.prefix}mine, ${config.prefix}fishing
${config.prefix}adventure, ${config.prefix}battle, ${config.prefix}duel, ${config.prefix}shop, ${config.prefix}buy
${config.prefix}sell, ${config.prefix}craft, ${config.prefix}upgrade, ${config.prefix}heal, ${config.prefix}openchest
${config.prefix}dailyrpg, ${config.prefix}weeklyrpg, ${config.prefix}monthlyrpg, ${config.prefix}pet, ${config.prefix}feedpet
${config.prefix}levelpet, ${config.prefix}equip, ${config.prefix}unequip, ${config.prefix}skill, ${config.prefix}quest

══════════════════════════════════════════
🧠 *AI & CHAT (30+ Commands)*
${config.prefix}ai, ${config.prefix}gemma, ${config.prefix}aion, ${config.prefix}aioff, ${config.prefix}aistatus
${config.prefix}aimode, ${config.prefix}aimode_fast, ${config.prefix}aimode_precise, ${config.prefix}aimode_creative
${config.prefix}aisetlang, ${config.prefix}aisetstyle, ${config.prefix}aisetlength, ${config.prefix}resetai, ${config.prefix}resetcontext
${config.prefix}aihistory, ${config.prefix}translateai, ${config.prefix}summarai, ${config.prefix}rewriteai, ${config.prefix}paraphraseai
${config.prefix}fixgrammar, ${config.prefix}explaintext, ${config.prefix}codeai, ${config.prefix}codefix, ${config.prefix}codedebug

══════════════════════════════════════════
📢 *SPAMMER (30+ Commands)*
${config.prefix}spam, ${config.prefix}spamtext, ${config.prefix}spamemoji, ${config.prefix}spamquote, ${config.prefix}spamtag
${config.prefix}spammention, ${config.prefix}spambutton, ${config.prefix}spamimage, ${config.prefix}spamsticker, ${config.prefix}spamgif
${config.prefix}spamvideo, ${config.prefix}spamaudio, ${config.prefix}spamvn, ${config.prefix}spamloc, ${config.prefix}spamcontact
${config.prefix}spamcatalog, ${config.prefix}spampoll, ${config.prefix}spamlist, ${config.prefix}spamtemplate, ${config.prefix}spamsequence

══════════════════════════════════════════
💰 *ECONOMY (30+ Commands)*
${config.prefix}bank, ${config.prefix}deposit, ${config.prefix}withdraw, ${config.prefix}transfer, ${config.prefix}pay
${config.prefix}tax, ${config.prefix}itemlist, ${config.prefix}refine, ${config.prefix}repair, ${config.prefix}durability
${config.prefix}petlist, ${config.prefix}adopt, ${config.prefix}renamepet, ${config.prefix}mount, ${config.prefix}farm
${config.prefix}plant, ${config.prefix}harvest, ${config.prefix}chop, ${config.prefix}build, ${config.prefix}forge

══════════════════════════════════════════
⚙️ *AUTOMATION (40+ Commands)*
${config.prefix}autoreply, ${config.prefix}setreply, ${config.prefix}delreply, ${config.prefix}listreply, ${config.prefix}keyword
${config.prefix}setcmd, ${config.prefix}delcmd, ${config.prefix}listcmd, ${config.prefix}broadcast, ${config.prefix}forward
${config.prefix}schedule, ${config.prefix}reminder, ${config.prefix}timer, ${config.prefix}polling, ${config.prefix}calc
${config.prefix}shortlink, ${config.prefix}qr, ${config.prefix}tts, ${config.prefix}stt, ${config.prefix}cron

══════════════════════════════════════════
👑 *OWNER (50+ Commands)*
${config.prefix}ban, ${config.prefix}unban, ${config.prefix}block, ${config.prefix}unblock, ${config.prefix}addpremium
${config.prefix}delpremium, ${config.prefix}resetlimit, ${config.prefix}setlimit, ${config.prefix}setppbot, ${config.prefix}setnamabot
${config.prefix}setbio, ${config.prefix}restart, ${config.prefix}shutdown, ${config.prefix}reload, ${config.prefix}update
${config.prefix}backup, ${config.prefix}clearcache, ${config.prefix}stats, ${config.prefix}logs, ${config.prefix}eval
${config.prefix}exec, ${config.prefix}shell, ${config.prefix}terminal, ${config.prefix}self, ${config.prefix}public
${config.prefix}setmode, ${config.prefix}bcgc, ${config.prefix}bcuser, ${config.prefix}setprefix, ${config.prefix}addowner

══════════════════════════════════════════
🔑 *PAIRING CODE*
${config.prefix}pairing, ${config.prefix}showcode, ${config.prefix}getcode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Total:* 600+ Commands
💎 *Features:* META AI, Pairing Code 8D, TikTok API
📱 *Pairing:* 8 digit WhatsApp standard
👑 *Owners:* ${owners.length} owners
📅 ${new Date().toLocaleDateString('id-ID')}

Gunakan ${config.prefix}<command> untuk menggunakan!
        `.trim();
        
        return allMenu;
    }
}
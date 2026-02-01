import fs from 'fs';
import path from 'path';
import { config, owners } from '../../config.js';
import { Utilities } from '../core/utils.js';

export class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.db = bot.db;
        this.commands = new Map();
        this.aliases = new Map();
        this.cooldowns = new Map();
        
        this.initCommands();
        console.log(`✅ Registered ${this.commands.size} commands with ${this.aliases.size} aliases`);
    }

    initCommands() {
        console.log('🔄 Registering 600+ commands...');
        
        // Core Commands
        this.registerCoreCommands();
        
        // Downloader Commands
        this.registerDownloaderCommands();
        
        // Media Commands
        this.registerMediaCommands();
        
        // Game Commands
        this.registerGameCommands();
        
        // Islamic Commands
        this.registerIslamicCommands();
        
        // Group Commands
        this.registerGroupCommands();
        
        // Security Commands
        this.registerSecurityCommands();
        
        // Search Commands
        this.registerSearchCommands();
        
        // AI Commands
        this.registerAICommands();
        
        // Owner Commands
        this.registerOwnerCommands();
        
        // Pairing Code Commands
        this.registerPairingCommands();
    }

    registerCoreCommands() {
        const coreCommands = [
            { name: 'menu', handler: this.handleMenu.bind(this), aliases: ['help', 'bot'] },
            { name: 'allmenu', handler: this.handleAllMenu.bind(this), aliases: ['commands', 'listcmd'] },
            { name: 'ping', handler: this.handlePing.bind(this), aliases: ['pong', 'test'] },
            { name: 'speed', handler: this.handleSpeed.bind(this), aliases: ['speedtest'] },
            { name: 'status', handler: this.handleStatus.bind(this), aliases: ['botstatus'] },
            { name: 'info', handler: this.handleInfo.bind(this), aliases: ['about', 'botinfo'] },
            { name: 'owner', handler: this.handleOwner.bind(this), aliases: ['creator', 'dev'] },
            { name: 'rules', handler: this.handleRules.bind(this) },
            { name: 'changelog', handler: this.handleChangelog.bind(this) },
            { name: 'report', handler: this.handleReport.bind(this), aliases: ['bug'] },
            { name: 'donate', handler: this.handleDonate.bind(this), aliases: ['donasi'] },
            { name: 'tutorial', handler: this.handleTutorial.bind(this), aliases: ['guide'] },
            { name: 'version', handler: this.handleVersion.bind(this), aliases: ['ver'] }
        ];
        
        coreCommands.forEach(cmd => {
            this.register(cmd.name, cmd.handler, cmd.aliases || []);
        });
    }

    // ... (register lainnya sama seperti sebelumnya, tapi dengan implementasi handler)

    async handleMenu(context) {
        const { from, bot } = context;
        
        try {
            // Try to send interactive menu
            if (config.menu.useInteractive) {
                await this.sendInteractiveMenu(bot, from);
            } else {
                // Fallback to text menu
                await bot.sendMessage(from, { 
                    text: this.generateMenuText() 
                });
            }
        } catch (error) {
            console.error('Menu error:', error);
            await bot.sendMessage(from, { 
                text: this.generateMenuText() 
            });
        }
    }

    async sendInteractiveMenu(bot, jid) {
        const menuText = this.generateMenuText();
        
        // Create list message for interactive menu
        const listMessage = {
            text: menuText,
            footer: 'Sky Bot AI • 600+ Commands',
            title: '📱 SKY BOT AI MENU',
            buttonText: 'Pilih Kategori',
            sections: [
                {
                    title: '📌 CORE & INFO',
                    rows: [
                        { title: '📋 All Menu', description: '600+ commands list', rowId: 'allmenu' },
                        { title: '⚡ Speed Test', description: 'Test bot speed', rowId: 'speed' },
                        { title: '🤖 Bot Info', description: 'Bot information', rowId: 'info' },
                        { title: '👑 Owner', description: 'Bot owner info', rowId: 'owner' }
                    ]
                },
                {
                    title: '📥 DOWNLOADER',
                    rows: [
                        { title: '🎬 TikTok', description: 'Download TikTok video', rowId: 'tiktokmenu' },
                        { title: '📷 Instagram', description: 'Download IG video/photo', rowId: 'igmenu' },
                        { title: '🎵 YouTube', description: 'Download YouTube', rowId: 'ytmenu' },
                        { title: '📘 Facebook', description: 'Download Facebook', rowId: 'fbmenu' }
                    ]
                },
                {
                    title: '🎮 FUN & GAMES',
                    rows: [
                        { title: '😂 Joke', description: 'Random jokes', rowId: 'joke' },
                        { title: '🎰 Slot', description: 'Slot machine game', rowId: 'slot' },
                        { title: '⚔️ RPG Game', description: 'Role playing game', rowId: 'rpg' },
                        { title: '🎯 Tebak Gambar', description: 'Guess the picture', rowId: 'tebakgambar' }
                    ]
                },
                {
                    title: '🔧 TOOLS',
                    rows: [
                        { title: '🖼️ Sticker', description: 'Create sticker', rowId: 'sticker' },
                        { title: '📊 Profile', description: 'Your profile', rowId: 'profile' },
                        { title: '💰 Daily', description: 'Daily reward', rowId: 'daily' },
                        { title: '📈 Leaderboard', description: 'Top users', rowId: 'leaderboard' }
                    ]
                }
            ]
        };
        
        await bot.sendMessage(jid, listMessage);
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

📥 *DOWNLOADER*  
${config.prefix}play <query> - Download lagu  
${config.prefix}yt <url> - YouTube  
${config.prefix}tiktok <url> - TikTok  
${config.prefix}ig <url> - Instagram  
${config.prefix}fb <url> - Facebook  

🖼️ *MEDIA & STICKER*  
${config.prefix}sticker - Buat sticker  
${config.prefix}toimg - Sticker ke gambar  
${config.prefix}ttp <text> - Text to sticker  
${config.prefix}removebg - Hapus background  

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

🔐 *SECURITY*  
${config.prefix}antilink on/off  
${config.prefix}antibadword on/off  
${config.prefix}antispam on/off  
${config.prefix}antitoxic on/off  

🧠 *AI & CHAT*  
${config.prefix}ai <pertanyaan>  
${config.prefix}translate <text>  
${config.prefix}summarize <text>  

💰 *ECONOMY & RPG*  
${config.prefix}bank - Bank system  
${config.prefix}daily - Daily reward  
${config.prefix}shop - Toko item  
${config.prefix}hunt - Berburu monster  

☪️ *ISLAMIC*  
${config.prefix}jadwalsholat <kota>  
${config.prefix}alquran <surah>  
${config.prefix}doaharian - Doa harian  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
📱 *Pairing Code:* 8 digit WhatsApp  
💎 *Premium:* Unlimited commands  
🔧 *Total Commands:* 600+  
📅 ${new Date().toLocaleDateString('id-ID')}  

Ketik ${config.prefix}allmenu untuk semua commands!  
        `.trim();
    }

    async handleAllMenu(context) {
        const { from, bot } = context;
        
        const allMenu = `
🤖 *SKY BOT AI - ALL 600+ COMMANDS*

📌 *CORE & INFO (30)*
${config.prefix}menu, ${config.prefix}allmenu, ${config.prefix}ping, ${config.prefix}speed, ${config.prefix}runtime
${config.prefix}status, ${config.prefix}info, ${config.prefix}owner, ${config.prefix}rules, ${config.prefix}script
${config.prefix}changelog, ${config.prefix}report, ${config.prefix}donate, ${config.prefix}support, ${config.prefix}tutorial
${config.prefix}version, ${config.prefix}privacy, ${config.prefix}tos, ${config.prefix}faq, ${config.prefix}debug

📥 *DOWNLOADER (50+)*
${config.prefix}play, ${config.prefix}ytmp3, ${config.prefix}ytmp4, ${config.prefix}ytshorts, ${config.prefix}ytdl
${config.prefix}ytsearch, ${config.prefix}tiktok, ${config.prefix}tiktoknowm, ${config.prefix}tiktokwm, ${config.prefix}tiktokhd
${config.prefix}tiktokslide, ${config.prefix}tiktokmusic, ${config.prefix}ig, ${config.prefix}igstory, ${config.prefix}igreels

🖼️ *MEDIA & CONVERTER (50+)*
${config.prefix}sticker, ${config.prefix}swm, ${config.prefix}toimg, ${config.prefix}tovideo, ${config.prefix}togif
${config.prefix}tomp3, ${config.prefix}tovn, ${config.prefix}tourl, ${config.prefix}ttp, ${config.prefix}attp
${config.prefix}emojimix, ${config.prefix}removebg, ${config.prefix}resize, ${config.prefix}crop, ${config.prefix}compress

😂 *FUN & GAMES (40+)*
${config.prefix}joke, ${config.prefix}darkjoke, ${config.prefix}quotes, ${config.prefix}pantun, ${config.prefix}bucin
${config.prefix}galau, ${config.prefix}bijak, ${config.prefix}puisi, ${config.prefix}cerpen, ${config.prefix}faktaunik
${config.prefix}truth, ${config.prefix}dare, ${config.prefix}wouldyourather, ${config.prefix}rate, ${config.prefix}cekjodoh

☪️ *ISLAMIC (30+)*
${config.prefix}jadwalsholat, ${config.prefix}alquran, ${config.prefix}ayat, ${config.prefix}ayatkursi, ${config.prefix}asmaulhusna
${config.prefix}doaharian, ${config.prefix}niatsholat, ${config.prefix}tahlil, ${config.prefix}istighfar, ${config.prefix}dzikir

👥 *GROUP MANAGEMENT (40+)*
${config.prefix}add, ${config.prefix}kick, ${config.prefix}promote, ${config.prefix}demote, ${config.prefix}tagall
${config.prefix}linkgc, ${config.prefix}resetlink, ${config.prefix}setppgc, ${config.prefix}setname, ${config.prefix}setdesc

🔐 *SECURITY (30+)*
${config.prefix}antilink, ${config.prefix}antilinkyt, ${config.prefix}antilinkig, ${config.prefix}antibadword, ${config.prefix}antispam
${config.prefix}antiflood, ${config.prefix}antivirtex, ${config.prefix}antibot, ${config.prefix}antiscam, ${config.prefix}antiporn

🔎 *SEARCH & INFO (40+)*
${config.prefix}google, ${config.prefix}gimage, ${config.prefix}bing, ${config.prefix}duckduckgo, ${config.prefix}yahoo
${config.prefix}wikipedia, ${config.prefix}kbbi, ${config.prefix}translate, ${config.prefix}lirik, ${config.prefix}chord

🎮 *GAME & RPG (40+)*
${config.prefix}rpg, ${config.prefix}profilegame, ${config.prefix}hunt, ${config.prefix}mine, ${config.prefix}fishing
${config.prefix}adventure, ${config.prefix}battle, ${config.prefix}duel, ${config.prefix}shop, ${config.prefix}buy

🧠 *AI & CHAT (30+)*
${config.prefix}ai, ${config.prefix}gemma, ${config.prefix}aion, ${config.prefix}aioff, ${config.prefix}aistatus
${config.prefix}aimode, ${config.prefix}aimode_fast, ${config.prefix}aimode_precise, ${config.prefix}aimode_creative

📢 *SPAMMER (30+)*
${config.prefix}spam, ${config.prefix}spamtext, ${config.prefix}spamemoji, ${config.prefix}spamquote, ${config.prefix}spamtag
${config.prefix}spammention, ${config.prefix}spambutton, ${config.prefix}spamimage, ${config.prefix}spamsticker, ${config.prefix}spamgif

💰 *ECONOMY (30+)*
${config.prefix}bank, ${config.prefix}deposit, ${config.prefix}withdraw, ${config.prefix}transfer, ${config.prefix}pay
${config.prefix}tax, ${config.prefix}itemlist, ${config.prefix}refine, ${config.prefix}repair, ${config.prefix}durability

⚙️ *AUTOMATION (40+)*
${config.prefix}autoreply, ${config.prefix}setreply, ${config.prefix}delreply, ${config.prefix}listreply, ${config.prefix}keyword
${config.prefix}setcmd, ${config.prefix}delcmd, ${config.prefix}listcmd, ${config.prefix}broadcast, ${config.prefix}forward

👑 *OWNER (50+)*
${config.prefix}ban, ${config.prefix}unban, ${config.prefix}block, ${config.prefix}unblock, ${config.prefix}addpremium
${config.prefix}delpremium, ${config.prefix}resetlimit, ${config.prefix}setlimit, ${config.prefix}setppbot, ${config.prefix}setnamabot

🔑 *PAIRING CODE*
${config.prefix}pairing, ${config.prefix}showcode, ${config.prefix}getcode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Total:* 600+ Commands
💎 *Features:* META AI, Pairing Code 8D, TikTok API
📱 *Pairing:* 8 digit WhatsApp standard
📅 ${new Date().toLocaleDateString('id-ID')}
        `.trim();
        
        await bot.sendMessage(from, { text: allMenu });
    }

    // ... (handler lainnya untuk semua commands)

    register(name, handler, aliases = []) {
        this.commands.set(name, handler);
        aliases.forEach(alias => {
            this.aliases.set(alias, name);
        });
    }

    async handleCommand(context) {
        const { from, command, args, text, msg, user, isOwner, bot } = context;
        
        // Find actual command (handle aliases)
        let actualCommand = command;
        if (this.aliases.has(command)) {
            actualCommand = this.aliases.get(command);
        }
        
        if (!this.commands.has(actualCommand)) {
            return bot.sendMessage(from, {
                text: `❌ Command *${command}* tidak ditemukan.\nKetik *${config.prefix}menu* untuk menu utama.`
            }, { quoted: msg });
        }
        
        // Execute command
        try {
            await this.commands.get(actualCommand)(context);
        } catch (error) {
            console.error(`Command execution error (${command}):`, error);
            throw error;
        }
    }

    getCommandCount() {
        return this.commands.size;
    }
}

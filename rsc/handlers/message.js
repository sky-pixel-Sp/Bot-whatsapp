import fs from 'fs';
import path from 'path';
import { config, owners } from '../../config.js';

export class MessageHandler {
    constructor(bot) {
        this.bot = bot;
        this.db = bot.db;
        this.commandHandler = bot.commandHandler;
    }

    async handle(msg, bot) {
        if (!msg.message) return;
        
        const msgType = Object.keys(msg.message)[0];
        if (['protocolMessage', 'senderKeyDistributionMessage', 'reactionMessage'].includes(msgType)) {
            return;
        }
        
        const from = msg.key.remoteJid;
        const pushName = msg.pushName || 'User';
        const isGroup = from.endsWith('@g.us');
        const isOwner = owners.includes(from);
        const user = this.db.getUser(from);
        
        // Update user info
        user.lastSeen = Date.now();
        if (!user.name || user.name !== pushName) {
            user.name = pushName;
            this.db.updateUser(from, user);
        }
        
        // Extract message text
        let text = '';
        if (msg.message.conversation) {
            text = msg.message.conversation;
        } else if (msg.message.extendedTextMessage) {
            text = msg.message.extendedTextMessage.text || '';
        } else if (msg.message.imageMessage) {
            text = msg.message.imageMessage.caption || '';
        } else if (msg.message.videoMessage) {
            text = msg.message.videoMessage.caption || '';
        } else if (msg.message.documentMessage) {
            text = msg.message.documentMessage.caption || '';
        }
        
        // Handle AFK
        if (user.afk && text) {
            user.afk = false;
            user.afkReason = '';
            this.db.updateUser(from, user);
            
            await bot.sendMessage(from, {
                text: `👋 Welcome back, ${pushName}! AFK mode disabled.`
            });
        }
        
        // Check if banned
        if (this.db.isBanned(from) && !isOwner) {
            const ban = this.db.data.banned[from];
            return bot.sendMessage(from, {
                text: `🚫 Kamu dibanned!\nAlasan: ${ban.reason || 'Tidak diketahui'}\nSisa: ${this.formatTime(ban.expires - Date.now())}`
            });
        }
        
        // Check if command
        if (text.startsWith(config.prefix)) {
            return this.handleCommand(text, from, msg, pushName, isGroup, isOwner, user, bot);
        }
        
        // Handle auto-reply for private chat
        if (!isGroup) {
            await this.handleAutoReply(text, from, pushName, bot);
        }
        
        // Handle group features
        if (isGroup) {
            await this.handleGroupFeatures(text, from, msg, bot);
        }
        
        // Update stats
        this.db.data.stats.totalMessages++;
    }

    async handleCommand(text, from, msg, pushName, isGroup, isOwner, user, bot) {
        const args = text.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const fullText = text.slice(config.prefix.length + command.length).trim();
        
        console.log(`📝 Command: ${command} from ${pushName} (${from})`);
        
        // Check for blocked commands in group
        if (isGroup) {
            const group = this.db.getGroup(from);
            if (group.blockedCommands.includes(command) && !isOwner) {
                return bot.sendMessage(from, {
                    text: `❌ Command *${command}* diblokir di grup ini!`
                }, { quoted: msg });
            }
        }
        
        // Check user limit
        if (!isOwner && !user.premium && user.limit <= 0) {
            return bot.sendMessage(from, {
                text: `❌ Limit kamu habis!\nGunakan *${config.prefix}daily* untuk mendapatkan limit.\nLimit: 0/${config.limits.free}\nPremium: Rp 50.000/bulan`
            }, { quoted: msg });
        }
        
        // Prepare context
        const context = {
            from,
            msg,
            command,
            args,
            text: fullText,
            pushName,
            user,
            isGroup,
            isOwner,
            bot
        };
        
        // Execute command
        try {
            await this.commandHandler.handleCommand(context);
            
            // Update user stats
            if (!isOwner && !user.premium) {
                user.limit--;
            }
            user.totalCommands++;
            this.db.updateUser(from, user);
            this.db.incrementStat('totalCommands');
            
        } catch (error) {
            console.error(`Command error (${command}):`, error);
            this.db.incrementStat('errors');
            
            await bot.sendMessage(from, {
                text: `❌ Error: ${error.message}\n\n💡 Gunakan *${config.prefix}report* untuk melaporkan bug.`
            }, { quoted: msg });
        }
    }

    async handleAutoReply(text, from, pushName, bot) {
        // Simple auto-reply for common questions
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('halo') || lowerText.includes('hai') || lowerText.includes('hi')) {
            await bot.sendMessage(from, {
                text: `Halo ${pushName}! 👋\nSaya Sky Bot AI dengan 600+ commands.\nKetik *${config.prefix}menu* untuk melihat menu.`
            });
        }
        
        if (lowerText.includes('terima kasih') || lowerText.includes('makasih') || lowerText.includes('thanks')) {
            await bot.sendMessage(from, {
                text: `Sama-sama ${pushName}! 😊\nSenang bisa membantu!`
            });
        }
        
        if (lowerText.includes('nama kamu') || lowerText.includes('siapa kamu')) {
            await bot.sendMessage(from, {
                text: `Saya Sky Bot AI 🤖, dibuat oleh Sky dengan 600+ commands!\n• META AI Integration\n• 8-Digit Pairing Code\n• Optimized for Termux\n\nKetik *${config.prefix}info* untuk info lengkap.`
            });
        }
    }

    async handleGroupFeatures(text, from, msg, bot) {
        const group = this.db.getGroup(from);
        
        // Anti-link
        if (group.antilink && this.hasLink(text)) {
            await this.sock.sendMessage(from, {
                delete: msg.key
            }).catch(() => {});
            
            const participant = msg.key.participant;
            await bot.sendMessage(from, {
                text: `⚠️ Link detected and deleted!\nUser: @${participant?.split('@')[0] || 'Unknown'}`,
                mentions: participant ? [participant] : []
            });
        }
        
        // Anti-badword
        if (group.antibadword && this.hasBadword(text)) {
            await this.sock.sendMessage(from, {
                delete: msg.key
            }).catch(() => {});
            
            const participant = msg.key.participant;
            if (participant) {
                group.warnedUsers[participant] = (group.warnedUsers[participant] || 0) + 1;
                this.db.updateGroup(from, group);
                
                const warns = group.warnedUsers[participant];
                let warning = `⚠️ Badword detected!\nUser: @${participant.split('@')[0]}\nWarns: ${warns}/3`;
                
                if (warns >= 3) {
                    warning += '\n🚫 User will be kicked!';
                    try {
                        await bot.sock.groupParticipantsUpdate(from, [participant], 'remove');
                    } catch (error) {
                        console.error('Kick error:', error);
                    }
                }
                
                await bot.sendMessage(from, {
                    text: warning,
                    mentions: [participant]
                });
            }
        }
    }

    async handleGroupUpdate(update, bot) {
        const { id, participants, action } = update;
        const group = this.db.getGroup(id);
        
        if (action === 'add' && group.welcome) {
            for (const participant of participants) {
                const user = this.db.getUser(participant);
                const welcomeMsg = group.welcomeMessage
                    .replace('@user', `@${participant.split('@')[0]}`)
                    .replace('{name}', user.name || 'User')
                    .replace('{group}', group.name || 'Group');
                
                await bot.sendMessage(id, {
                    text: welcomeMsg,
                    mentions: [participant]
                });
            }
        }
        
        if (action === 'remove' && group.goodbye) {
            for (const participant of participants) {
                const goodbyeMsg = group.goodbyeMessage
                    .replace('@user', `@${participant.split('@')[0]}`)
                    .replace('{group}', group.name || 'Group');
                
                await bot.sendMessage(id, {
                    text: goodbyeMsg,
                    mentions: [participant]
                });
            }
        }
    }

    hasLink(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return urlRegex.test(text);
    }

    hasBadword(text) {
        const badwords = [
            'anjing', 'bangsat', 'goblok', 'tolol', 'kontol',
            'babi', 'memek', 'ngentot', 'jancok', 'asu'
        ];
        return badwords.some(word => text.toLowerCase().includes(word));
    }

    formatTime(ms) {
        if (ms <= 0) return 'permanent';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} hari`;
        if (hours > 0) return `${hours} jam`;
        if (minutes > 0) return `${minutes} menit`;
        return `${seconds} detik`;
    }
}
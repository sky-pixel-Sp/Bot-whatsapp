import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../../config.js';

export class Utilities {
    static formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (days > 0) parts.push(`${days} hari`);
        if (hours > 0) parts.push(`${hours} jam`);
        if (minutes > 0) parts.push(`${minutes} menit`);
        if (secs > 0) parts.push(`${secs} detik`);
        
        return parts.join(' ') || '0 detik';
    }

    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static async question(prompt) {
        const readline = await import('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    static generateId(length = 12) {
        return crypto.randomBytes(length).toString('hex');
    }

    static isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    static getRandom(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static parseNumber(number) {
        let num = number.replace(/[^0-9]/g, '');
        if (num.startsWith('0')) num = '62' + num.slice(1);
        if (!num.endsWith('@s.whatsapp.net')) num += '@s.whatsapp.net';
        return num;
    }

    static extractUrls(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    }

    static getCurrentRank(level) {
        const ranks = Object.keys(config.ranks).map(Number).sort((a, b) => b - a);
        for (const rank of ranks) {
            if (level >= rank) return config.ranks[rank];
        }
        return "🌱 Beginner";
    }

    static async downloadMedia(message, filename) {
        try {
            const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
            const type = Object.keys(message)[0];
            const stream = await downloadContentFromMessage(message[type], type === 'imageMessage' ? 'image' : 'video');
            const buffer = [];
            for await (const chunk of stream) {
                buffer.push(chunk);
            }
            return Buffer.concat(buffer);
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    static generatePairingCode() {
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += Math.floor(Math.random() * 10);
        }
        
        return { 
            raw: code, 
            formatted: code.substring(0, 4) + ' ' + code.substring(4),
            timestamp: Date.now(),
            expires: Date.now() + 300000
        };
    }
}
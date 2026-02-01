import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { owners, saveOwners } from '../../config.js';

const execAsync = promisify(exec);

export class OwnerTerminal {
    constructor() {
        this.options = [
            'Add Owner',
            'Remove Owner',
            'List Owners',
            'Broadcast Message',
            'Bot Statistics',
            'Database Management',
            'Clear Cache',
            'Restart Bot',
            'Shutdown Bot',
            'Update Bot',
            'Exit'
        ];
    }

    async start() {
        console.clear();
        console.log(chalk.yellow('='.repeat(60)));
        console.log(chalk.cyan.bold('👑 SKY BOT AI OWNER TERMINAL'));
        console.log(chalk.yellow('='.repeat(60)));
        
        while (true) {
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'Select action:',
                    choices: this.options
                }
            ]);
            
            await this.handleAction(action);
            
            if (action === 'Exit') break;
        }
    }

    async handleAction(action) {
        switch (action) {
            case 'Add Owner':
                await this.addOwner();
                break;
            case 'Remove Owner':
                await this.removeOwner();
                break;
            case 'List Owners':
                this.listOwners();
                break;
            case 'Broadcast Message':
                await this.broadcastMessage();
                break;
            case 'Bot Statistics':
                await this.showStats();
                break;
            case 'Database Management':
                await this.manageDatabase();
                break;
            case 'Clear Cache':
                await this.clearCache();
                break;
            case 'Restart Bot':
                await this.restartBot();
                break;
            case 'Shutdown Bot':
                await this.shutdownBot();
                break;
            case 'Update Bot':
                await this.updateBot();
                break;
        }
    }

    async addOwner() {
        const { number } = await inquirer.prompt([
            {
                type: 'input',
                name: 'number',
                message: 'Enter WhatsApp number (628xxxxxxx):',
                validate: input => /^628\d{8,}$/.test(input) ? true : 'Invalid number'
            }
        ]);
        
        const ownerJid = number + '@s.whatsapp.net';
        
        if (owners.includes(ownerJid)) {
            console.log(chalk.red('⚠️ Owner already exists!'));
            return;
        }
        
        owners.push(ownerJid);
        saveOwners();
        
        console.log(chalk.green(`✅ Added owner: ${number}`));
        console.log(chalk.cyan(`Total owners: ${owners.length}`));
    }

    async removeOwner() {
        if (owners.length === 0) {
            console.log(chalk.red('❌ No owners to remove!'));
            return;
        }
        
        const choices = owners.map((owner, index) => ({
            name: `${index + 1}. ${owner.split('@')[0]}`,
            value: owner
        }));
        
        const { selected } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selected',
                message: 'Select owner to remove:',
                choices
            }
        ]);
        
        const index = owners.indexOf(selected);
        if (index > -1) {
            owners.splice(index, 1);
            saveOwners();
            console.log(chalk.green(`✅ Removed owner: ${selected.split('@')[0]}`));
        }
    }

    listOwners() {
        console.log(chalk.cyan('\n📋 LIST OF OWNERS'));
        console.log(chalk.yellow('='.repeat(40)));
        
        if (owners.length === 0) {
            console.log(chalk.red('No owners set'));
        } else {
            owners.forEach((owner, index) => {
                console.log(chalk.green(`${index + 1}. ${owner.split('@')[0]}`));
            });
        }
        
        console.log(chalk.yellow('='.repeat(40)));
    }

    async broadcastMessage() {
        const { message } = await inquirer.prompt([
            {
                type: 'input',
                name: 'message',
                message: 'Enter broadcast message:'
            }
        ]);
        
        console.log(chalk.yellow(`📢 Broadcasting to ${owners.length} owners...`));
        
        // In real implementation, you would send to all users
        // This is just a simulation
        owners.forEach(owner => {
            console.log(chalk.gray(`→ ${owner.split('@')[0]}: ${message}`));
        });
        
        console.log(chalk.green('✅ Broadcast sent!'));
    }

    async showStats() {
        try {
            // Get bot stats from database
            const dbPath = './sky_database.json';
            let stats = {};
            
            if (fs.existsSync(dbPath)) {
                const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                stats = dbData.stats || {};
            }
            
            console.log(chalk.cyan('\n📊 BOT STATISTICS'));
            console.log(chalk.yellow('='.repeat(40)));
            console.log(chalk.green(`🤖 Total Users: ${Object.keys(stats.users || {}).length}`));
            console.log(chalk.green(`📝 Total Messages: ${stats.totalMessages || 0}`));
            console.log(chalk.green(`⚡ Total Commands: ${stats.totalCommands || 0}`));
            console.log(chalk.green(`📥 Total Downloads: ${stats.totalDownloads || 0}`));
            console.log(chalk.green(`❌ Total Errors: ${stats.errors || 0}`));
            console.log(chalk.green(`🔄 Startups: ${stats.startups || 0}`));
            console.log(chalk.yellow('='.repeat(40)));
            
        } catch (error) {
            console.error(chalk.red('Error getting stats:'), error);
        }
    }

    async manageDatabase() {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Database action:',
                choices: ['Backup', 'Restore', 'Clear', 'View Size']
            }
        ]);
        
        switch (action) {
            case 'Backup':
                await this.backupDatabase();
                break;
            case 'Restore':
                await this.restoreDatabase();
                break;
            case 'Clear':
                await this.clearDatabase();
                break;
            case 'View Size':
                this.viewDatabaseSize();
                break;
        }
    }

    async backupDatabase() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = `./backups/backup-${timestamp}.json`;
        
        if (!fs.existsSync('./sky_database.json')) {
            console.log(chalk.red('❌ Database file not found!'));
            return;
        }
        
        fs.copyFileSync('./sky_database.json', backupFile);
        console.log(chalk.green(`✅ Backup created: ${backupFile}`));
    }

    async clearCache() {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Clear temp files and cache?',
                default: false
            }
        ]);
        
        if (confirm) {
            try {
                await execAsync('rm -rf ./temp/*');
                await execAsync('rm -rf ./session/.wwebjs_auth/*');
                console.log(chalk.green('✅ Cache cleared!'));
            } catch (error) {
                console.error(chalk.red('Error clearing cache:'), error);
            }
        }
    }

    async restartBot() {
        console.log(chalk.yellow('🔄 Restarting bot...'));
        // In real implementation, this would restart the bot process
        console.log(chalk.green('✅ Bot restart initiated'));
    }

    async shutdownBot() {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Shutdown bot?',
                default: false
            }
        ]);
        
        if (confirm) {
            console.log(chalk.red('🛑 Shutting down bot...'));
            process.exit(0);
        }
    }

    async updateBot() {
        console.log(chalk.yellow('🔄 Updating bot from GitHub...'));
        
        try {
            const { stdout } = await execAsync('git pull');
            console.log(chalk.green('✅ Update output:'));
            console.log(chalk.gray(stdout));
            
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Install updated dependencies?',
                    default: true
                }
            ]);
            
            if (confirm) {
                console.log(chalk.yellow('📦 Installing dependencies...'));
                const { stdout: installOutput } = await execAsync('npm install');
                console.log(chalk.green('✅ Dependencies updated'));
                console.log(chalk.gray(installOutput));
            }
            
        } catch (error) {
            console.error(chalk.red('Update error:'), error);
        }
    }

    viewDatabaseSize() {
        if (fs.existsSync('./sky_database.json')) {
            const stats = fs.statSync('./sky_database.json');
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(chalk.cyan(`📊 Database size: ${sizeMB} MB`));
        } else {
            console.log(chalk.red('❌ Database file not found'));
        }
    }

    async clearDatabase() {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'WARNING: This will clear ALL user data! Continue?',
                default: false
            }
        ]);
        
        if (confirm) {
            // Create backup first
            await this.backupDatabase();
            
            // Clear database
            const emptyDB = {
                users: {},
                groups: {},
                settings: {},
                stats: {
                    totalMessages: 0,
                    totalCommands: 0,
                    totalDownloads: 0,
                    startups: 0,
                    errors: 0
                }
            };
            
            fs.writeFileSync('./sky_database.json', JSON.stringify(emptyDB, null, 2));
            console.log(chalk.green('✅ Database cleared!'));
        }
    }
}

const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = 'YOUR_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Function to fetch basic profile information from Instagram
function fetchInstagramProfile(username) {
    return new Promise((resolve, reject) => {
        exec(`instaloader --quiet --fast-update --no-pictures --no-videos --no-metadata-json --no-compress-json ${username}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

// Listen for any kind of message
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (message.startsWith('/profile')) {
        const username = message.split(' ')[1];
        if (!username) {
            bot.sendMessage(chatId, 'Please provide a username after /profile command.');
            return;
        }

        try {
            const profileInfo = await fetchInstagramProfile(username);
            bot.sendMessage(chatId, profileInfo);
        } catch (error) {
            bot.sendMessage(chatId, 'Error fetching Instagram profile information.');
            console.error('Error fetching Instagram profile:', error);
        }
    } else {
        // Send a default message if the command is not recognized
        bot.sendMessage(chatId, 'Hello, this is a simple Telegram bot! Send /profile <username> to fetch Instagram profile information.');
    }
});

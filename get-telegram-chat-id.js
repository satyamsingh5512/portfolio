#!/usr/bin/env node

// Script to get your Telegram Chat ID
// Run this after setting up your bot and sending a message to it

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log('❌ Please set TELEGRAM_BOT_TOKEN in your .env file first');
  process.exit(1);
}

async function getChatId() {
  try {
    console.log('🤖 Fetching updates from your bot...');

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Telegram API Error: ${data.description}`);
    }

    if (data.result.length === 0) {
      console.log('📭 No messages found. Please send a message to your bot first!');
      console.log('   1. Open Telegram and search for your bot');
      console.log('   2. Send any message to your bot');
      console.log('   3. Run this script again');
      return;
    }

    const latestMessage = data.result[data.result.length - 1];
    const chatId = latestMessage.message.chat.id;

    console.log('✅ Your Chat ID is:', chatId);
    console.log('📝 Add this to your .env file:');
    console.log(`TELEGRAM_CHAT_ID=${chatId}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getChatId();
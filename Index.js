const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ✅ Load environment variables (Render will set these)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ✅ Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// ✅ WebSocket connection
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("message", (msg) => {
        console.log(`Received: ${msg}`);
        
        // ✅ Send message to Telegram bot
        bot.sendMessage(CHAT_ID, `New WebSocket Message: ${msg}`);

        socket.emit("response", `Echo: ${msg}`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// ✅ Keep WebSocket Alive
setInterval(() => {
    io.emit("ping", "keep-alive");
}, 25000);

// ✅ HTTP Route for Testing
app.get("/", (req, res) => {
    res.send("Render Test Bot is running!");
});

// ✅ Use Render’s Dynamic Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

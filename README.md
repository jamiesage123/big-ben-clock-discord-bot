# Big Ben Clock Discord bot
This repository contains the source code for a discord bot that chimes every night at midnight (GMT)

## Installation
This bot is written to run on top of node.js. Please see [https://nodejs.org/](https://nodejs.org/en/download/) for more information on node.js.

Run `npm install` in the root directory to install all the bots dependencies.

Once you have the dependencies, you wil need to create a new application on discord along with a bot for the application. This can be done via [Discord Developer Portal](https://discordapp.com/developers/).


Once you have your Discord Bot set up, rename the `.env.example` file (located in the root directory) to `.env` and set the `BOT_TOKEN` to your Discord applications bot token.

Now, run `npm run start` to start the bot.

You will need to invite the bot to your server. The bot needs at least "Connect" and "Speak" permissions.

## Commands
`!bigbenclock <voice channel name>` - Set a voice channel as the "big ben clock"
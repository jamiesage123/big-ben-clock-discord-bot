# Big Ben Clock Discord bot
This repository contains the source code for a discord bot that chimes every hour of the day.

## Installation with Docker
If you want to run the big-ben clock discord bot on docker you can do that with the following command:
   
```
docker run --name BigBen-Bot --env BOT_TOKEN="<Replace with Discord-Bot Token>" --env DATABASE_URL="postgres://username:password@IP/Localhost:5432/DatabaseName" kippenhof/bigbendiscord
``` 


## Installation
This bot is written to run on top of node.js. Please see [https://nodejs.org/](https://nodejs.org/en/download/) for more information on node.js. You will also need PostgreSQL.

Run `npm install` in the root directory to install all the bots dependencies.

On windows, you may need to install windows build tools (i.e `windows npm install -g windows-build-tools`)

Once you have the dependencies, you wil need to create a new application on discord along with a bot for the application. This can be done via [Discord Developer Portal](https://discordapp.com/developers/).

Once you have your Discord Bot set up, rename the `.env.example` file (located in the root directory) to `.env` and set the `BOT_TOKEN` to your Discord applications bot token and update the `DATABASE_URL` to match your PostgresSQL information.

Now, run `npm run migrate up` and then `npm run start` to start the bot.

You will need to invite the bot to your server. The bot needs at least "Connect" and "Speak" permissions.

## Commands
`!bigbenclock set <voice channel name>` - Set a voice channel as the "Big Ben clock voice channel"  
`!bigbenclock frequency <1-12>` - Set the frequency of Big Bens chimes  
`!bigbenclock test` - Play the test sound and output debug to the chat  
`!bigbenclock mute <tomorrow/week/specific date (format: YYYY-MM-DD)>` - Mute Big Ben Clock until a specific date  
`!bigbenclock unmute` - Unmute Big Ben Clock  

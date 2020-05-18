require('dotenv').config();
const Discord = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment');
const _ = require('lodash');

const Database = require('../Database');

class BigBenClock {
    /**
     * BigBenClock constructor
     */
    constructor() {
        // Fetch the bot token from the environment
        this.botToken = process.env.BOT_TOKEN;

        // Database instance
        this.database = new Database('./database.sqlite');

        // Create the bot
        this.bot = new Discord.Client();
    }

    /**
     * Initialise the bot
     */
    async init() {
        console.info("Initialise...");

        // Ensure we have a bot token
        if (_.isEmpty(this.botToken)) {
            console.error("Please provide a BOT_TOKEN inside the .env file");
        }

        // Create an event for when the bot is ready
        this.bot.on('ready', () => {
            console.info(`Logged in as ${this.bot.user.tag}!`);

            // Register any commands
            this.registerCommands();

            // Create the scheduler
            this.createScheduler();
        });

        // Catch any errors
        this.bot.on('error', (error) => {
            console.error(error);
        });

        // Initialise the database
        await this.database.init();

        // Migrate the database
        await this.database.migrate();

        // Log the bot in
        await this.bot.login(this.botToken);
    }

    /**
     * Register any commands
     */
    registerCommands() {
        // Catch the message event
        this.bot.on('message', (message) => {
            // Command prefix
            let prefix = "!bigbenclock";

            // Set a voice channel as the "big ben clock" channel
            if (message.content.trim().startsWith(prefix)) {
                // Fetch the channel name fromm the arguments
                let channelName = message.content.replace(`${prefix} `, "").trim();

                // Attempt to find the voice channel
                let voiceChannel = message.guild.channels.find((channel) => {
                    return channel.name === channelName && channel.type === "voice";
                });

                if (voiceChannel) {
                    // Remove any existing channels
                    this.database.run("DELETE FROM servers WHERE server_id = ?", message.guild.id);

                    // Add the channel
                    this.database.run("INSERT INTO servers (server_id, channel_id, created_at)VALUES(?, ?, ?)", message.guild.id, voiceChannel.id, moment().format('Y-m-d H:m:s'));

                    // Notify the channel
                    message.channel.send(`Set '${voiceChannel.name}' as big ben channel`);
                } else {
                    message.channel.send(`Could not find voice channel '${channelName}'`);
                }
            }
        });
    }

    /**
     * Create the scheduler
     */
    createScheduler() {
        // Schedule a job for every hour
        schedule.scheduleJob('0 * * * *', () => {
            // Get the hour
            let hour = moment().format('h');

            // Get all servers
            this.database.all("SELECT * FROM servers").then((servers) => {
                // Loop through the servers
                servers.forEach((server) => {
                    // Attempt to find the guild
                    let guild = this.bot.guilds.find((guild) => guild.id === server.server_id);

                    if (guild) {
                        // Find the channel in the server
                        let channel = guild.channels.find((channel) => channel.id === server.channel_id);

                        if (channel) {
                            // Play the midnight sound
                            channel.join().then((connection) => {
                                const dispatcher = connection.playFile(`./Assets/${hour}.mp3`);

                                // Leave the channel once we're done
                                dispatcher.on("end", () => {
                                    channel.leave();
                                });
                            });
                        }
                    }
                });
            });
        });
    }
}

module.exports = BigBenClock;
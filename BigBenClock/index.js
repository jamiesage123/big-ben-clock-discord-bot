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
                // Fetch the arguments of the command
                const args = message.content.replace(`${prefix} `, "").split(" ");

                // Fetch the command
                const command = args.shift().toLowerCase().replace(prefix, '');

                // Set channel command
                if (command === "set") {
                    // Fetch the channel name
                    let channelName = args.join(' ');

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
                        message.channel.send(`Set '${voiceChannel.name}' as big ben voice channel`);
                    } else {
                        message.channel.send(`Could not find voice channel '${channelName}'`);
                    }
                } else if (command === "frequency") {
                    // Find the servers record
                    this.database.all("SELECT * FROM servers WHERE server_id = ?", message.guild.id).then((response) => {
                        let server = response[0];

                        if (server && !_.isEmpty(server.channel_id)) {
                            let frequency = parseInt(args.join());

                            // Update the frequency
                            if (_.inRange(frequency, 1, 13)) {
                                this.database.run("UPDATE servers SET frequency = ? WHERE server_id = ?", frequency, message.guild.id);

                                // Calculate the times that are now active
                                let times = _.range(1, 13).filter((hour) => hour % frequency === 0);

                                message.channel.send(`Big Ben will now chime at: ${times.join(" O'Clock, ").trim()} O'Clock`);
                            } else {
                                message.channel.send("Frequency must be between 1 and 12 (For example: a frequency of 3 would chime at 3 O'Clock, 6 O'Clock, 9 O'Clock and 12 O'Clock)");
                            }
                        } else {
                            message.channel.send(`You must set a voice channel before setting a frequency (!bigbenclock set <voice channel name>)`);
                        }
                    });
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

            console.info(`Running schedule at ${moment().format('Y-m-d H:m:s')}`);

            // Get all servers
            this.database.all("SELECT * FROM servers").then((servers) => {
                // Loop through the servers
                servers.forEach((server) => {
                    // Attempt to find the guild
                    let guild = this.bot.guilds.find((guild) => guild.id === server.server_id);

                    // Determine if we should play a chime based on the servers frequency setting
                    let playChimes = server.frequency !== null ? hour % server.frequency === 0 : true;

                    if (guild && playChimes) {
                        // Find the channel in the server
                        let channel = guild.channels.find((channel) => channel.id === server.channel_id);

                        console.info(`Attempting to join channel ${channel.id} on server ${guild.id}`);

                        if (channel && channel.members.array().length > 0) {
                            // Play the chime
                            channel.join().then((connection) => {
                                const dispatcher = connection.playFile(`./Assets/${hour}.mp3`);

                                console.info(`Playing ./Assets/${hour}.mp3 in channel ${channel.id}`);

                                // Leave the channel once we're done
                                dispatcher.on("end", () => {
                                    channel.leave();
                                });
                            });
                        } else {
                            if (channel) {
                                console.info(`Channel ${channel.id} does not have any members`);
                            } else {
                                // TODO: Delete record as channel no longer exists
                                console.info(`Channel ${channel.id} does not exist`);
                            }
                        }
                    } else {
                        if (guild) {
                            console.info(`Deferring chime on server ${guild.id}. Frequency: ${server.frequency}`);
                        } else {
                            // TODO: Delete record as server no longer exists
                            console.info(`Server ${server.id} does not exist`);
                        }
                    }
                });
            });
        });
    }
}

module.exports = BigBenClock;
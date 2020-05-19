const sqlite = require('sqlite');
const SqliteDefaults = require('./SqliteDefaults');
const moment = require('moment');

class Database extends SqliteDefaults {
    /**
     * Database constructor
     * @param databaseFile
     */
    constructor(databaseFile) {
        super();

        // Database file location
        this.databaseFile = databaseFile;

        // Database instance
        this.db = null;
    }

    /**
     * Initialise the database
     * @returns {Promise<void>}
     */
    async init() {
        this.db = await sqlite.open(this.databaseFile);
    }

    /**
     * Add a new server + channel
     * @param serverId
     * @param channelId
     * @returns {Promise<Statement>}
     */
    addServer(serverId, channelId) {
        return this.run("INSERT INTO servers (server_id, channel_id, created_at)VALUES(?, ?, ?)", serverId, channelId, moment().format('Y-m-d H:m:s'));
    }

    /**
     * Get all servers
     * @returns {*}
     */
    getAllServers() {
        return this.all("SELECT * FROM servers");
    }

    /**
     * Get a specific server
     * @param serverId
     * @returns {*}
     */
    getServer(serverId) {
        return this.all("SELECT * FROM servers WHERE server_id = ?", serverId);
    }

    /**
     * Set a services chime frequency
     * @param serverId
     * @param frequency
     * @returns {Promise<Statement>}
     */
    setServerFrequency(serverId, frequency) {
        return this.run("UPDATE servers SET frequency = ? WHERE server_id = ?", frequency, serverId);
    }

    /**
     * Delete a server
     * @param serverId
     * @returns {Promise<Statement>}
     */
    deleteServer(serverId) {
        return this.run("DELETE FROM servers WHERE server_id = ?", serverId);
    }
}

module.exports = Database;
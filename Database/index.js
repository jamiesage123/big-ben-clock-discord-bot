const { Client } = require('pg')

class Database {
    /**
     * Database constructor
     * @param connectionString
     */
    constructor(connectionString, options) {
        // connection URI
        this.connectionString = connectionString;

        // Database client options
        this.options = options || {};

        // Database instance
        this.db = null;
    }

    /**
     * Initialise the database
     * @returns {Promise<void>}
     */
    async init() {
        this.db = new Client(Object.assign({ connectionString: this.connectionString }, this.options));

        // Attempt to connect
        await this.db.connect();
    }

    /**
     * Add a new server + channel
     * @param serverId
     * @param channelId
     * @returns {Promise<Statement>}
     */
    addServer(serverId, channelId) {
        return this.db.query("INSERT INTO servers (server_id, channel_id)VALUES($1, $2)", [serverId, channelId]);
    }

    /**
     * Get all servers
     * @returns {*}
     */
    getAllServers() {
        return this.db.query("SELECT * FROM servers");
    }

    /**
     * Get a specific server
     * @param serverId
     * @returns {*}
     */
    getServer(serverId) {
        return this.db.query("SELECT * FROM servers WHERE server_id = $1", [serverId]);
    }

    /**
     * Set a services chime frequency
     * @param serverId
     * @param frequency
     * @returns {Promise<Statement>}
     */
    setServerFrequency(serverId, frequency) {
        return this.db.query("UPDATE servers SET frequency = $1 WHERE server_id = $2", [frequency, serverId]);
    }

    /**
     * Set the mute until date
     * @param serverId
     * @param date
     * @returns {Promise<Statement>}
     */
    setMuteUntil(serverId, date) {
        return this.db.query("UPDATE servers SET mute_until = $1 WHERE server_id = $2", [date, serverId]);
    }

    /**
     * Delete a server
     * @param serverId
     * @returns {Promise<Statement>}
     */
    deleteServer(serverId) {
        return this.db.query("DELETE FROM servers WHERE server_id = $1", [serverId]);
    }
}

module.exports = Database;
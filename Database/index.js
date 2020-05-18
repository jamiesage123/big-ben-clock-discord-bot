const sqlite = require('sqlite');
const SqliteDefaults = require('./SqliteDefaults');

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
}

module.exports = Database;
class SqliteDefaults {
    /**
     * Run a query
     * @returns {Promise<Statement>}
     * @param params
     */
    run(...params) {
        return this.db.run(...params);
    }

    /**
     * Run a all query
     * @returns {*}
     * @param params
     */
    all(...params) {
        return this.db.all(...params);
    }

    /**
     * Run a get query
     * @returns {*}
     * @param params
     */
    get(...params) {
        return this.db.get(...params);
    }

    /**
     * Migrate the database
     * @returns {Promise<Database>}
     */
    migrate() {
        return this.db.migrate();
    }
}

module.exports = SqliteDefaults;
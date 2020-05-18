const BigBenClock = require('./BigBenClock');

// Create the Big Ben Clock instance
const bigBenClock = new BigBenClock();

// Initialise the bot
bigBenClock.init().catch(console.error);
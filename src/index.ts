import tmi from 'tmi.js';
import dotenv from 'dotenv';
import testBigFollows from './helpers/testBigFollows';
dotenv.config();

const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_KEY
	},
	channels: [ process.env.CHANNEL ?? '' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

    // check for big follows + some variants. this shouldn't catch most memes.
    if (tags.username) {
        testBigFollows(client, channel, tags.username, message, message.indexOf('http') > -1 ? 15 : 25);
    }
});
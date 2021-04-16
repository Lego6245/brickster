import tmi from 'tmi.js';
import dotenv from 'dotenv';
import testBigFollows from './helpers/testBigFollows';
import Database from 'better-sqlite3';
import checkForPyramid from './helpers/checkForPyramid';
import loadCommandsFromDb from './helpers/loadCommandsFromDb';
import hasPermission from './helpers/hasPermission';
import { PermissionLevel } from './commands/Command';

// Initial setup
dotenv.config();
let dbInstance;
const db = Database(process.env.DB_LOCATION ?? ":memory:");
db.pragma('journal_mode = wal');
const createStatement = db.prepare(`
	CREATE TABLE IF NOT EXISTS commands (
		command TEXT PRIMARY KEY,
		is_mod INTEGER DEFAULT 0,
		response TEXT NOT NULL
	);`);
createStatement.run();

const createCommandStatement = db.prepare(`
	INSERT INTO commands VALUES (@command, @is_mod, @response)
`);

const deleteCommandStatement = db.prepare(`
	DELETE FROM commands WHERE command = ?
`)

// Twitch Bot Setup
const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_KEY
	},
	channels: [ process.env.CHANNEL ?? '' ]
});

let commands = loadCommandsFromDb(db);

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

    // check for big follows + some variants. this shouldn't catch most memes.
    if (tags.username) {
        testBigFollows(client, channel, tags.username, message, message.indexOf('http') > -1 ? 15 : 25);

		// anti pyramid tech
		checkForPyramid(client, channel, tags.username, message);
    }

	const split = message.trim().toLowerCase().split(' ');
	const testCommand = split[0];

	switch(testCommand) {
		case '!hello':
			client.say(channel, `@${tags.username}, heya!`);
			break;
		case '!listcommands':
			client.say(channel, `there are ${commands.length} commands`);
			break;
		case '!addcommand':
			if (tags.mod || tags.badges?.broadcaster) {
				if (split.length < 3) {

				}
				const potentialModFlag = parseInt(split[2]);
				const isModFlagProvided = (potentialModFlag === 0 || potentialModFlag === 1);
				const modFlag =  isModFlagProvided ? potentialModFlag : 0
				const response = split.slice(isModFlagProvided ? 3 : 2).join(' ');
				try {
					createCommandStatement.run({
						command: split[1],
						is_mod: modFlag,
						response: response
					})
				} catch (e) {
					client.say(channel, `error executing command, response ${e}`);
					return;
				};
	
				client.say(channel, `added command ${split[1]} with permissionlevel ${modFlag} message "${response}"`);
				commands = loadCommandsFromDb(db);
			} else {
				client.say(channel, "naughty naughty");
			}
			break;
		case '!deletecommand':
			if (hasPermission(PermissionLevel.Mods, tags)) {
				let changes: Database.RunResult;
				try {
					changes = deleteCommandStatement.run(split[1])
				} catch (e) {
					client.say(channel, `error executing command, response ${e}`);
					return;
				};
				if (changes.changes > 0) {
					client.say(channel, `removed command ${split[1]}`);
				} else {
					client.say(channel, "no such command");
				}
			} else {
				client.say(channel, "naughty naughty");
			}
			break;
		default:
			console.log(commands);
			const foundCommand = commands.find((command => command.trigger === testCommand));
			console.log(foundCommand);
			if (foundCommand && hasPermission(foundCommand.permissionLevel, tags)) {
				client.say(channel, foundCommand.response)
			}
			break;
	}
});
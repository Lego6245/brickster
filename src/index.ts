import tmi from "tmi.js";
import dotenv from "dotenv";
import testBigFollows from "./helpers/testBigFollows";
import Database from "better-sqlite3";
import checkForPyramid from "./helpers/checkForPyramid";
import hasPermission from "./helpers/hasPermission";
import { Command, PermissionLevel } from "./commands/types/Command";
import loadCommands from "./helpers/loadCommands";

// Initial setup
dotenv.config();

const db = Database(process.env.DB_LOCATION ?? ":memory:");
db.pragma("journal_mode = wal");
const createStatement = db.prepare(`
	CREATE TABLE IF NOT EXISTS commands (
		command TEXT PRIMARY KEY,
		is_mod INTEGER DEFAULT 0,
		response TEXT NOT NULL
	);`);
createStatement.run();

const deleteCommandStatement = db.prepare(`
	DELETE FROM commands WHERE command = ?
`);

// Twitch Bot Setup
const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_KEY,
  },
  channels: [process.env.CHANNEL ?? ""],
});

let commands: Command[] = loadCommands(db);

client.connect();

client.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  // check for big follows + some variants. this shouldn't catch most memes.
  if (tags.username) {
    testBigFollows(
      client,
      channel,
      tags.username,
      message,
      message.indexOf("http") > -1 ? 15 : 25
    );

    // anti pyramid tech
    checkForPyramid(client, channel, message);
  }

  // command handling
  const split = message.trim().toLowerCase().split(" ");
  const testCommand = split[0];
  const foundCommand = commands.find(
    (command) => command.trigger === testCommand
  );
  if (foundCommand && hasPermission(foundCommand.permissionLevel, tags)) {
    if (foundCommand.type == "basic") {
      client.say(channel, foundCommand.textResponse);
    } else {
      foundCommand.responseFn({
        client,
        channel,
        db,
        commandList: commands,
        tags,
        splitMessage: split,
      });
      if (foundCommand.reloadCommands) {
        commands = loadCommands(db);
      }
    }
  }
});

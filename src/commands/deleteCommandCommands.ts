import Database, { Statement } from "better-sqlite3";
import {
    AdvancedCommand,
    CommandContext,
    PermissionLevel,
} from "./types/Command";

let deleteCommandStatement: Statement;

const deleteCommandCommand: AdvancedCommand = {
    trigger: "!deletecommand",
    aliases: ["!delcom"],
    permissionLevel: PermissionLevel.All,
    reloadCommands: true,
    type: "advanced",
    responseFn: (context: CommandContext) => {
        const { client, channel, splitMessage, db } = context;
        if (!deleteCommandStatement) {
            deleteCommandStatement = db.prepare(`
        DELETE FROM commands WHERE command = ?
      `);
        }
        if (splitMessage.length < 2) {
            client.say(channel, "You're missing some arguments.");
        }
        const commandToDelete = splitMessage[1].toLowerCase();
        let changes: Database.RunResult;
        try {
            changes = deleteCommandStatement.run(commandToDelete);
        } catch (e) {
            client.say(channel, `error executing command, response ${e}`);
            return;
        }
        if (changes.changes > 0) {
            client.say(channel, `removed command ${commandToDelete}`);
        } else {
            client.say(channel, "no such command");
        }
    },
};

export default deleteCommandCommand;

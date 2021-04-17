import { Statement, RunResult } from "better-sqlite3";
import {
  AdvancedCommand,
  CommandContext,
  PermissionLevel,
} from "./types/Command";

let updateCommandStatement: Statement;

const updateCommandCommand: AdvancedCommand = {
  trigger: "!updatecommand",
  permissionLevel: PermissionLevel.All,
  reloadCommands: true,
  type: "advanced",
  responseFn: (context: CommandContext) => {
    const { client, channel, splitMessage, db } = context;
    if (!updateCommandStatement) {
      updateCommandStatement = db.prepare(`
            UPDATE commands SET (is_mod, response) = (@is_mod, @response)
            WHERE command = @command
            `);
    }
    if (splitMessage.length < 3) {
      client.say(channel, "You're missing some arguments.");
    }
    const permissionValue = parseInt(splitMessage[2]);
    const isPermissionFlagProvided = permissionValue in PermissionLevel;
    const permissionFlag = isPermissionFlagProvided
      ? isPermissionFlagProvided
      : 0;
    const response = splitMessage
      .slice(isPermissionFlagProvided ? 3 : 2)
      .join(" ");
    let changes: RunResult;
    try {
      changes = updateCommandStatement.run({
        command: splitMessage[1],
        is_mod: permissionFlag,
        response: response,
      });
    } catch (e) {
      client.say(channel, `Error executing command, response ${e}`);
      return;
    }
    if (changes.changes > 0) {
      client.say(
        channel,
        `Updated command ${splitMessage[1]} with permissionlevel ${permissionFlag} and message "${response}"`
      );
    } else {
      client.say(channel, "No such command");
    }
  },
};

export default updateCommandCommand;

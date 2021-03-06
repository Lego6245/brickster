import { Statement } from "better-sqlite3";
import {
    AdvancedCommand,
    CommandContext,
    PermissionLevel,
} from "./types/Command";

let createCommandStatement: Statement;

const addCommandCommand: AdvancedCommand = {
    trigger: "!addcommand",
    aliases: ["!addcom"],
    permissionLevel: PermissionLevel.All,
    reloadCommands: true,
    type: "advanced",
    responseFn: (context: CommandContext) => {
        const { client, channel, splitMessage, db } = context;
        if (!createCommandStatement) {
            createCommandStatement = db.prepare(`
            INSERT INTO commands VALUES (@command, @is_mod, @response)
            `);
        }
        if (splitMessage.length < 3) {
            client.say(channel, "You're missing some arguments.");
        }
        const commandToAdd = splitMessage[1].toLowerCase();
        const permissionValue = parseInt(splitMessage[2]);
        const isPermissionFlagProvided = permissionValue in PermissionLevel;
        const permissionFlag = isPermissionFlagProvided
            ? isPermissionFlagProvided
            : 0;
        const response = splitMessage
            .slice(isPermissionFlagProvided ? 3 : 2)
            .join(" ");
        try {
            createCommandStatement.run({
                command: commandToAdd,
                is_mod: permissionFlag,
                response: response,
            });
        } catch (e) {
            client.say(channel, `Error executing command, response ${e}`);
            return;
        }
        client.say(
            channel,
            `Added command ${commandToAdd} with permissionlevel ${permissionFlag} and message "${response}"`
        );
    },
};

export default addCommandCommand;

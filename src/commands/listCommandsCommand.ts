import { Client } from "tmi.js";
import {
    AdvancedCommand,
    CommandContext,
    PermissionLevel,
} from "./types/Command";

const listCommandCommands: AdvancedCommand = {
    trigger: "!listcommands",
    permissionLevel: PermissionLevel.All,
    type: "advanced",
    responseFn: (context: CommandContext) => {
        const { client, channel, commandList } = context;
        const commandString = commandList
            .slice(1)
            .reduce(
                (prev, cur) => prev + ", " + cur.trigger,
                commandList[0].trigger
            );
        const totalStatement = `Currently active commands: ${commandString}`;
        client.say(channel, `Currently active commands: ${commandString}`);
    },
};

export default listCommandCommands;

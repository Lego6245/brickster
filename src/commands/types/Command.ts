import { Client, ChatUserstate } from "tmi.js";
import { Database } from "better-sqlite3";

export enum PermissionLevel {
    All,
    Mods,
    Broadcaster,
}

export interface CommandContext {
    client: Client;
    channel: string;
    tags: ChatUserstate;
    db: Database;
    commandList: Command[];
    splitMessage: string[];
}

export interface CommandBase {
    trigger: string;
    permissionLevel: PermissionLevel;
}

export interface BasicCommand extends CommandBase {
    textResponse: string;
    type: "basic";
}

export interface AdvancedCommand extends CommandBase {
    responseFn: (context: CommandContext) => void;
    type: "advanced";
    reloadCommands?: boolean;
}

export type Command = AdvancedCommand | BasicCommand;

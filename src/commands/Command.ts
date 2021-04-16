export enum PermissionLevel {
    All,
    Mods,
    Broadcaster,
}

export interface CommandBase {
    trigger: string,
    permissionLevel: PermissionLevel,
}

export interface BasicCommand extends CommandBase {
    response: string,
}

export interface AdvancedCommand extends CommandBase {
    response: () => void;
}

export type Command = AdvancedCommand | BasicCommand;
import { ChatUserstate } from "tmi.js";
import { PermissionLevel } from "../commands/types/Command";

export default function hasPermission(
    permissionLevel: PermissionLevel,
    tags: ChatUserstate
): boolean {
    switch (permissionLevel) {
        case PermissionLevel.All:
            return true;
        case PermissionLevel.Mods:
            return !!(tags.mod || tags.badges?.broadcaster);
        case PermissionLevel.Broadcaster:
            return !!tags.badges?.broadcaster;
    }
}

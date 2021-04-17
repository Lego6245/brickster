import { Database } from "better-sqlite3";
import addCommandCommand from "../commands/addCommandCommand";
import deleteCommandCommand from "../commands/deleteCommandCommands";
import helloCommand from "../commands/helloCommand";
import listCommandCommands from "../commands/listCommandsCommand";
import { AdvancedCommand, BasicCommand, Command } from "../commands/types/Command";
import { CommandRow } from "../types/CommandRow";

export default function loadCommands(db: Database): Command[] {
    return [...loadCommandsFromDb(db), ...loadAdvancedCommands()]
}

function loadCommandsFromDb(db: Database): BasicCommand[] {
    const loadCommandsStatement = db.prepare(`
	    SELECT * FROM commands
    `);
    const processedCommands: BasicCommand[] = [];
    const loadedCommands = loadCommandsStatement.all() as CommandRow[];
    loadedCommands.forEach((row => {
        processedCommands.push({
            trigger: row.command,
            permissionLevel: row.is_mod,
            textResponse: row.response,
            type: "basic",
        });
    }));
    return processedCommands;
};

function loadAdvancedCommands(): AdvancedCommand[] {
    return [
        addCommandCommand,
        deleteCommandCommand,
        helloCommand,
        listCommandCommands,
    ]
}
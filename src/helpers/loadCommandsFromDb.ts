import { Database } from 'better-sqlite3';
import { BasicCommand } from '../commands/Command';
import { CommandRow } from '../types/CommandRow';

export default function loadCommandsFromDb(db: Database): BasicCommand[] {
    const loadCommandsStatement = db.prepare(`
	    SELECT * FROM commands
    `);
    const processedCommands: BasicCommand[] = [];
    const loadedCommands = loadCommandsStatement.all() as CommandRow[];
    loadedCommands.forEach((row => {
        console.log(row);
        processedCommands.push({
            trigger: row.command,
            permissionLevel: row.is_mod,
            response: row.response,
        });
    }));
    return processedCommands;
}
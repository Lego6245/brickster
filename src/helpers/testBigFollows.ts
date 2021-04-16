import { Client, ChatUserstate } from 'tmi.js';
import { distance } from "fastest-levenshtein";
import normalizeString from "./normalizeString";

export default function testBigFollows(client: Client, channel: string, username: string, message: string, strength?: number) {
    const normalizedMessage = normalizeString(message);
    let sus_score = 0;
    if (normalizedMessage.indexOf("bigfollow") > -1) {
        sus_score += 5;
    } if (normalizedMessage.indexOf("wannabecome") > -1) {
        sus_score += 5;
    } if (normalizedMessage.indexOf("followers") > -1 && normalizedMessage.indexOf("prime") > -1 && normalizedMessage.indexOf("viewers") > -1) {
        sus_score += 5;
    }

    const dist = distance(normalizedMessage, 'wannabecomefamousbuyfollowersprimesandviewersonhttpsbigfollowscom')

    if (dist < 20) {
        sus_score += 20 - dist;
    }

    if (sus_score >= (strength ?? 15)) {
        console.log(sus_score);
        client.timeout(channel, username, 1, "probably a bigfollows").catch((reason) => {
            // we don't care if this fails
        });
    }
}
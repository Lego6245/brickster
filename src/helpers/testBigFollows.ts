import { Client } from "tmi.js";
import { distance } from "fastest-levenshtein";
import normalizeString from "./normalizeString";

export default function testBigFollows(
    client: Client,
    channel: string,
    username: string,
    message: string,
    strength?: number
) {
    const normalizedMessage = normalizeString(message);
    // don't think it don't say it don't think it don't say it
    let sus_score = 0;
    if (normalizedMessage.indexOf("bigfollow") > -1) {
        sus_score += 5;
    }
    if (normalizedMessage.indexOf("wannabecome") > -1) {
        sus_score += 5;
    }
    if (normalizedMessage.indexOf("follower") > -1) {
        sus_score += 2;
    }
    if (normalizedMessage.indexOf("prime") > -1) {
        sus_score += 2;
    }
    if (normalizedMessage.indexOf("viewer") > -1) {
        sus_score += 2;
    }
    if (normalizedMessage.indexOf("clckru") > -1) {
        sus_score += 5;
    }

    const dist = distance(
        normalizedMessage,
        "wannabecomefamousbuyfollowersprimesandviewersonhttpsbigfollowscom"
    );

    if (dist < 20) {
        sus_score += 20 - dist;
    }

    if (sus_score >= (strength ?? 15)) {
        client
            .timeout(channel, username, 1, "probably a bigfollows")
            .catch((reason) => {
                // we don't care if this fails
            });
    }
}

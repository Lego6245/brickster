import { Client } from "tmi.js";

enum PyramidState {
    None,
    Increasing,
    Decreasing,
}

let potentialToken: string | undefined;
let previousLength: number = 0;
let pyramidState: PyramidState;

export default function checkForPyramid(
    client: Client,
    channel: string,
    message: string
) {
    const messageBlocks = message
        .trim()
        .split(" ")
        .filter((val) => !!val);
    if (potentialToken && previousLength > 0) {
        // Pyramid's start with a unit
        const matchingTokens = messageBlocks.reduce(
            (prev, cur) => (cur === potentialToken ? prev + 1 : prev),
            0
        );
        if (matchingTokens == messageBlocks.length) {
            if (previousLength == messageBlocks.length - 1) {
                pyramidState = PyramidState.Increasing;
                previousLength = messageBlocks.length;
            } else if (previousLength == messageBlocks.length + 1) {
                // this is where the magic happens
                if (messageBlocks.length == 2 && PyramidState.Decreasing) {
                    if (potentialToken == "legoW") {
                        client.say(channel, "EeveeW");
                    } else {
                        client.say(channel, "legoW");
                    }
                    resetPyramid();
                } else {
                    pyramidState = PyramidState.Decreasing;
                    previousLength = messageBlocks.length;
                }
            } else {
                resetPyramid();
            }
        } else {
            startPyramidTracking(messageBlocks);
        }
    } else {
        startPyramidTracking(messageBlocks);
    }
}

function startPyramidTracking(messageBlocks: string[]) {
    if (messageBlocks.length == 1) {
        potentialToken = messageBlocks[0];
        previousLength = 1;
        pyramidState = PyramidState.Increasing;
    } else {
        resetPyramid();
    }
}

function resetPyramid() {
    pyramidState = PyramidState.None;
    previousLength = 0;
    potentialToken = undefined;
}

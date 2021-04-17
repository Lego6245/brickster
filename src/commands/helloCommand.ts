import {
  AdvancedCommand,
  CommandContext,
  PermissionLevel,
} from "./types/Command";

const helloCommand: AdvancedCommand = {
  trigger: "!hello",
  permissionLevel: PermissionLevel.All,
  type: "advanced",
  responseFn: (context: CommandContext) => {
    const { client, channel, tags } = context;
    client.say(channel, `@${tags.username}, heya!`);
  },
};

export default helloCommand;

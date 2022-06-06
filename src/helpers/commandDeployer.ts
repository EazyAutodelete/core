import Command from "../structures/Command";
import { ApplicationCommandOptionData, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async function (
  commands: Collection<string, Command>,
  applicationId: string,
  token: string
): Promise<void> {
  const commandsArray: {
    name: string;
    description: string;
    options: ApplicationCommandOptionData[];
  }[] = [];
  commands.forEach(cmd => {
    commandsArray.push(cmd.data);
  });

  const rest = new REST({ version: "9" }).setToken(token);

  console.log("Started refreshing application (/) commands.");

  await rest
    .put(Routes.applicationGuildCommands(applicationId, "923510421435068416"), {
      body: commandsArray,
    })
    .catch(console.error);

  console.log("Successfully reloaded application (/) commands.");
}

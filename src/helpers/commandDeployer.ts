import Command from "../structures/Command";
import { ApplicationCommandData, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async function (
  commands: Collection<string, Command>,
  applicationId: string,
  token: string
): Promise<void> {
  const commandsArray: ApplicationCommandData[] = [];
  commands.forEach(cmd => {
    commandsArray.push(cmd.data);
  });

  const rest = new REST({ version: "9" }).setToken(token);

  console.log("Started refreshing application (/) commands.");

  await rest
    .put(Routes.applicationCommands(applicationId), {
      body: commandsArray,
    })
    .catch(console.error);

  console.log("Successfully reloaded application (/) commands.");
}

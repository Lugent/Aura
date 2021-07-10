// Dependencies
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");

// Create error logs folder
const fs = require("fs");
if (!fs.existsSync(process.cwd() + "/error-logs")) {
	fs.mkdirSync(process.cwd() + "/error-logs");
}

/**
 * @param {Discord.Client} client
 * @param {Discord.CommandInteraction} interaction
 */
async function commandExecutor(client, interaction) {
    if (!interaction.isCommand()) { return; }

	let slash_command = client.slash_commands.get(interaction.commandName);
    if (!slash_command) { return interaction.defer(); }
	
	// Flag check; if works with the bot's owner
    if ((slash_command.flags & constants.cmdFlags.ownerOnly) && (message.author.id !== process.env.OWNER_ID)) {
        let embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "only_owner", [client.users.cache.get(process.env.OWNER_ID).tag]));
        return interaction.reply({embeds: [embed]});
    }

    // Execute slash_command, throw error if fails
    slash_command.execute(client, interaction).catch(async (error) => {
        console.error("Slash command failure '" + slash_command.name + "'" + "\n", error);
		
		// Get current date and time
        let actualDate = new Date();
        let actualYear = actualDate.getFullYear();
        let actualMonth = actualDate.getMonth();
        let actualDay = actualDate.getDate();
        let actualHour = actualDate.getHours();
        let actualMinutes = actualDate.getMinutes();
        let actualSeconds = actualDate.getSeconds();
        let actualFullTimeDate = actualYear + "-" + actualMonth + "-" + actualDay + "_" + actualHour + "-" + actualMinutes + "-" + actualSeconds;

		// Set text content
        let textFileContent = [
            "[" + actualFullTimeDate + "]",
            interaction.user.tag + " used slash_command, but it failed!",
            ">>> " + slash_command.name + " " + interaction.options.join(" "),
            "",
            "Stack trace: " + "\n" + error.stack
        ];

		// Try to write it, save it to local disk and send the file as slash_command failure error.
		// Otherwise just throw the error as a simple stack trace.
        try {
            let textFileWrite = fs.createWriteStream(process.cwd() + "/error-logs/command_error_" + actualFullTimeDate + ".txt");
            await textFileWrite.write(textFileContent.join("\n"));
            await textFileWrite.end();
        }
        finally {
            return interaction.reply({
				content: ":no_entry: " + client.functions.getTranslation(client, interaction.user, interaction.guild, "events/command_executor", "command_error"),
				files: [
					new Discord.MessageAttachment(Buffer.from(error.stack), "command_error_" + actualFullTimeDate + ".txt")
				]
			}, {ephemeral: true});
        }
        return interaction.reply(":no_entry: " + client.functions.getTranslation(client, interaction.user, interaction.guild, "events/command_executor", "command_error") + "\n" + "```" + error.stack + "```", {ephemeral: true});
    });
}
module.exports = commandExecutor;
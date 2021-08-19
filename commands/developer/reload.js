const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");
module.exports = {
	id: "reload",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,
	
	command_name: "reload",
	command_description: "Actualiza todos los comandos o un comando en especifico.",
    command_usage: "[id]",
    command_cooldown: 0,
    command_flags: constants.cmdFlags.ownerOnly,
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async command_execute(client, message, args, prefix) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":warning: " + "Especifica un comando o usa `" + prefix + "reload all` para todos los comandos.");
			embed.setColor([255, 255, 0]);
            return message.channel.send({embeds: [embed]});
		}

		
		switch (args[0]) {
			case "all": {
				let command_loader = require(process.cwd() + "/functions/command_loader.js");
				await command_loader(client, true);
				await client.registerApplications(client);

				let embed = new Discord.MessageEmbed();
				embed.setDescription(":white_check_mark: " + "Comandos actualizados.");
				embed.setColor([0, 255, 0]);
				return message.channel.send({embeds: [embed]});
			}
		}

        let command_id = args[0].toLowerCase();
        let command = client.commands.get(command_id);
        if (!command) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "El comando no existe o el alias no es reconocible a un comando.");
			embed.setColor([255, 0, 0]);
            return message.channel.send({embeds: [embed]});
		}

		let command_path = process.cwd() + "/commands/" + command.path + "/" + command.id + ".js";
        delete require.cache[require.resolve(command_path)];
        try {
	        let newCommand = require(command_path);
            client.commands.set(newCommand.name, newCommand);

			let embed = new Discord.MessageEmbed();
            embed.setDescription(":white_check_mark: " + "Comando **" + command.id + "** actualizado.");
			embed.setColor([0, 255, 0]);
            return message.channel.send({embeds: [embed]});
        }
		catch (error) {
			throw error;
        }
	},
}; 
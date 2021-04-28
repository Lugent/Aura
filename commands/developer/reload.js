const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");
module.exports = {
	name: "reload",
	path: path.basename(__dirname),
	description: "Actualiza todos los comandos o un comando en especifico.",
    usage: "[comando]",
    cooldown: 0,
    flags: constants.cmdFlags.ownerOnly,
    
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":warning: " + "Especifica un comando o usa `" + prefix + "reload all` para todos los comandos.");
			embed.setColor([255, 255, 0]);
            return message.channel.send(embed);
		}

        if (args[0] === "all") {
			let command_loader = require(process.cwd() + "/functions/general/command_loader.js");
			await command_loader(client, true);

			let embed = new Discord.MessageEmbed();
            embed.setDescription(":white_check_mark: " + "Comandos actualizados.");
			embed.setColor([0, 255, 0]);
            return message.channel.send(embed);
        }

        let command_name = args[0].toLowerCase();
        let command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
        if (!command) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "El comando no existe o el alias no es reconocible a un comando.");
			embed.setColor([255, 0, 0]);
            return message.channel.send(embed);
		}

		let command_path = process.cwd() + "/commands/" + command.path + "/" + command.name + ".js";
        delete require.cache[require.resolve(command_path)];
        try {
	        let newCommand = require(command_path);
            client.commands.set(newCommand.name, newCommand);

			let embed = new Discord.MessageEmbed();
            embed.setDescription(":white_check_mark: " + "Comando **" + command.name + "** actualizado.");
			embed.setColor([0, 255, 0]);
            return message.channel.send(embed);
        }
		catch (error) {
			console.error("Re-loading '" + command.name + "' command failed:" + "\n", error);

            let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "Falla durante el proceso");
            embed.addField(error.name, error.message || "Undefined", false);
			embed.setColor([255, 0, 0]);
            return message.channel.send(embed);
        }
	},
}; 
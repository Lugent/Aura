const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");
module.exports = {
	id: "reload",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,
	
	command_name: "reload",
	//command_description: "",
    //command_usage: "[id]",
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
            embed.setDescription("Specify a command.\n\nYou can also use:\n`-all` for everything.\n`-apps` to only applications.\n`-cmds` to only commands.");
			embed.setColor([47, 49, 54]);
            return message.channel.send({embeds: [embed]});
		}
		
		switch (args[0]) {
			case "-all": {
				let command_loader = require(process.cwd() + "/functions/command_loader.js");
				await command_loader(client, true);
				await client.registerApplications(client);

				let embed = new Discord.MessageEmbed();
				embed.setDescription("Commands and applications reloaded.");
				embed.setColor([47, 49, 54]);
				return message.channel.send({embeds: [embed]});
			}
			
			case "-cmds": {
				let command_loader = require(process.cwd() + "/functions/command_loader.js");
				await command_loader(client, true);

				let embed = new Discord.MessageEmbed();
				embed.setDescription("Commands reloaded.");
				embed.setColor([47, 49, 54]);
				return message.channel.send({embeds: [embed]});
			}
			
			case "-apps": {
				await client.registerApplications(client);

				let embed = new Discord.MessageEmbed();
				embed.setDescription("Applications reloaded.");
				embed.setColor([47, 49, 54]);
				return message.channel.send({embeds: [embed]});
			}
		}

        let command_id = args[0].toLowerCase();
        let command = client.commands.get(command_id);
        if (!command) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription("That command don't exists.");
			embed.setColor([47, 49, 54]);
            return message.channel.send({embeds: [embed]});
		}

		let command_path = process.cwd() + "/commands/" + command.path + "/" + command.id + ".js";
        delete require.cache[require.resolve(command_path)];
        try {
	        let newCommand = require(command_path);
            client.commands.set(newCommand.id, newCommand);

			let embed = new Discord.MessageEmbed();
            embed.setDescription("Command `" + command.id + "` reloaded.");
			embed.setColor([47, 49, 54]);
            return message.channel.send({embeds: [embed]});
        }
		catch (error) {
			throw error;
        }
	},
}; 
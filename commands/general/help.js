const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

module.exports = {
	name: "help",
	path: path.basename(__dirname),
	description: "help.description",
	aliases: ["cmds"],
	usage: "help.usage",
	cooldown: 5,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
        const commands = client.commands;
		
		let hidden = false;
		for (let argument_index = 0; argument_index < args.length; argument_index++) {
			var argument = args[argument_index];
			if (argument === "/h") {
				if (message.author.id === client.config.owner) {
					hidden = true;
					args.splice(args.findIndex(index => index === "/h"));
				}
			}
		}
		
		let categories = new Discord.Collection();
		let command_list = commands.array();
		for (let command_index = 0; command_index < command_list.length; command_index++) {
			let command = command_list[command_index];
			let category = categories.get(command.path);
			if (!category) {
				categories.set(command.path, {name: "category." + command.path, commands: new Discord.Collection()});
				category = categories.get(command.path);
			}
			category.commands.set(command.name, command);
		}
		
        if (!args[0]) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "list.title"));
			
			let category_list = categories.array();
			for (let category_index = 0; category_index < category_list.length; category_index++) {
				let category_name = category_list[category_index].name;
				let command_names = "";
				let command_list = category_list[category_index].commands.array();
				for (let command_index = 0; command_index < command_list.length; command_index++) {
					let command = command_list[command_index];
					let command_usage = command.usage ? command.usage : "";
					if (((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.autorizedOnly) || (command.flags & constants.cmdFlags.noHelp)) && !hidden) { continue; }
					command_names += command.name + " " + client.functions.getTranslation(client, message.author, message.guild, "commands_help", command_usage) + "\n";
				}

				if (command_names.length) {
					embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_help", category_name), command_names);
				}
			}
			
            embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "list.footer", [prefix]));
			
			if (message.channel.type !== "dm") {
				message.author.send(embed).then(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "success_list"));
				}).catch((error) => {
					console.log(error);
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "failure_list"));
				});
			}
			else {
				return message.channel.send(embed);
			}
        }
		else {
			var name = args[0].toLowerCase();
			var command = commands.get(name) || commands.find((c) => { return (c.aliases && c.aliases.includes(name)); });
			if ((!command) || ((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.autorizedOnly) || (command.flags & constants.cmdFlags.noHelp)) && (!hidden)) {
				return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "dont_exists"));
			}

			let embed = new Discord.MessageEmbed();
			embed.setTitle(prefix + command.name + " " + client.functions.getTranslation(client, message.author, message.guild, ((command.usage && command.usage) || "")));
			if (command.description) { embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_help", command.description)); }
			if (command.aliases) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "aliases"), command.aliases.join(", "), false); }
			if (command.cooldown) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "cooldown"), client.functions.getTranslation(client, message.author, message.guild, "commands_help", "cooldown.field", [(command.cooldown || 0)]), false); } // (command.cooldown || 0)
			if (message.channel.type !== "dm") {
				message.author.send(embed).then(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "success_single"));
				}).catch(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands_help", "failure_single"));
				});
			}
			else {
				return message.channel.send(embed);
			}
		}
	},
};
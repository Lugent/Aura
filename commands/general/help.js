const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

module.exports = {
	id: "help",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand|constants.cmdTypes.selectMenuInteraction,
	
	select_id: "help_category",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.SelectMenuInteraction} interaction
	 */
	async select_execute(client, interaction) {
		let category = interaction.values[0];
		
		let commands = "";
		let command_list = client.commands.array();
		for (let command_index = 0; command_index < command_list.length; command_index++) {
			let command = command_list[command_index];
			if (command.path == category) {
				commands += command.name + " " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/help", command.usage ? command.usage : "") + "\n" + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/help", command.description ? command.description : "") + "\n\n";
			}
		}
		
		let embed = new Discord.MessageEmbed();
		embed.setColor([47, 49, 54]);
		embed.setTitle(client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/help", "embed.category.title", [client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/help", "category." + category)]));
		embed.setDescription(commands);
		embed.setFooter(client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/help", "embed.category.footer"));
		return interaction.update({embeds: [embed]});
	},
	
	command_name: "help",
	command_description: "help.description",
	command_aliases: ["cmds"],
	command_usage: "help.usage",
	command_cooldown: 5,
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async command_execute(client, message, args, prefix) {
		let hidden = false;
		for (let argument_index = 0; argument_index < args.length; argument_index++) {
			var argument = args[argument_index];
			if (argument === "/h") {
				if (message.author.id === process.env.OWNER_ID) {
					hidden = true;
					args.splice(args.findIndex(index => index === "/h"));
				}
			}
		}
		
		let categories = new Discord.Collection();
		let command_list = client.commands.array();
		for (let command_index = 0; command_index < command_list.length; command_index++) {
			let command = command_list[command_index];
			let category = categories.get(command.path);
			if (!category) {
				if (((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.noHelp)) && !hidden) { continue; }
				//categories.set(command.path, {name: "category." + command.path, commands: new Discord.Collection()});
				categories.set(command.path, {id: command.path, name: "category." + command.path});
				//category = categories.get(command.path);
			}
			//category.commands.set(command.name, command);
		}
		
		let category_string = "";
		let category_list = categories.array();
		let embed = new Discord.MessageEmbed();
		let select = new Discord.MessageSelectMenu();
		embed.setColor([47, 49, 54]);
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "embed.title"));
		select.setCustomId("help_category");
		for (let option_index = 0; option_index < category_list.length; option_index++) {
			category_string += client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", category_list[option_index].name) + "\n";
			select.addOptions({label: client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", category_list[option_index].name), value: category_list[option_index].id});
		}
		embed.setDescription(category_string);
		embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "embed.footer"));
		select.setPlaceholder(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "select_menu"));
		return message.reply({embeds: [embed], components: [{type: "ACTION_ROW", components: [select]}]});
		
        /*if (!args[0]) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "list.title"));
			
			let category_list = categories.array();
			for (let category_index = 0; category_index < category_list.length; category_index++) {
				let category_name = category_list[category_index].name;
				let command_names = "";
				let command_list = category_list[category_index].commands.array();
				for (let command_index = 0; command_index < command_list.length; command_index++) {
					let command = command_list[command_index];
					let command_usage = command.usage ? command.usage : "";
					if (((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.noHelp)) && !hidden) { continue; }
					command_names += command.name + " " + client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", command_usage) + "\n";
				}

				if (command_names.length) {
					embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", category_name), command_names);
				}
			}
			
            embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "list.footer", [prefix]));
			message.reply({embeds: [embed]}).catch((error) => { console.log(error); });
        }
		else {
			var name = args[0].toLowerCase();
			var command = commands.get(name) || commands.find((c) => { return (c.aliases && c.aliases.includes(name)); });
			if ((!command) || ((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.noHelp)) && (!hidden)) {
				return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "dont_exists"));
			}

			let embed = new Discord.MessageEmbed();
			embed.setTitle(prefix + command.name + " " + client.functions.getTranslation(client, message.author, message.guild, ((command.usage && command.usage) || "")));
			if (command.description) { embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", command.description)); }
			if (command.aliases) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "aliases"), command.aliases.join(", "), false); }
			if (command.cooldown) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "cooldown"), client.functions.getTranslation(client, message.author, message.guild, "commands/general/help", "cooldown.field", [(command.cooldown || 0)]), false); } // (command.cooldown || 0)
			message.reply({embeds: [embed]}).catch((error) => { console.log(error); });
		}*/
	},
};
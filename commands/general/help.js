const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
	name: "help",
	path: path.basename(__dirname),
	description: "command.help.desc", //"Muestra todos los comandos visibles.",
	aliases: ["cmds"],
	usage: "command.help.usage", //"[comando]",
	cooldown: 5,
	//flags: constants.cmdFlags.noHelp,
	execute(client, message, args, prefix) {
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
			if (!category) { /*command.path.capitalize()*/
				categories.set(command.path, {name: "command.help.category." + command.path, commands: new Discord.Collection()});
				category = categories.get(command.path);
			} // command.path.capitalize()
			category.commands.set(command.name, command);
			
			//let element = commands[index];
			//if (((element.flags & constants.cmdFlags.ownerOnly) || (element.flags & constants.cmdFlags.autorizedOnly) || (element.flags & constants.cmdFlags.noHelp)) && !hidden) { continue; }
			//embed.addField(prefix + element.name + " " + client.functions.getTranslation(client, message.author, message.guild, ((element.usage && element.usage) || "")), client.functions.getTranslation(client, message.author, message.guild, element.description || "command.help.list.nodesc"), false);
		}
		
        if (!args[0]) {
            var embed = new Discord.MessageEmbed();
            embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "command.help.list.title"));
			
			let category_list = categories.array();
			for (let category_index = 0; category_index < category_list.length; category_index++) {
				let category_name = category_list[category_index].name;
				let command_names = "";
				let command_list = category_list[category_index].commands.array();
				for (let command_index = 0; command_index < command_list.length; command_index++) {
					let command = command_list[command_index];
					let command_usage = command.usage ? command.usage : "";
					if (((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.autorizedOnly) || (command.flags & constants.cmdFlags.noHelp)) && !hidden) { continue; }
					command_names += prefix + command.name + " " + client.functions.getTranslation(client, message.author, message.guild, command_usage) + "\n";
				}
				
				/*console.log("");
				console.log(category_list[category_index].name);
				console.log(command_names);*/
				if (command_names !== "") { embed.addField(client.functions.getTranslation(client, message.author, message.guild, category_list[category_index].name), command_names); }
			}
			
            embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "command.help.list.footer", [prefix]));
			
			if (message.channel.type !== "dm") {
				message.author.send(embed).then(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.help.list.send.success"));
				}).catch((error) => {
					console.log(error);
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.help.list.send.failure"));
				});
			}
			else {
				return message.channel.send(embed);
			}
        }
		else {
			var name = args[0].toLowerCase();
			var command = commands.get(name) || commands.find((c) => { c.aliases && c.aliases.includes(name) });
			if ((!command) || ((command.flags & constants.cmdFlags.ownerOnly) || (command.flags & constants.cmdFlags.autorizedOnly) || (command.flags & constants.cmdFlags.noHelp)) && (!hidden)) {
				return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.help.find.failure"));
			}

			var embed = new Discord.MessageEmbed();
			embed.setTitle(prefix + command.name + " " + client.functions.getTranslation(client, message.author, message.guild, ((command.usage && command.usage) || "")));
			if (command.description) { embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, command.description)); }
			if (command.aliases) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.help.find.aliases"), command.aliases.join(", "), false); }
			if (command.cooldown) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.help.find.cooldown"), client.functions.getTranslation(client, message.author, message.guild, "command.help.find.cooldown.field", [(command.cooldown || 0)]), false); } // (command.cooldown || 0)
			if (message.channel.type !== "dm") {
				message.author.send(embed).then(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.help.find.send.success"));
				}).catch(() => {
					return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.help.find.send.failure"));
				});
			}
			else {
				return message.channel.send(embed);
			}
		}
	},
};
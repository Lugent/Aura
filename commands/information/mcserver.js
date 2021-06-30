const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require('https');
const fs = require('fs');
module.exports = {
	name: "mcserver",
	path: path.basename(__dirname),
	usage: "mcserver.usage",
    cooldown: 5,
	description: "mcserver.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (!args.length) {
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.title"));
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.ip"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.ip.description"), false);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.players"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.players.description"), false);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.mods"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.mods.description"), false);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.software"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.software.description"), false);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.world"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.world.description"), false);
			embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "help.footer"));
			embed.setColor([0, 255, 255]);
			return message.channel.send({embeds: [embed]});
		}

		let players = false;
		let players_find = args.findIndex(index => index === "/p");
		if (players_find > -1) { args.splice(players_find, 1); players = true; }

		let modded = false;
		let modded_find = args.findIndex(index => index === "/m");
		if (modded_find > -1) { args.splice(modded_find, 1); modded = true; }

		let software = false;
		let software_find = args.findIndex(index => index === "/s");
		if (software_find > -1) { args.splice(software_find, 1); software = true; }

		let world = false;
		let world_find = args.findIndex(index => index === "/w");
		if (world_find > -1) { args.splice(world_find, 1); world = true; }

		let embed2 = new Discord.MessageEmbed();
		embed2.setDescription(":hourglass_flowing_sand:" + client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "loading"));
		embed2.setColor([255, 255, 0]);
		
		let send_message;
		await message.channel.send({embeds: [embed2]}).then(message => { send_message = message; });
		
		let data = "";
		let player_names = "";
		https.get("https://api.mcsrvstat.us/2/" + args[0], async (response) => {
			response.on("data", async (chunk) => { data += chunk; });
			response.on("end", async () => {
				try {
					if (!data.startsWith("{")) {
						let embed = new Discord.MessageEmbed();
						embed.setColor([255, 0, 0]);
						embed.setDescription(":no_entry: " + data);

						if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
						else { return message.reply({embeds: [embed]}); }
					}
					
					let parsed_data = JSON.parse(data);
					if (parsed_data) {
						if (parsed_data.online) {
							let embed = new Discord.MessageEmbed();
							embed.setTitle(args[0]);
							embed.setColor([0, 255, 0]);
							if (parsed_data.motd)
							{
								if (parsed_data.motd.clean.join("\n").length) {
									embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.motd") + ": ", parsed_data.motd.clean.join("\n"), false);
								}
							}
							
							if (parsed_data.info) {
								if (parsed_data.info.clean.join("\n").length) {
									embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.info") + ": ", parsed_data.info.clean.join("\n"), false);
								}
							}
							
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.players") + ": ", parsed_data.players.online + " / " + parsed_data.players.max, true);
							if (players && parsed_data.players.list)
							{
								let allplayers = "```" + parsed_data.players.list.slice(0).join("\n") + "```";
								if (allplayers.length > 1024) // Discord limit xd
								{
									allplayers = client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.player_list.limit");
									player_names = parsed_data.players.list.slice(0).join("\n");
								}
								embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.player_list") + ":", allplayers, true);
							}
							
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.version") + ": ", parsed_data.version, false);
							if (world && parsed_data.map) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.world") + ":", parsed_data.map, false); }
							if (software && parsed_data.software) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.software") + ":", parsed_data.software, true); }
							if (modded && parsed_data.plugins) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.plugins") + ":", parsed_data.plugins.raw, true); }
							if (modded && parsed_data.mods) { embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.mods") + ":", parsed_data.mods.raw, true); }
							embed.setThumbnail("https://api.mcsrvstat.us/icon/" + args[0]);
							if ((parsed_data.ip + ":" + parsed_data.port) !== args[0]) {
								embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.ip") + ": " + parsed_data.ip + ":" + parsed_data.port);
							}

							if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
							else { return message.reply({embeds: [embed]}); }
						}
						else {
							if (parsed_data.ip.length) {
								let embed = new Discord.MessageEmbed();
								embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "result.not_online"));
								if ((parsed_data.ip + ":" + parsed_data.port) !== args[0]) {
									embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "data.ip") + ": " + parsed_data.ip + ":" + parsed_data.port);
								}
								embed.setColor([255, 0, 0]);

								if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
								else { return message.reply({embeds: [embed]}); }
							}
							else {
								let embed = new Discord.MessageEmbed();
								embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "result.invalid_server"));
								embed.setColor([0, 0, 0]);

								if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
								else { return message.reply({embeds: [embed]}); }
							}
						}
					}
					else {
						let embed = new Discord.MessageEmbed();
						embed.setColor([255, 0, 0]);
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "error"));

						if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
						else { return message.reply({embeds: [embed]}); }
					}
				} 
				catch (error) {
					throw error;
				}
				finally {
					if (player_names.length) {
						return message.channel.send({
							content: client.functions.getTranslation(client, message.author, message.guild, "commands/information/mcserver", "players_file"),
							files: [
								new Discord.MessageAttachment(Buffer.from(player_names), "players.txt")
							]
						});
					}
				}
			});
		}).on("error", (error) => {
			throw error;
		});
	},
};
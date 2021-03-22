const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require('https');
const fs = require('fs');
module.exports = {
	name: "mcserver",
	path: path.basename(__dirname),
	usage: "command.mcserver.usage",
    cooldown: 5,
	description: "command.mcserver.desc",
	async execute(client, message, args) {
		if (!args.length) {
			var embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.title"));
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.desc"));
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args0"), client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args0.field"), false);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args1"), client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args1.field"), false);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args2"), client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args2.field"), false);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args3"), client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args3.field"), false);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args4"), client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.args4.field"), false);
			embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.help.footer"));
			embed.setColor([0, 255, 255]);
			return message.channel.send(embed);
		}
		
		var debug = false;
		var players = false;
		var modded = false;
		var software = false;
		var world = false;
		let arguments = args;
		for (let argument_index = 0; argument_index < arguments.length; argument_index++) {
			var argument = arguments[argument_index];
			if (argument === "/p") { players = true; arguments.splice(argument_index, 1); }
			if (argument === "/m") { modded = true; arguments.splice(argument_index, 1); }
			if (argument === "/s") { software = true; arguments.splice(argument_index, 1); }
			if (argument === "/w") { world = true; arguments.splice(argument_index, 1); }
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass_flowing_sand:" + client.utils.getTrans(client, message.author, message.guild, "command.mcserver.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let send_message = undefined;
		await message.channel.send(embed).then(message => { send_message = message; });
		
		//let wait_time_count = 0;
		/*let wait_time_function = setInterval(() => {
			if ((wait_time_count < 10) && (wait_time_count > -1)) { wait_time_count++; }
			else {
				wait_time_count = -1;
				var embed = new Discord.MessageEmbed();
				embed.setDescription(":hourglass_flowing_sand:" + client.utils.getTrans(client, message.author, message.guild, "command.mcserver.loading.toolong"));
				embed.setColor([255, 255, 0]);
				send_message ? send_message.edit(embed) : message.channel.send(embed);
			}
		}, 1000);*/
		
		https.get("https://api.mcsrvstat.us/2/" + arguments[0], async (response) => {
			var data = "";
			response.on("data", async (chunk) => { data += chunk; });
			response.on("end", async () => {
				try {
					//clearInterval(wait_time_function);
					if (!data.startsWith("{")) {
						var embed = new Discord.MessageEmbed();
						embed.setColor([255, 0, 0]);
						embed.setDescription(":no_entry: " + data);
						return send_message ? send_message.edit(embed) : message.channel.send(embed);
					}
					
					var parsed_data = JSON.parse(data);
					if (parsed_data !== undefined) {
						if (parsed_data.online) {
							var embed = new Discord.MessageEmbed();
							embed.setTitle(arguments[0]);
							embed.setColor([0, 255, 0]);
							if (parsed_data.motd !== undefined)
							{
								if (parsed_data.motd.clean.join("\n") !== "") {
									embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.motd") + ": ", parsed_data.motd.clean, false);
								}
							}
							
							if (parsed_data.info !== undefined) {
								if (parsed_data.info.clean.join("\n") !== "") {
									embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.info") + ": ", parsed_data.info.clean, false);
								}
							}
							
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.players") + ": ", parsed_data.players.online + " / " + parsed_data.players.max, true);
							if (players && (parsed_data.players.list !== undefined))
							{
								var allplayers = "```" + parsed_data.players.list.slice(0).join("\n") + "```";
								if (allplayers.length > 1024) // Discord limit xd
								{
									allplayers = client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.players.list.limit");
									
									var players_writer = fs.createWriteStream(process.cwd() + "/temp/players.txt");
									await players_writer.write(parsed_data.players.list.slice(0).join("\n"));
									await players_writer.end();
								}
								embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.players.list") + ":", allplayers, true);
							}
							
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.version") + ": ", parsed_data.version, false);
							if (world && (parsed_data.map !== undefined)) { embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.world") + ":", parsed_data.map, false); }
							if (software && (parsed_data.software !== undefined)) { embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.software") + ":", parsed_data.software, true); }
							if (modded && (parsed_data.plugins !== undefined)) { embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.plugins") + ":", parsed_data.plugins.raw, true); }
							if (modded && (parsed_data.mods !== undefined)) { embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.mods") + ":", parsed_data.mods.raw, true); }
							embed.setThumbnail("https://api.mcsrvstat.us/icon/" + arguments[0]);
							if ((parsed_data.ip + ":" + parsed_data.port) !== arguments[0]) {
								embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.ip") + ": " + parsed_data.ip + ":" + parsed_data.port);
							}
						}
						else {
							if (parsed_data.ip !== "") {
								var embed = new Discord.MessageEmbed();
								embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.notonline"));
								if ((parsed_data.ip + ":" + parsed_data.port) !== arguments[0]) {
									embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.ip") + ": " + parsed_data.ip + ":" + parsed_data.port);
								}
								embed.setColor([255, 0, 0]);
							}
							else {
								var embed = new Discord.MessageEmbed();
								embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.dontexists"));
								embed.setColor([0, 0, 0]);
							}
						}
					}
					else {
						var embed = new Discord.MessageEmbed();
						embed.setColor([255, 0, 0]);
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.mcserver.failure.desc"));
						return send_message ? send_message.edit(embed) : message.channel.send(embed);
					}
				} 
				catch (error) {
					console.error(error);
					var embed = new Discord.MessageEmbed();
					embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.mcserver.error.desc"));
					return send_message ? send_message.edit(embed) : message.channel.send(embed);
				}
				finally {
					send_message ? send_message.edit(embed) : message.channel.send(embed);
					if (fs.existsSync(process.cwd() + "/temp/players.txt"))
					{
						var attachfile = process.cwd() + "/temp/players.txt";
						await message.channel.send({
							content: client.utils.getTrans(client, message.author, message.guild, "command.mcserver.data.players.list.send"),
							files: [{
								attachment: process.cwd() + "/temp/players.txt",
								name: "players.txt"
							}]
						}).then(async () => { await fs.unlinkSync(process.cwd() + "/temp/players.txt"); });
					}
				}
			});
		}).on("error", (error) => {
			//clearInterval(wait_time_function);
			console.error(error);
			
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.mcserver.failure.fatal"));
			embed.addField(error.name, error.message);
			return send_message ? send_message.edit(embed) : message.channel.send(embed);
		});
	},
};
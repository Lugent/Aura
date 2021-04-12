const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require('https');
const fs = require('fs');
module.exports = {
	name: "wikipedia",
	path: path.basename(__dirname),
	usage: "command.wikipedia.usage",
	description: "command.wikipedia.desc",
	cooldown: 20,
	async execute(client, message, args) {
		if (!args.length) {
			var embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.utils.getTrans(client, message.author, message.guild, "command.wikipedia.no_arguments"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		let get_language = "es";
		let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(message.guild.id);
		let server_language = server_data.language;
		switch (server_language) {
			case "en": { get_language = "en"; break; }
		}
		
		var get_data = "";
		var search_url = "https://" + get_language +".wikipedia.org/w/api.php?action=query&titles=" + args.join("%20") + "&prop=info&inprop=url%7Ctalkid&format=json";
		https.get(search_url, async (response) => {
			response.on("data", async (chunk) => { get_data += chunk; });
			response.on("end", async () => {
				let final_data = JSON.parse(get_data); //.query.pages.keys
				var pages = final_data.query.pages;
				for (var p in pages) {
					if (pages[p].missing === "") {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.wikipedia.not_found"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					else {
						return message.channel.send(pages[p].fullurl)
					}
				}
			})
		}).on("error", (error) => {
			var embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.wikipedia.fatal_error"));
			embed.setColor([255, 0, ]);
			return message.channel.send(embed);
		});
	}
}
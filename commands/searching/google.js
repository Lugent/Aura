const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "google",
	path: path.basename(__dirname),
	description: "command.google.desc",
	aliases: ["g"],
	usage: "command.google.usage",
	cooldown: 20,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "command.google.no_arguments"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "command.google.loading"));
		embed.setColor([255, 255, 0]);
		
		let sent_message;
		await message.channel.send(embed).then(message => { sent_message = message; });
		
		let search = args.join("%20");
		let raw_data = "";
		let url_get = "https://customsearch.googleapis.com/customsearch/v1?cx=" + process.env.GOOGLE_CSE_ID + "&num=4&q=" + search + "&safe=off&start=1&key=" + process.env.GOOGLE_API_KEY;
		https.get(url_get, async (res) => {
			res.on("data", async (chunk) => { raw_data += chunk; });
			res.on("end", async () => {
				let data = JSON.parse(raw_data);
				let get_results = data.items;
				let get_error = data.error;
				if (get_error) {
					console.log(get_error);
					
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + get_error.message);
					embed.setColor([255, 255, 0]);
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
				if (get_results) {
					
					let display_result = "";
					let embed = new Discord.MessageEmbed();
					embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "command.google.results.author", [search]), "https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png"); // search
					embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "command.google.results.title", [data.searchInformation.formattedTotalResults, data.searchInformation.searchTime])); // data.searchInformation.searchTime - data.searchInformation.formattedTotalResults
					for (var result_index = 0; result_index < get_results.length; result_index += 1) {
						display_result += "**" + (result_index + 1) + ".-** " + "[" + get_results[result_index].title + "]" + "(" + get_results[result_index].link + ")" + "\n" + get_results[result_index].snippet + "\n";
					}
					
					embed.setDescription(display_result);
					embed.setColor([254, 254, 254]);
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
				else {
					var embed = new Discord.MessageEmbed();
					embed.setColor([255, 0, 0]);
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.google.not_found"));
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
			});
		}).on("error", (error) => {
			console.error(error);
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.google.fatal_failure"));
			embed.addField(error.name, error.message);
			return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
		});
	},
};
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "search",
	path: path.basename(__dirname),
	description: "search.google.desc",
	aliases: ["s"],
	usage: "search.usage",
	cooldown: 10,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/search", "no_arguments"));
			embed.setColor([255, 255, 0]);
			return message.reply({embeds: [embed]});
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/search", "loading"));
		embed.setColor([255, 255, 0]);
		
		let send_message = await message.reply({embeds: [embed]});
		
		let search = args.join("%20");
		let raw_data = "";
		let url_get = "https://customsearch.googleapis.com/customsearch/v1?cx=" + process.env.GOOGLE_CSE_ID + "&num=4&q=" + search + "&safe=off&start=1&key=" + process.env.GOOGLE_API_KEY;
		https.get(url_get, async (response) => {
			response.on("data", async (chunk) => { raw_data += chunk; });
			response.on("end", async () => {
				let data = JSON.parse(raw_data);
				console.log(data.queries);
				let get_results = data.items;
				let get_error = data.error;
				if (get_error) {
					console.log(get_error);
					
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + get_error.message);
					embed.setColor([255, 0, 0]);

					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
					else { return message.reply({embeds: [embed]}); }
				}

				if (get_results) {
					let display_result = "";
					let embed = new Discord.MessageEmbed();
					embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/searching/search", "results.author", [search]), "https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png");
					embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/searching/search", "results.title", [data.searchInformation.formattedTotalResults, data.searchInformation.searchTime]));
					for (var result_index = 0; result_index < get_results.length; result_index += 1) {
						display_result += "**" + (result_index + 1) + ".-** " + "[" + get_results[result_index].title + "]" + "(" + get_results[result_index].link + ")" + "\n" + get_results[result_index].snippet + "\n";
					}
					
					embed.setDescription(display_result);
					embed.setColor([254, 254, 254]);

					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
					else { return message.reply({embeds: [embed]}); }
				}
				else {
					var embed = new Discord.MessageEmbed();
					embed.setColor([255, 0, 0]);
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/search", "not_found"));

					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
					else { return message.reply({embeds: [embed]}); }
				}
			});
		}).on("error", (error) => {
			throw error;
		});
	},
};
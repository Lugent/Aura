const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "image",
	path: path.basename(__dirname),
	description: "image.description",
	aliases: ["img"],
	usage: "image.usage",
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
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/image", "no_search"));
			embed.setColor([255, 255, 0]);
			return message.reply(embed);
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/image", "loading"));
		embed.setColor([255, 255, 0]);
		
		let send_message = await message.reply(embed);
		
		let search = args.slice(0).join(" ");
		let raw_data = "";
		let url_get = "https://customsearch.googleapis.com/customsearch/v1?cx=" + process.env.GOOGLE_CSE_ID + "&num=1&imgSize=XXLARGE&q=" + search + "&safe=off&searchType=image&start=1&key=" + process.env.GOOGLE_API_KEY;
		https.get(url_get, async (response) => {
			response.on("data", async (chunk) => { raw_data += chunk; });
			response.on("end", async () => {
				let data = JSON.parse(raw_data);
				let get_image = data.items;
				let get_error = data.error;
				if (get_error) {
					console.log(get_error);
					
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + get_error.message);
					embed.setColor([255, 0, 0]);

					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit(embed); } }
					else { return message.reply(embed); }
				}

				if (get_image) {
					let embed = new Discord.MessageEmbed();
					embed.setImage(get_image[0].link);
					embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/searching/image", "success.footer", [search]));
					embed.setColor([254, 254, 254]);
					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit(embed); } }
					else { return message.reply(embed); }
				}
				else {
					var embed = new Discord.MessageEmbed();
					embed.setColor([255, 0, 0]);
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/searching/image", "not_found"));

					if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit(embed); } }
					else { return message.reply(embed); }
				}
			});
		}).on("error", (error) => {
			throw error;
		});
	},
};
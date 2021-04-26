const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "image",
	path: path.basename(__dirname),
	description: "command.image.desc",
	aliases: ["img"],
	usage: "command.image.usage",
	cooldown: 20,
	async execute(client, message, args) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "command.image.error.nosearch"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "command.image.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let sent_message = undefined;
		await message.channel.send(embed).then(message => { sent_message = message; });
		
		let search = args.slice(0).join(" ");
		let raw_data = "";
		let url_get = "https://customsearch.googleapis.com/customsearch/v1?cx=" + process.env.GOOGLE_CSE_ID + "&num=1&imgSize=XXLARGE&q=" + search + "&safe=off&searchType=image&start=1&key=" + process.env.GOOGLE_API_KEY;
		https.get(url_get, async (res) => {
			res.on("data", async (chunk) => { raw_data += chunk; });
			res.on("end", async () => {
				let data = JSON.parse(raw_data);
				let get_image = data.items;
				let get_error = data.error;
				if (get_error) {
					console.log(get_error);
					
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + get_error.message);
					embed.setColor([255, 255, 0]);
					return message.channel.send(embed);
				}
				if (get_image) {
					let embed = new Discord.MessageEmbed();
					embed.setImage(get_image[0].link);
					embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "command.image.warning.experimental"));
					embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "command.image.success.string", [search])); // search
					embed.setColor([254, 254, 254]);
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
				else {
					var embed = new Discord.MessageEmbed();
					embed.setColor([255, 0, 0]);
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.image.failure.notfound"));
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
			});
		}).on("error", (error) => {
			console.error(error);
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.image.failure.fatal"));
			embed.addField(error.name, error.message);
			return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
		});
	},
};
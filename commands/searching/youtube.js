const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "youtube",
	path: path.basename(__dirname),
	description: "youtube.description",
	aliases: ["yt"],
	usage: "youtube.usage",
	cooldown: 20,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.error.nosearch"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let sent_message;
		await message.channel.send(embed).then(message => { sent_message = message; });
		
		let raw_video_data = "";
		let video_search = args.slice(0).join("%20");
		let video_url_get = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=" + video_search + "&key=" + process.env.GOOGLE_API_KEY;
		https.get(video_url_get, async (res) => {
			res.on("data", async (chunk) => { raw_video_data += chunk; });
			res.on("end", async () => {
				let video_data = JSON.parse(raw_video_data);
				let get_video = video_data.items[0];
				let get_error = video_data.error;
				if (get_error) {
					console.log(get_error);
					
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + get_error.message);
					embed.setColor([255, 255, 0]);
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
				if (get_video) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.loading.channel"));
					embed.setColor([255, 255, 0]);
					if (sent_message) { await sent_message.edit(embed); } else { await message.channel.send(embed); }
					
					let raw_channel_data = "";
					let channel_url_get = "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1&id=" + get_video.snippet.channelId + "&key=" + process.env.GOOGLE_API_KEY;
					https.get(channel_url_get, async (res) => {
						res.on("data", async (chunk) => { raw_channel_data += chunk; });
						res.on("end", async () => {
							let channel_data = JSON.parse(raw_channel_data);
							let get_channel = channel_data.items[0];
							let get_error = channel_data.error;
							if (get_error) {
								console.log(get_error);
								
								let embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + get_error.message);
								embed.setColor([255, 255, 0]);
								return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
							}
							
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.loading.stats"));
							embed.setColor([255, 255, 0]);
							if (sent_message) { await sent_message.edit(embed); } else { await message.channel.send(embed); }
							
							let raw_statistics_data = "";
							let statistics_url_get = "https://www.googleapis.com/youtube/v3/videos?part=statistics&maxResults=1&id=" + get_video.id.videoId + "&key=" + process.env.GOOGLE_API_KEY;
							https.get(statistics_url_get, async (res) => {
								res.on("data", async (chunk) => { raw_statistics_data += chunk; });
								res.on("end", async () => {
									let statistics_data = JSON.parse(raw_statistics_data);
									let get_statistics = statistics_data.items[0];
									let get_error = statistics_data.error;
									if (get_error) {
										console.log(get_error);
										
										let embed = new Discord.MessageEmbed();
										embed.setDescription(":no_entry: " + get_error.message);
										embed.setColor([255, 255, 0]);
										return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
									}
									
									let video_link = "https://www.youtube.com/watch?v=" + get_video.id.videoId;
									let channel_link = "https://www.youtube.com/channel/" + get_channel.id;
									let views_count = client.functions.getTranslation(client, message.author, message.guild, "command.youtube.embed.none");
									let likes_count = client.functions.getTranslation(client, message.author, message.guild, "command.youtube.embed.none");
									let dislikes_count = client.functions.getTranslation(client, message.author, message.guild, "command.youtube.embed.none");
									let comments_count = client.functions.getTranslation(client, message.author, message.guild, "command.youtube.embed.none");
									if (get_statistics.statistics.viewCount) { views_count = client.functions.number_formatter(get_statistics.statistics.viewCount, 2); }
									if (get_statistics.statistics.likeCount) { likes_count = client.functions.number_formatter(get_statistics.statistics.likeCount, 2); }
									if (get_statistics.statistics.dislikeCount) { dislikes_count = client.functions.number_formatter(get_statistics.statistics.dislikeCount, 2); }
									if (get_statistics.statistics.commentCount) { comments_count = client.functions.number_formatter(get_statistics.statistics.commentCount, 2); }
									
									let get_date = client.functions.ISODateToJSDate(get_video.snippet.publishedAt);
									
									let video_views = ":eye: " + views_count;
									let video_likes = ":thumbsup: " + likes_count;
									let video_dislikes = ":thumbsdown: " + dislikes_count;
									let video_comments = ":speech_left: " + comments_count;
									let video_date = ":calendar_spiral: " + client.functions.generateDateString(client, message.author, message.guild, get_date);
									
									let embed = new Discord.MessageEmbed();
									embed.setAuthor(get_channel.snippet.title, get_channel.snippet.thumbnails.high.url, channel_link);
									embed.setTitle(get_video.snippet.title);
									embed.setDescription(get_video.snippet.description);
									embed.setURL(video_link);
									embed.setImage(get_video.snippet.thumbnails.high.url);
									embed.addField(":bar_chart: " + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.embed.stats") + ":", video_date + "\n" + video_views + " | " + video_likes + " | " + video_dislikes + " | " + video_comments);
									embed.setColor([255, 0, 0]);
									return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
								}).on("error", (error) => {
									console.error(error);
									
									let embed = new Discord.MessageEmbed();
									embed.setColor([255, 0, 0]);
									embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.failure.fatal"));
									return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
								});
							});
							
						}).on("error", (error) => {
							console.error(error);
							let embed = new Discord.MessageEmbed();
							embed.setColor([255, 0, 0]);
							embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.failure.fatal"));
							return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
						});
					});
				}
				else {
					let embed = new Discord.MessageEmbed();
					embed.setColor([255, 0, 0]);
					embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.failure.notfound"));
					return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
				}
			});
		}).on("error", (error) => {
			console.error(error);
			let embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "command.youtube.failure.fatal"));
			return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
		});
	},
};
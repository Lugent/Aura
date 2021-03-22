const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "gd",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "command.gd.usage",
	async execute(client, message, args) {
		
		let diff_to_color = [
			{id: "Unrated", color: [182, 182, 182]},
			{id: "Auto", color: [243, 188, 96]},
			{id: "Easy", color: [0, 171, 255]},
			{id: "Normal", color: [0, 237, 1]},
			{id: "Hard", color: [255, 185, 0]},
			{id: "Harder", color: [255, 66, 8]},
			{id: "Insane", color: [243, 77, 230]},
			{id: "Easy Demon", color: [154, 68, 255]},
			{id: "Medium Demon", color: [136, 17, 118]},
			{id: "Hard Demon", color: [154, 17, 33]},
			{id: "Insane Demon", color: [238, 17, 1]},
			{id: "Extreme Demon", color: [119, 1, 0]}
		]
		
		let raw_data = "";
		let api_url = "https://gdbrowser.com/api/";
		let subcommand = args[0];
		if (!subcommand) {
			var embed = new Discord.MessageEmbed();
			//embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.nosubcommand"));
			//embed.setColor([255, 0, 0]);
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.title")); // "List of available subcommands"
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_0"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_0")); // "help" - "Gives a help of the usage of the given subcommand."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_1"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_1")); // "search" - "Returns a list of levels with the given filters. (Defaults to most downloaded if no filters given)."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_2"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_2")); // "level" - "Returns details of a level via ID."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_3"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_3")); // "profile" - "Returns the profile of a account."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_4"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_4")); // "comments" - "Returns a list level's comments, or a list of account post or a list of account's comment history."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_5"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_5")); // "mappack" - "Look a dead featu-- I mean... Returns a list of map packs."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_6"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_6")); // "gauntlets" - "Returns a list of gauntlets with their level IDs."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_7"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_7")); // "leaderboard" - "This never works, robtop jus-... Returns the actual leaderboard."
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.field_8"), client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.desc_8")); // "song" - "Check if a song is allowed to use in GD."
			embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.gd.usage.footer"), "https://gdbrowser.com/icon/colon"); // "API by GDColon"
			embed.setColor([0, 255, 255]);
			return message.channel.send(embed);
		}
		else {
			switch (subcommand) {
				case "search": {
					// flags
					let filters_custom_count = false;
					
					// Search
					let filter_prefix = "?";
					let search_query = "*";
					let search_filters = "";
					let filters_arguments = args.slice(1);
					if (filters_arguments.length > 0) {
						if (filters_arguments.find(index => index === "*")) {
							search_query = "*";
							filters_arguments.splice(filters_arguments.findIndex(index => index === "*"), 1);
						}
						else if (filters_arguments.find(index => !index.startsWith("/"))) {
							search_query = filters_arguments.find(index => !index.startsWith("/"));
							filters_arguments.splice(filters_arguments.find(index => !index.startsWith("/")), 1);
						}
						else { search_query = "*"; }
						
						for (let filters_index = 0; filters_index < filters_arguments.length; filters_index++) {
							let filter_element = filters_arguments[filters_index];
							let filter_argument = "";
							if (filters_index > 0) { filter_prefix = "&"; }
							
							if (filter_element.startsWith("/count=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								console.log(filter_argument)
								let search_count = Number(filter_argument);
								if (!Number.isNaN(search_count)) {
									if (search_count > 5) { search_count = 5; }
									search_filters += filter_prefix + "count=" + search_count;
									filters_custom_count = true;
								}
							}
							
							if (filter_element.startsWith("/page=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								console.log(filter_argument)
								let search_count = Number(filter_argument);
								if (!Number.isNaN(search_count)) { search_filters += filter_prefix + "page=" + search_count; }
								else { search_filters += filter_prefix + "page=1"; }
							}
							
							if (filter_element.startsWith("/difficulty=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let difficulty_number = Number(filter_argument)
								if (Number.isNaN(difficulty_number)) {
									switch (filter_argument) {
										case "na": { search_filters += filter_prefix + "diff=-1"; break; }
										case "auto": { search_filters += filter_prefix + "diff=-3"; break; }
										case "easy": { search_filters += filter_prefix + "diff=1"; break; }
										case "normal": { search_filters += filter_prefix + "diff=2"; break; }
										case "hard": { search_filters += filter_prefix + "diff=3"; break; }
										case "harder": { search_filters += filter_prefix + "diff=4"; break; }
										case "insane": { search_filters += filter_prefix + "diff=5"; break; }
										case "easy_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=1"; break; }
										case "medium_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=2"; break; }
										case "hard_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=3"; break; }
										case "insame_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=4"; break; }
										case "extreme_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=5"; break; }
									}
								}
								else {
									switch (difficulty_number) {
										case 0: { search_filters += filter_prefix + "diff=-1"; break; }
										case 1: { search_filters += filter_prefix + "diff=-3"; break; }
										case 2: { search_filters += filter_prefix + "diff=1"; break; }
										case 3: { search_filters += filter_prefix + "diff=2"; break; }
										case 4: { search_filters += filter_prefix + "diff=3"; break; }
										case 5: { search_filters += filter_prefix + "diff=4"; break; }
										case 6: { search_filters += filter_prefix + "diff=5"; break; }
										case 7: { search_filters += filter_prefix + "diff=-2&demonFilter=1"; break; }
										case 8: { search_filters += filter_prefix + "diff=-2&demonFilter=2"; break; }
										case 9: { search_filters += filter_prefix + "diff=-2&demonFilter=3"; break; }
										case 10: { search_filters += filter_prefix + "diff=-2&demonFilter=4"; break; }
										case 11: { search_filters += filter_prefix + "diff=-2&demonFilter=5"; break; }
									}
								}
							}
						}
					}
					if (!filters_custom_count) { search_filters += filter_prefix + "count=5"; }
					
					let complete_url = api_url + "search/" + search_query + search_filters;
					console.log(complete_url);
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; })
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let levels_data = JSON.parse(raw_data);
								//console.log(levels_data);
								var search_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/magnify.png", "search.png");
								var gd_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/gdps/gd_icon.png", "gd_icon.png");
								var embed = new Discord.MessageEmbed();
								for (let level_index = 0; level_index < levels_data.length; level_index++) {
									var level_element = levels_data[level_index];
									var level_difficulty = "<:gd_na:816468850924060712>";
									switch (level_element.difficulty) {
										case "Unrated": { level_difficulty = "<:gd_na:816468850924060712>"; break; }
										case "Auto": { level_difficulty = "<:gd_auto:816468880305815552>"; break; }
										case "Easy": { level_difficulty = "<:gd_easy:816468900669161482>"; break; }
										case "Normal": { level_difficulty = "<:gd_normal:816468934373933086>"; break; }
										case "Hard": { level_difficulty = "<:gd_hard:816468951243948042>"; break; }
										case "Harder": { level_difficulty = "<:gd_harder:816468969183510559>"; break; }
										case "Insane": { level_difficulty = "<:gd_insane:816469005384548363>"; break; }
										case "Easy Demon": { level_difficulty = "<:gd_easy_demon:816469026149630002>"; break; }
										case "Medium Demon": { level_difficulty = "<:gd_medium_demon:816469049226952745>"; break; }
										case "Hard Demon": { level_difficulty = "<:gd_hard_demon:816469080872976405>"; break; }
										case "Insane Demon": { level_difficulty = "<:gd_insane_demon:816469106919997480>"; break; }
										case "Extreme Demon": { level_difficulty = "<:gd_extreme_demon:816469123445293077>"; break; }
									}
									// <:gd_profile:823150924330434572> <:gd_mod:823150781988995082> <:gd_elder_mod:823150781964222464>
									// <:gd_featured:823046883093381130> <:gd_epic:823046883232579604>
									// <:gd_brown_coin:823042477245464647> <:gd_silver_coin:823042425953976321>
									
									var level_coins = "";
									if (level_element.coins > 0) {
										if (level_element.verifiedCoins) { level_coins += "<:gd_silver_coin:823042425953976321>"; }
										else { level_coins += "<:gd_brown_coin:823042477245464647>"; }
										level_coins += " " + level_element.coins;
									}
									
									let level_large = level_element.large ? "<:gd_large:823196254636605460>" : "";
									let level_rated = (level_element.epic ? " <:gd_epic:823046883232579604>" : (level_element.featured ? " <:gd_featured:823046883093381130>" : ""));
									let level_name = level_element.name + " " + "(" + level_element.id + ")";
									let level_header = level_name;
									
									let level_author = "<:gd_creator_points:823153273711362059> " + "By " + level_element.author;
									let level_author_specials = (Number(level_element.accountID) !== 0) ? (" | <:gd_profile:823150924330434572>" + " " + level_element.accountID) : "";
									let level_song = "<:gd_note:823153052495249448> " + (level_element.songLink ? ("[" + level_element.songName + "]" + "(" + level_element.songLink + ")") : level_element.songName)
									let level_description = level_difficulty + " " + level_rated + " " + level_large + "\n" + level_author + level_author_specials;
									
									let level_stars = (level_element.stars > 0) ? ("<:gd_star:823042179374120960> " + level_element.stars + " | ") : "";
									let level_totalcoins = (level_coins.length ? (level_coins + " | ") : "");
									let level_downloads = "<:gd_download:816466814930255872> " + client.functions.number_formatter(level_element.downloads, 2);
									let level_likes = (level_element.disliked ? "<:gd_dislike:816467209366011955> " : "<:gd_like:816467236117020693> ") + client.functions.number_formatter(level_element.likes, 2);
									let level_orbs = (level_element.orbs > 0) ? ("<:gd_orbs:823042795446730762> " + level_element.orbs + " | ") : "";
									let level_duration = "<:gd_time:823043610026967060> " + level_element.length;
									let level_objects = "<:gd_object:823395350315794452> " + ((level_element.objects > 0) ? client.functions.number_formatter(level_element.objects, 2) : "NA");
									let level_gdversion = "Game version: " + level_element.gameVersion;
									let level_version = "Level version: " + level_element.version;
									let level_stats = level_downloads + " | " + level_likes + " | " + level_orbs + level_duration + "\n" + level_stars + level_totalcoins + " | " + level_objects;
									
									let level_information = level_description + "\n" + level_stats + "\n" + level_song;
									embed.addField(level_header, level_information);
								}
								embed.setTitle("Found " + levels_data[0].results + " results in " + levels_data[0].pages + " pages.");
								embed.attachFiles([search_image, gd_image]);
								embed.setThumbnail("attachment://search.png");
								embed.setAuthor("Geometry Dash - Level Search", "attachment://gd_icon.png")
								embed.setFooter("API by GDColon", "https://gdbrowser.com/icon/colon");
								embed.setColor([254, 223, 0]);
								return message.channel.send(embed);
							}
							else {
								var embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.search.not_found"));
								embed.setColor([255, 0, 0]);
								return message.channel.send(embed);
							}
						})
					}).on("error", async (error) => {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.search.failure"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					});
					break;
				}
				
				case "level": {
					if (!args[1]) {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.level.no_argument"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					let level_id = args[1];
					let complete_url = api_url + "level/" + level_id;
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; })
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let level_data = JSON.parse(raw_data);
								console.log(level_data)
								
								let level_large = (level_data.large ? " <:gd_large:823196254636605460>" : "");
								let level_author = "By " + level_data.author;
								let level_author_specials = ((Number(level_data.accountID) !== 0) ? ("(" + level_data.accountID + ")") : "");
								let level_header = level_data.name + level_large;
								
								var level_coins = "";
								if (level_data.coins > 0) {
									if (level_data.verifiedCoins) { level_coins += "<:gd_silver_coin:823042425953976321>"; }
									else { level_coins += "<:gd_brown_coin:823042477245464647>"; }
									level_coins += " " + level_data.coins;
								}
								
								let level_stars = (level_data.stars > 0) ? ("<:gd_star:823042179374120960> " + level_data.stars + " | ") : "";
								let level_totalcoins = (level_coins.length ? (level_coins + " | ") : "");
								let level_downloads = "<:gd_download:816466814930255872> " + client.functions.number_formatter(level_data.downloads, 2);
								let level_likes = (level_data.disliked ? "<:gd_dislike:816467209366011955> " : "<:gd_like:816467236117020693> ") + client.functions.number_formatter(level_data.likes, 2);
								let level_orbs = (level_data.orbs > 0) ? ("<:gd_orbs:823042795446730762> " + level_data.orbs + " | ") : "";
								let level_duration = "<:gd_time:823043610026967060> " + level_data.length;
								let level_objects = "<:gd_object:823395350315794452> " + ((level_data.objects > 0) ? client.functions.number_formatter(level_data.objects, 2) : "NA");
								let level_gdversion = "Game version: " + level_data.gameVersion;
								let level_version = "Level version: " + level_data.version;
								let level_stats = level_downloads + " | " + level_likes + " | " + level_orbs + level_duration + "\n" + level_stars + level_totalcoins + level_objects;
								
								let level_song_link = "<:gd_note:823153052495249448> " + (level_data.songLink ? ("[" + level_data.songName + "]" + "(" + level_data.songLink + ")") : level_data.songName);
								let level_song_author = ("[" + level_data.songAuthor + "]" + "(" + "https://" + level_data.songAuthor + ".newgrounds.com" + ")");
								let level_song_size = (level_data.songLink ? ("\n" + "Size: " + level_data.songSize + " - " + "ID: " + level_data.songID) : "");
								let level_song = level_song_link + " - " + level_song_author + level_song_size;
								
								let level_information = level_data.description + "\n\n" + level_stats + "\n" + level_song + "\n\n" + level_gdversion + "\n" + level_version;
								
								var difficulty_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/difficulties/" + level_data.difficultyFace + ".png", level_data.difficultyFace + ".png");
								var embed = new Discord.MessageEmbed();
								embed.setColor(diff_to_color.find(element => element.id === level_data.difficulty).color);
								embed.attachFiles([difficulty_image]);
								embed.setThumbnail("attachment://" + level_data.difficultyFace + ".png");
								embed.setFooter("API by GDColon", "https://gdbrowser.com/icon/colon");
								embed.setAuthor(level_author, "https://gdbrowser.com/icon/" + level_data.playerID);
								embed.setTitle(level_header);
								embed.setDescription(level_information);
								return message.channel.send(embed);
							}
							else {
								var embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.level.no_data"));
								embed.setColor([255, 0, 0]);
								return message.channel.send(embed);
							}
						})
					}).on("error", async (error) => {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.level.failure"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					});
					break;
				}
				
				default: {
					var embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.invalid_subcommand"));
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
					break;
				}
			}
		}
	},
};
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "gd",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "command.gd.usage",
	async execute(client, message, args, prefix) {
		
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
				case "help": {
					let help_command = args[1];
					if (!help_command) {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.help_no_command"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					switch (help_command) {
						case "search": {
							var embed = new Discord.MessageEmbed();
							embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.title", [prefix]));
							embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_main"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_0"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_0"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_1"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_1"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_2"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_2"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_3"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_3"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_4"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_4"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_5"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_5"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_6"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_6"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_7"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_7"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_8"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_8"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_9"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_9"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_10"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_10"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_11"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_11"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_12"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_12"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_13"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_13"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_14"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_14"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_15"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_15"));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.field_16"), client.utils.getTrans(client, message.author, message.guild, "command.gd.help.search.desc_16"));
							embed.setColor([0, 255, 255]);
							return message.channel.send(embed);
							break;
						}
						
						default: {
							var embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.help_invalid_command"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
							break;
						}
					}
					break;
				}
				
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
							
							// Flags
							if (filter_element.startsWith("/featured")) { search_filters += filter_prefix + "featured=yes"; } // Featured
							if (filter_element.startsWith("/original")) { search_filters += filter_prefix + "original=yes"; } // Original
							if (filter_element.startsWith("/twoPlayer")) { search_filters += filter_prefix + "twoPlayer=yes"; } // Two Player
							if (filter_element.startsWith("/coins")) { search_filters += filter_prefix + "coins=yes"; } // Coins
							if (filter_element.startsWith("/epic")) { search_filters += filter_prefix + "epic=yes"; } // Epic
							if (filter_element.startsWith("/starred")) { search_filters += filter_prefix + "starred=yes"; } // Starred
							if (filter_element.startsWith("/noStar")) { search_filters += filter_prefix + "noStar=yes"; } // No Star
							
							// Search types
							if (filter_element.startsWith("/type=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								console.log(filter_argument)
								switch (filter_argument.toLowerCase()) {
									case "mostdownloaded": { search_filters += filter_prefix + "type=mostdownloaded"; break; }
									case "mostliked": { search_filters += filter_prefix + "type=mostliked"; break; }
									case "trending": { search_filters += filter_prefix + "type=trending"; break; }
									case "recent": { search_filters += filter_prefix + "type=recent"; break; }
									case "awarded": { search_filters += filter_prefix + "type=awarded"; break; }
									case "featured": { search_filters += filter_prefix + "type=featured"; break; }
									case "magic": { search_filters += filter_prefix + "type=magic"; break; }
									case "halloffame": { search_filters += filter_prefix + "type=halloffame"; break; }
								}
							}
							
							// Custom Song ID
							if (filter_element.startsWith("/customSong=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "customSong=" + filter_argument;
							}
							
							// User
							if (filter_element.startsWith("/user=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "user=" + filter_argument;
							}
							
							// Creators
							if (filter_element.startsWith("/creators=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "creators=" + filter_argument;
							}
							
							// List
							if (filter_element.startsWith("/list=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "list=" + filter_argument;
							}
							
							// Official Song ID
							if (filter_element.startsWith("/songID=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let size_number = Number(filter_argument)
								if (Number.isNaN(size_number)) {
									switch (filter_argument.toLowerCase()) {
										case "stereo_madness": { search_filters += filter_prefix + "songID=1"; break; }
										case "back_on_track": { search_filters += filter_prefix + "songID=2"; break; }
										case "polargeist": { search_filters += filter_prefix + "songID=3"; break; }
										case "dry_out": { search_filters += filter_prefix + "songID=4"; break; }
										case "base_after_base": { search_filters += filter_prefix + "songID=5"; break; }
										case "cant_let_go": { search_filters += filter_prefix + "songID=6"; break; }
										case "jumper": { search_filters += filter_prefix + "songID=7"; break; }
										case "time_machine": { search_filters += filter_prefix + "songID=8"; break; }
										case "cycles": { search_filters += filter_prefix + "songID=9"; break; }
										case "xstep": { search_filters += filter_prefix + "songID=10"; break; }
										case "clutterfunk": { search_filters += filter_prefix + "songID=11"; break; }
										case "theory_of_everything": { search_filters += filter_prefix + "songID=12"; break; }
										case "electroman_adventures": { search_filters += filter_prefix + "songID=13"; break; }
										case "clubstep": { search_filters += filter_prefix + "songID=14"; break; }
										case "electrodynamix": { search_filters += filter_prefix + "songID=15"; break; }
										case "hexagon_force": { search_filters += filter_prefix + "songID=16"; break; }
										case "blast_processing": { search_filters += filter_prefix + "songID=17"; break; }
										case "theory_of_everything_2": { search_filters += filter_prefix + "songID=18"; break; }
										case "geometrical_dominator": { search_filters += filter_prefix + "songID=19"; break; }
										case "deadlocked": { search_filters += filter_prefix + "songID=20"; break; }
										case "fingerdash": { search_filters += filter_prefix + "songID=21"; break; }
									}
								}
								else {
									switch (size_number) {
										case 1: { search_filters += filter_prefix + "songID=1"; break; }
										case 2: { search_filters += filter_prefix + "songID=2"; break; }
										case 3: { search_filters += filter_prefix + "songID=3"; break; }
										case 4: { search_filters += filter_prefix + "songID=4"; break; }
										case 5: { search_filters += filter_prefix + "songID=5"; break; }
										case 6: { search_filters += filter_prefix + "songID=6"; break; }
										case 7: { search_filters += filter_prefix + "songID=7"; break; }
										case 8: { search_filters += filter_prefix + "songID=8"; break; }
										case 9: { search_filters += filter_prefix + "songID=9"; break; }
										case 10: { search_filters += filter_prefix + "songID=10"; break; }
										case 11: { search_filters += filter_prefix + "songID=11"; break; }
										case 12: { search_filters += filter_prefix + "songID=12"; break; }
										case 13: { search_filters += filter_prefix + "songID=13"; break; }
										case 14: { search_filters += filter_prefix + "songID=14"; break; }
										case 15: { search_filters += filter_prefix + "songID=15"; break; }
										case 16: { search_filters += filter_prefix + "songID=16"; break; }
										case 17: { search_filters += filter_prefix + "songID=17"; break; }
										case 18: { search_filters += filter_prefix + "songID=18"; break; }
										case 19: { search_filters += filter_prefix + "songID=19"; break; }
										case 20: { search_filters += filter_prefix + "songID=20"; break; }
										case 21: { search_filters += filter_prefix + "songID=21"; break; }
									}
								}
							}
							
							// Length
							if (filter_element.startsWith("/length=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let size_number = Number(filter_argument)
								if (Number.isNaN(size_number)) {
									switch (filter_argument.toLowerCase()) {
										case "tiny": { search_filters += filter_prefix + "length=0"; break; }
										case "short": { search_filters += filter_prefix + "length=1"; break; }
										case "medium": { search_filters += filter_prefix + "length=2"; break; }
										case "long": { search_filters += filter_prefix + "length=3"; break; }
										case "xl": { search_filters += filter_prefix + "length=4"; break; }
									}
								}
								else {
									switch (size_number) {
										case 0: { search_filters += filter_prefix + "length=0"; break; }
										case 1: { search_filters += filter_prefix + "length=1"; break; }
										case 2: { search_filters += filter_prefix + "length=2"; break; }
										case 3: { search_filters += filter_prefix + "length=3"; break; }
										case 4: { search_filters += filter_prefix + "length=4"; break; }
									}
								}
							}
							
							// Count
							if (filter_element.startsWith("/count=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let search_count = Number(filter_argument);
								if (!Number.isNaN(search_count)) {
									if (search_count > 5) { search_count = 5; }
									search_filters += filter_prefix + "count=" + search_count;
									filters_custom_count = true;
								}
							}
							
							// Page
							if (filter_element.startsWith("/page=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let search_count = Number(filter_argument);
								if (!Number.isNaN(search_count)) { search_filters += filter_prefix + "page=" + search_count; }
								else { search_filters += filter_prefix + "page=1"; }
							}
							
							// Difficulty
							if (filter_element.startsWith("/difficulty=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let difficulty_number = Number(filter_argument)
								if (Number.isNaN(difficulty_number)) {
									switch (filter_argument.toLowerCase()) {
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
							
							// Update prefix
							filter_prefix = "&";
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
								var gd_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/gd_icon.png", "gd_icon.png");
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
				
				case "profile": {
					if (!args[1]) {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.profile.no_argument"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					let profile_id = args.slice(1).join(" ");
					let complete_url = api_url + "profile/" + profile_id;
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; })
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let profile_data = JSON.parse(raw_data);
								console.log(profile_data)
								
								let profile_moderator = "";
								if (profile_data.moderator == 1) { profile_moderator = "<:gd_mod:823150781988995082> "; }
								else if (profile_data.moderator == 2) { profile_moderator = "<:gd_elder_mod:823150781964222464> "; }
								
								let profile_rank = profile_data.rank;
								let profile_rank_string = (profile_rank > 0) ? ("Top #" + profile_rank) : "No rank";
								let profile_rank_index = 0;
								if (profile_rank == 1) { profile_rank_index = 1; }
								else if ((profile_rank > 1) && (profile_rank < 11)) { profile_rank_index = 2; }
								else if ((profile_rank > 10) && (profile_rank < 51)) { profile_rank_index = 3; }
								else if ((profile_rank > 50) && (profile_rank < 101)) { profile_rank_index = 4; }
								else if ((profile_rank > 100) && (profile_rank < 201)) { profile_rank_index = 5; }
								else if ((profile_rank > 200) && (profile_rank < 501)) { profile_rank_index = 6; }
								else if ((profile_rank > 500) && (profile_rank < 1001)) { profile_rank_index = 7; }
								else if (profile_rank > 1000) { profile_rank_index = 8; }
								let profile_rank_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/trophies/" + profile_rank_index + ".png", "rank_" + profile_rank_index + ".png");
								
								let profile_name = profile_data.username;
								let profile_header = profile_moderator + profile_rank_string;

								let profile_stars = "<:gd_star:823042179374120960> " + client.functions.number_formatter(profile_data.stars, 2) + " | ";
								let profile_diamonds = "<:gd_diamond:823042795148148796> " + client.functions.number_formatter(profile_data.diamonds, 2) + " | ";
								let profile_coins = "<:gd_coin:823042793739386920> " + client.functions.number_formatter(profile_data.coins, 2) + " | ";
								let profile_usercoins = "<:gd_silver_coin:823042425953976321> " + client.functions.number_formatter(profile_data.userCoins, 2) + " | ";
								let profile_demons = "<:gd_hard_demon:816469080872976405> " + client.functions.number_formatter(profile_data.demons, 2);
								let profile_creatorpoints = (profile_data.cp > 0) ? (" | " + "<:gd_creator_points:823153273711362059> " + client.functions.number_formatter(profile_data.cp, 2)) : "";
								let profile_info = profile_stars + profile_diamonds + profile_coins + profile_usercoins + profile_demons + profile_creatorpoints;
								
								let profile_youtube = (profile_data.youtube !== null) ? ("<:gd_youtube:823606174565662731> " + "[Youtube Channel](https://youtube.com/channel/" + profile_data.youtube + ")" + "\n") : "";
								let profile_twitter = (profile_data.twitter !== null) ? ("<:gd_twitter:823606175231770674> " + "[Twitter Account](https://twitter.com/" + profile_data.twitter + ")" + "\n") : "";
								let profile_twitch = (profile_data.twitch !== null) ? ("<:gd_twitch:823606175613321246> " + "[Twitch](https://twitch.tv/" + profile_data.twitch + ")" + "\n") : "";
								let profile_socials = profile_youtube + profile_twitter + profile_twitch;
								// 
								let profile_friends = profile_data.friendRequests ? "<:gd_friends:823765982198759516> Friend requests enabled." : "<:gd_friends_grey:823765982077517854> Friend requests disabled.";
								let profile_messages = "<:gd_messages:823765981313761351> Messages from Everyone.";
								switch (profile_data.messages) {
									case "friends": { profile_messages = "<:gd_messages_yellow:823765982195089439> Messages from friends."; break; }
									case "off": { profile_messages = "<:gd_messages_grey:823765981981442089> No messages."; break; }
								}
								let profile_commenthistory = "<:gd_comments:823765980961439754> Comment history public.";
								switch (profile_data.messages) {
									case "friends": { profile_commenthistory = "<:gd_comments_yellow:823765981184393216> Comment history to friends."; break; }
									case "off": { profile_commenthistory = "<:gd_comments_grey:823765981158834177> Comment history private."; break; }
								}
								let profile_options = profile_friends + "\n" + profile_messages + "\n" + profile_commenthistory;
								
								var embed = new Discord.MessageEmbed();
								embed.attachFiles([profile_rank_image]);
								embed.setThumbnail("attachment://" + "rank_" + profile_rank_index + ".png");
								embed.setTitle(profile_header);
								embed.setDescription(profile_info + (profile_socials.length ? ("\n\n" + profile_socials) : "") + "\n\n" + profile_options);
								embed.setAuthor(profile_name, "https://gdbrowser.com/icon/" + profile_data.playerID);
								return message.channel.send(embed);
							}
							else {
								var embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.profile.no_data"));
								embed.setColor([255, 0, 0]);
								return message.channel.send(embed);
							}
						})
					}).on("error", async (error) => {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gd.profile.failure"));
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
const Discord = require("discord.js");
const path = require("path");
const https = require("https");
module.exports = {
	name: "gd",
	path: path.basename(__dirname),
    cooldown: 6,
	description: "gd.usage",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
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
		];
		
		let raw_data = "";
		let api_url = "https://gdbrowser.com/api/";
		let subcommand = args[0];
		if (!subcommand) {
			let gd_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/gd_icon.png", "gd_icon.png");
			let embed = new Discord.MessageEmbed();
			embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.author"), "https://gdbrowser.com/icon/colon", "https://gdbrowser.com/api");
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.title"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.help"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.help.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.search"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.search.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.level"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.level.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.profile"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.profile.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.comments"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.comments.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.map_packs"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.map_packs.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.gauntlets"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.gauntlets.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.leaderboard"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.leaderboard.description"));
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.song"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "usage.song.description"));
			embed.attachFiles([gd_image]);
			embed.setThumbnail("attachment://gd_icon.png");
			embed.setColor([254, 223, 0]);
			return message.channel.send({embed: embed});
		}
		else {
			switch (subcommand) {
				case "help": {
					let help_command = args[1];
					if (!help_command) {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.no_command"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});
					}
					
					switch (help_command) {
						case "search": {
							let gd_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/gd_icon.png", "gd_icon.png");
							let embed = new Discord.MessageEmbed();
							embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.title", [prefix]));
							embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.page"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.page.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.difficulty"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.difficulty.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.length"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.length.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.count"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.count.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.song_id"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.song_id.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.custom_song"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.custom_song.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.list"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.list.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.creators"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.creators.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.user"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.user.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.type"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.type.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.featured"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.featured.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.original"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.original.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.two_player"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.two_player.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.coins"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.coins.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.epic"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.epic.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.starred"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.starred.description"));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.no_star"), client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.search.no_star.description"));
							embed.setColor([254, 223, 0]);
							embed.attachFiles([gd_image]);
							embed.setThumbnail("attachment://gd_icon.png");
							return message.channel.send({embed: embed});
						}
						
						default: {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "help.invalid_command"));
							embed.setColor([255, 0, 0]);
							return message.channel.send({embed: embed});
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

							for (let string_index = 0; string_index < filters_arguments.length; string_index++) {
								search_query += "%20" + filters_arguments[string_index];
								if (filters_arguments[string_index].startsWith("/")) {
									break;
								}
							}
							search_query = search_query.replaceAll("\"", "");
						}
						else { search_query = "*"; }
						
						for (let filters_index = 0; filters_index < filters_arguments.length; filters_index++) {
							let filter_element = filters_arguments[filters_index];
							let filter_argument = "";
							
							// Flags
							if (filter_element.startsWith("/featured")) { search_filters += filter_prefix + "featured=yes"; filter_prefix = "&"; } // Featured
							if (filter_element.startsWith("/original")) { search_filters += filter_prefix + "original=yes"; filter_prefix = "&"; } // Original
							if (filter_element.startsWith("/twoPlayer")) { search_filters += filter_prefix + "twoPlayer=yes"; filter_prefix = "&"; } // Two Player
							if (filter_element.startsWith("/coins")) { search_filters += filter_prefix + "coins=yes"; filter_prefix = "&"; } // Coins
							if (filter_element.startsWith("/epic")) { search_filters += filter_prefix + "epic=yes"; filter_prefix = "&"; } // Epic
							if (filter_element.startsWith("/starred")) { search_filters += filter_prefix + "starred=yes"; filter_prefix = "&"; } // Starred
							if (filter_element.startsWith("/noStar")) { search_filters += filter_prefix + "noStar=yes"; filter_prefix = "&"; } // No Star
							
							// Search types
							if (filter_element.startsWith("/type=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								switch (filter_argument.toLowerCase()) {
									case "mostdownloaded": { search_filters += filter_prefix + "type=mostdownloaded"; filter_prefix = "&"; break; }
									case "mostliked": { search_filters += filter_prefix + "type=mostliked"; filter_prefix = "&"; break; }
									case "trending": { search_filters += filter_prefix + "type=trending"; filter_prefix = "&"; break; }
									case "recent": { search_filters += filter_prefix + "type=recent"; filter_prefix = "&"; break; }
									case "awarded": { search_filters += filter_prefix + "type=awarded"; filter_prefix = "&"; break; }
									case "featured": { search_filters += filter_prefix + "type=featured"; filter_prefix = "&"; break; }
									case "magic": { search_filters += filter_prefix + "type=magic"; filter_prefix = "&"; break; }
									case "halloffame": { search_filters += filter_prefix + "type=halloffame"; filter_prefix = "&"; break; }
								}
							}
							
							// Custom Song ID
							if (filter_element.startsWith("/customSong=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "customSong=" + filter_argument;
								filter_prefix = "&"; 
							}
							
							// User
							if (filter_element.startsWith("/user=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "user=" + filter_argument;
								filter_prefix = "&"; 
							}
							
							// Creators
							if (filter_element.startsWith("/creators=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "creators=" + filter_argument;
								filter_prefix = "&"; 
							}
							
							// List
							if (filter_element.startsWith("/list=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								search_filters += filter_prefix + "list=" + filter_argument;
								filter_prefix = "&"; 
							}
							
							// Official Song ID
							if (filter_element.startsWith("/songID=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let size_number = Number(filter_argument);
								if (Number.isNaN(size_number)) {
									switch (filter_argument.toLowerCase()) {
										case "stereo_madness": { search_filters += filter_prefix + "songID=1"; filter_prefix = "&"; break; }
										case "back_on_track": { search_filters += filter_prefix + "songID=2"; filter_prefix = "&"; break; }
										case "polargeist": { search_filters += filter_prefix + "songID=3"; filter_prefix = "&"; break; }
										case "dry_out": { search_filters += filter_prefix + "songID=4"; filter_prefix = "&"; break; }
										case "base_after_base": { search_filters += filter_prefix + "songID=5"; filter_prefix = "&"; break; }
										case "cant_let_go": { search_filters += filter_prefix + "songID=6"; filter_prefix = "&"; break; }
										case "jumper": { search_filters += filter_prefix + "songID=7"; filter_prefix = "&"; break; }
										case "time_machine": { search_filters += filter_prefix + "songID=8"; filter_prefix = "&"; break; }
										case "cycles": { search_filters += filter_prefix + "songID=9"; filter_prefix = "&"; break; }
										case "xstep": { search_filters += filter_prefix + "songID=10"; filter_prefix = "&"; break; }
										case "clutterfunk": { search_filters += filter_prefix + "songID=11"; filter_prefix = "&"; break; }
										case "theory_of_everything": { search_filters += filter_prefix + "songID=12"; filter_prefix = "&"; break; }
										case "electroman_adventures": { search_filters += filter_prefix + "songID=13"; filter_prefix = "&"; break; }
										case "clubstep": { search_filters += filter_prefix + "songID=14"; filter_prefix = "&"; break; }
										case "electrodynamix": { search_filters += filter_prefix + "songID=15"; filter_prefix = "&"; break; }
										case "hexagon_force": { search_filters += filter_prefix + "songID=16"; filter_prefix = "&"; break; }
										case "blast_processing": { search_filters += filter_prefix + "songID=17"; filter_prefix = "&"; break; }
										case "theory_of_everything_2": { search_filters += filter_prefix + "songID=18"; filter_prefix = "&"; break; }
										case "geometrical_dominator": { search_filters += filter_prefix + "songID=19"; filter_prefix = "&"; break; }
										case "deadlocked": { search_filters += filter_prefix + "songID=20"; filter_prefix = "&"; break; }
										case "fingerdash": { search_filters += filter_prefix + "songID=21"; filter_prefix = "&"; break; }
									}
								}
								else {
									switch (size_number) {
										case 1: { search_filters += filter_prefix + "songID=1"; filter_prefix = "&"; break; }
										case 2: { search_filters += filter_prefix + "songID=2"; filter_prefix = "&"; break; }
										case 3: { search_filters += filter_prefix + "songID=3"; filter_prefix = "&"; break; }
										case 4: { search_filters += filter_prefix + "songID=4"; filter_prefix = "&"; break; }
										case 5: { search_filters += filter_prefix + "songID=5"; filter_prefix = "&"; break; }
										case 6: { search_filters += filter_prefix + "songID=6"; filter_prefix = "&"; break; }
										case 7: { search_filters += filter_prefix + "songID=7"; filter_prefix = "&"; break; }
										case 8: { search_filters += filter_prefix + "songID=8"; filter_prefix = "&"; break; }
										case 9: { search_filters += filter_prefix + "songID=9"; filter_prefix = "&"; break; }
										case 10: { search_filters += filter_prefix + "songID=10"; filter_prefix = "&"; break; }
										case 11: { search_filters += filter_prefix + "songID=11"; filter_prefix = "&"; break; }
										case 12: { search_filters += filter_prefix + "songID=12"; filter_prefix = "&"; break; }
										case 13: { search_filters += filter_prefix + "songID=13"; filter_prefix = "&"; break; }
										case 14: { search_filters += filter_prefix + "songID=14"; filter_prefix = "&"; break; }
										case 15: { search_filters += filter_prefix + "songID=15"; filter_prefix = "&"; break; }
										case 16: { search_filters += filter_prefix + "songID=16"; filter_prefix = "&"; break; }
										case 17: { search_filters += filter_prefix + "songID=17"; filter_prefix = "&"; break; }
										case 18: { search_filters += filter_prefix + "songID=18"; filter_prefix = "&"; break; }
										case 19: { search_filters += filter_prefix + "songID=19"; filter_prefix = "&"; break; }
										case 20: { search_filters += filter_prefix + "songID=20"; filter_prefix = "&"; break; }
										case 21: { search_filters += filter_prefix + "songID=21"; filter_prefix = "&"; break; }
									}
								}
							}
							
							// Length
							if (filter_element.startsWith("/length=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let size_number = Number(filter_argument);
								if (Number.isNaN(size_number)) {
									switch (filter_argument.toLowerCase()) {
										case "tiny": { search_filters += filter_prefix + "length=0"; filter_prefix = "&"; break; }
										case "short": { search_filters += filter_prefix + "length=1"; filter_prefix = "&"; break; }
										case "medium": { search_filters += filter_prefix + "length=2"; filter_prefix = "&"; break; }
										case "long": { search_filters += filter_prefix + "length=3"; filter_prefix = "&"; break; }
										case "xl": { search_filters += filter_prefix + "length=4"; filter_prefix = "&"; break; }
									}
								}
								else {
									switch (size_number) {
										case 0: { search_filters += filter_prefix + "length=0"; filter_prefix = "&"; break; }
										case 1: { search_filters += filter_prefix + "length=1"; filter_prefix = "&"; break; }
										case 2: { search_filters += filter_prefix + "length=2"; filter_prefix = "&"; break; }
										case 3: { search_filters += filter_prefix + "length=3"; filter_prefix = "&"; break; }
										case 4: { search_filters += filter_prefix + "length=4"; filter_prefix = "&"; break; }
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
									filter_prefix = "&"; 
								}
							}
							
							// Page
							if (filter_element.startsWith("/page=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let search_count = Number(filter_argument);
								if (!Number.isNaN(search_count)) {
									search_filters += filter_prefix + "page=" + search_count;
								}
								else {
									search_filters += filter_prefix + "page=1";
								}
								filter_prefix = "&"; 
							}
							
							// Difficulty
							if (filter_element.startsWith("/difficulty=")) {
								filter_argument = filter_element.split("=").slice(1).join("");
								let difficulty_number = Number(filter_argument);
								if (Number.isNaN(difficulty_number)) {
									switch (filter_argument.toLowerCase()) {
										case "na": { search_filters += filter_prefix + "diff=-1"; filter_prefix = "&"; break; }
										case "auto": { search_filters += filter_prefix + "diff=-3"; filter_prefix = "&"; break; }
										case "easy": { search_filters += filter_prefix + "diff=1"; filter_prefix = "&"; break; }
										case "normal": { search_filters += filter_prefix + "diff=2"; filter_prefix = "&"; break; }
										case "hard": { search_filters += filter_prefix + "diff=3"; filter_prefix = "&"; break; }
										case "harder": { search_filters += filter_prefix + "diff=4"; filter_prefix = "&"; break; }
										case "insane": { search_filters += filter_prefix + "diff=5"; filter_prefix = "&"; break; }
										case "easy_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=1"; filter_prefix = "&"; break; }
										case "medium_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=2"; filter_prefix = "&"; break; }
										case "hard_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=3"; filter_prefix = "&"; break; }
										case "insame_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=4"; filter_prefix = "&"; break; }
										case "extreme_demon": { search_filters += filter_prefix + "diff=-2&demonFilter=5"; filter_prefix = "&"; break; }
									}
								}
								else {
									switch (difficulty_number) {
										case 0: { search_filters += filter_prefix + "diff=-1"; filter_prefix = "&"; break; }
										case 1: { search_filters += filter_prefix + "diff=-3"; filter_prefix = "&"; break; }
										case 2: { search_filters += filter_prefix + "diff=1"; filter_prefix = "&"; break; }
										case 3: { search_filters += filter_prefix + "diff=2"; filter_prefix = "&"; break; }
										case 4: { search_filters += filter_prefix + "diff=3"; filter_prefix = "&"; break; }
										case 5: { search_filters += filter_prefix + "diff=4"; filter_prefix = "&"; break; }
										case 6: { search_filters += filter_prefix + "diff=5"; filter_prefix = "&"; break; }
										case 7: { search_filters += filter_prefix + "diff=-2&demonFilter=1"; filter_prefix = "&"; break; }
										case 8: { search_filters += filter_prefix + "diff=-2&demonFilter=2"; filter_prefix = "&"; break; }
										case 9: { search_filters += filter_prefix + "diff=-2&demonFilter=3"; filter_prefix = "&"; break; }
										case 10: { search_filters += filter_prefix + "diff=-2&demonFilter=4"; filter_prefix = "&"; break; }
										case 11: { search_filters += filter_prefix + "diff=-2&demonFilter=5"; filter_prefix = "&"; break; }
									}
								}
							}
						}
					}
					if (!filters_custom_count) { search_filters += filter_prefix + "count=5"; }
					
					let complete_url = api_url + "search/" + search_query + search_filters;
					console.log(complete_url);
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; });
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let levels_data = JSON.parse(raw_data);
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
									let level_song = "<:gd_note:823153052495249448> " + (level_element.songLink ? ("[" + level_element.songName + "]" + "(" + level_element.songLink + ")") : level_element.songName);
									let level_description = level_difficulty + " " + level_rated + " " + level_large + "\n" + level_author + level_author_specials;
									
									let level_stars = (level_element.stars > 0) ? ("<:gd_star:823042179374120960> " + level_element.stars + " | ") : "";
									let level_totalcoins = (level_coins.length ? (level_coins + " | ") : "");
									let level_downloads = "<:gd_download:816466814930255872> " + client.functions.getFormattedNumber(level_element.downloads, 2);
									let level_likes = (level_element.disliked ? "<:gd_dislike:816467209366011955> " : "<:gd_like:816467236117020693> ") + client.functions.getFormattedNumber(level_element.likes, 2);
									let level_orbs = (level_element.orbs > 0) ? ("<:gd_orbs:823042795446730762> " + level_element.orbs + " | ") : "";
									let level_duration = "<:gd_time:823043610026967060> " + level_element.length;
									let level_objects = "<:gd_object:823395350315794452> " + ((level_element.objects > 0) ? client.functions.getFormattedNumber(level_element.objects, 2) : "NA");
									let level_gdversion = "Game version: " + level_element.gameVersion;
									let level_version = "Level version: " + level_element.version;
									let level_stats = level_downloads + " | " + level_likes + " | " + level_orbs + level_duration + "\n" + level_stars + level_totalcoins + " | " + level_objects;
									
									let level_information = level_description + "\n" + level_stats + "\n" + level_song;
									embed.addField(level_header, level_information);
								}
								embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "search.title", [levels_data[0].results, levels_data[0].pages]));
								embed.attachFiles([search_image, gd_image]);
								embed.setThumbnail("attachment://search.png");
								embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "search.author"), "attachment://gd_icon.png");
								embed.setColor([254, 223, 0]);
								return message.channel.send({embed: embed});
							}
							else {
								let embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "search.not_found"));
								embed.setColor([255, 0, 0]);
								return message.channel.send({embed: embed});
							}
						});
					}).on("error", async (error) => {
						throw error;

						/*let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "search.failure"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});*/
					});
					break;
				}
				
				case "level": {
					if (!args[1]) {
						var embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "level.no_argument"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});
					}
					
					let level_id = args[1];
					let complete_url = api_url + "level/" + level_id;
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; });
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let level_data = JSON.parse(raw_data);

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
								let level_downloads = "<:gd_download:816466814930255872> " + client.functions.getFormatedString(level_data.downloads, 2);
								let level_likes = (level_data.disliked ? "<:gd_dislike:816467209366011955> " : "<:gd_like:816467236117020693> ") + client.functions.getFormatedString(level_data.likes, 2);
								let level_orbs = (level_data.orbs > 0) ? ("<:gd_orbs:823042795446730762> " + level_data.orbs + " | ") : "";
								let level_duration = "<:gd_time:823043610026967060> " + level_data.length;
								let level_objects = "<:gd_object:823395350315794452> " + ((level_data.objects > 0) ? client.functions.getFormatedString(level_data.objects, 2) : "NA");
								let level_gdversion = "Game version: " + level_data.gameVersion;
								let level_version = "Level version: " + level_data.version;
								let level_stats = level_downloads + " | " + level_likes + " | " + level_orbs + level_duration + "\n" + level_stars + level_totalcoins + level_objects;
								
								let level_song_link = "<:gd_note:823153052495249448> " + (level_data.songLink ? ("[" + level_data.songName + "]" + "(" + level_data.songLink + ")") : level_data.songName);
								let level_song_author = ("[" + level_data.songAuthor + "]" + "(" + "https://" + level_data.songAuthor + ".newgrounds.com" + ")");
								let level_song_size = (level_data.songLink ? ("\n" + "Size: " + level_data.songSize + " - " + "ID: " + level_data.songID) : "");
								let level_song = level_song_link + " - " + level_song_author + level_song_size;
								
								let level_information = level_data.description + "\n\n" + level_stats + "\n" + level_song + "\n\n" + level_gdversion + "\n" + level_version;
								
								var difficulty_image = new Discord.MessageAttachment(process.cwd() + "/assets/images/geometrydash/difficulties/" + level_data.difficultyFace + ".png", level_data.difficultyFace + ".png");
								let embed = new Discord.MessageEmbed();
								embed.setColor(diff_to_color.find(element => element.id === level_data.difficulty).color);
								embed.attachFiles([difficulty_image]);
								embed.setThumbnail("attachment://" + level_data.difficultyFace + ".png");
								embed.setAuthor(level_author, "https://gdbrowser.com/icon/" + level_data.playerID);
								embed.setTitle(level_header);
								embed.setDescription(level_information);
								return message.channel.send({embed: embed});
							}
							else {
								let embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "level.no_data"));
								embed.setColor([255, 0, 0]);
								return message.channel.send({embed: embed});
							}
						});
					}).on("error", async (error) => {
						throw error;

						/*let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "level.failure"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});*/
					});
					break;
				}
				
				case "profile": {
					if (!args[1]) {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "profile.no_argument"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});
					}
					
					let profile_id = args.slice(1).join(" ");
					let complete_url = api_url + "profile/" + profile_id;
					https.get(complete_url, async (response) => {
						response.on("data", async (chunk) => { raw_data += chunk; });
						response.on("end", async () => {
							if (raw_data !== "-1") {
								let profile_data = JSON.parse(raw_data);

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

								let profile_stars = "<:gd_star:823042179374120960> " + client.functions.getFormatedString(profile_data.stars, 2) + " | ";
								let profile_diamonds = "<:gd_diamond:823042795148148796> " + client.functions.getFormatedString(profile_data.diamonds, 2) + " | ";
								let profile_coins = "<:gd_coin:823042793739386920> " + client.functions.getFormatedString(profile_data.coins, 2) + " | ";
								let profile_usercoins = "<:gd_silver_coin:823042425953976321> " + client.functions.getFormatedString(profile_data.userCoins, 2) + " | ";
								let profile_demons = "<:gd_hard_demon:816469080872976405> " + client.functions.getFormatedString(profile_data.demons, 2);
								let profile_creatorpoints = (profile_data.cp > 0) ? (" | " + "<:gd_creator_points:823153273711362059> " + client.functions.getFormatedString(profile_data.cp, 2)) : "";
								let profile_info = profile_stars + profile_diamonds + profile_coins + profile_usercoins + profile_demons + profile_creatorpoints;
								
								let profile_youtube = (profile_data.youtube !== null) ? ("<:gd_youtube:823606174565662731> " + "[Youtube Channel](https://youtube.com/channel/" + profile_data.youtube + ")" + "\n") : "";
								let profile_twitter = (profile_data.twitter !== null) ? ("<:gd_twitter:823606175231770674> " + "[Twitter Account](https://twitter.com/" + profile_data.twitter + ")" + "\n") : "";
								let profile_twitch = (profile_data.twitch !== null) ? ("<:gd_twitch:823606175613321246> " + "[Twitch](https://twitch.tv/" + profile_data.twitch + ")" + "\n") : "";
								let profile_socials = profile_youtube + profile_twitter + profile_twitch;

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
								
								let embed = new Discord.MessageEmbed();
								embed.attachFiles([profile_rank_image]);
								embed.setThumbnail("attachment://" + "rank_" + profile_rank_index + ".png");
								embed.setTitle(profile_header);
								embed.setDescription(profile_info + (profile_socials.length ? ("\n\n" + profile_socials) : "") + "\n\n" + profile_options);
								embed.setAuthor(profile_name, "https://gdbrowser.com/icon/" + profile_data.playerID);
								return message.channel.send({embed: embed});
							}
							else {
								let embed = new Discord.MessageEmbed();
								embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "profile.no_data"));
								embed.setColor([255, 0, 0]);
								return message.channel.send({embed: embed});
							}
						});
					}).on("error", async (error) => {
						throw error;

						/*let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "profile.failure"));
						embed.setColor([255, 0, 0]);
						return message.channel.send({embed: embed});*/
					});
					break;
				}
				
				default: {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/gd", "invalid_subcommand", [prefix]));
					embed.setColor([255, 0, 0]);
					return message.channel.send({embed: embed});
				}
			}
		}
	},
};
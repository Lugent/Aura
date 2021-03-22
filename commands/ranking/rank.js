const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "rank",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "command.rank.usage",
	description: "command.rank.desc",
    async execute(client, message, args)
    {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.utils.getTrans(client, message.author, message.guild, "command.rank.warning.noguild"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.rank.error.disabled"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		
		let get_member = message.member;
		let members = await client.fetchers.getGuildMembers(client, message.guild);
		if (args[0]) {
			let mentioned_member = message.mentions.members.first();
			let search_member = get_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length));
			get_member = mentioned_member || search_member || members.find(member => member.id === args[0]);
		}
		
		if (!get_member) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.rank.error.nomember"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (get_member.user.bot) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.rank.error.bot"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		let get_rank = 0;
		let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(message.guild.id); //client.server_level.list.all(message.guild.id);
		for (let level_index = 0; level_index < levels_database.length; level_index++) {
			if (get_member.user.id === levels_database[level_index].user_id) {
				get_rank = level_index;
				break;
			}
		}
		
		let get_level = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(message.guild.id, get_member.user.id); //client.server_level.select.get(message.guild.id, get_member.user.id);
		let level_index = get_level.level;
		if (level_index > client.config.exp_level_max) { level_index = client.config.exp_level_max; }
		
		let next_level = level_index + 1;
		if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }
		
		let exp_score_base = client.config.exp_score_base;
		let score_actual = (level_index * level_index) * exp_score_base;
		let score_goal = (next_level * next_level) * exp_score_base;
		
		let image_data_width = 1200;
		let image_data_height = 400;
		
		let image_data_avatar_padding = 40;
		let image_data_avatar_size = 240;
		let image_data_rank_back_padding = 60;
		let image_data_rank_back_size = 384 - 64;
		let image_data_rank_front_padding = 40;
		let image_data_rank_front_size = 256;
		let image_data_left = image_data_avatar_padding;
		let image_data_right = (image_data_width - image_data_rank_back_size) - image_data_rank_back_padding;
		let image_data_right2 = (image_data_width - image_data_rank_front_size) - image_data_rank_front_padding;
		let image_data_position = image_data_left;
		
		let image_data_bar_padding = (image_data_avatar_padding - 8);
		let image_data_bar_padding_text = image_data_avatar_padding;
		let image_data_bar_vertical = image_data_height - (28 * 2);
		let image_data_bar_length = (image_data_width) - (image_data_avatar_padding * 2);
		let image_data_bar_fill_length = ((get_level.score - score_actual) / (score_goal - score_actual)) * image_data_bar_length;
		if (image_data_bar_fill_length < 40) { image_data_bar_fill_length = 40; }
		if (image_data_bar_fill_length > image_data_bar_length) { image_data_bar_fill_length = image_data_bar_length; }
		if (level_index >= client.config.exp_level_max) { image_data_bar_fill_length = image_data_bar_length; }
		
		const Canvas = require("canvas");
		Canvas.registerFont(process.cwd() + "/assets/fonts/xirod.ttf", {family: "xirod"});
		
		let image_canvas = Canvas.createCanvas(image_data_width, image_data_height);
		let image_context = image_canvas.getContext("2d");
		image_context.patternQuality = "nearest";
		image_context.quality = "nearest";
		image_context.imageSmoothingEnabled = false;

		// Level table
		let rank_image = await client.functions.generateRankIcon(client, Canvas, level_index);
		let rank_front_image = rank_image.rank_front_image;
		let rank_back_image = rank_image.rank_back_image;
		
		/*let level_table = client.config.exp_shield_table;
		let rank_front_image = undefined;
		let rank_back_image = undefined;
		let get_backlayer = level_table.find(level_table_index => level_index >= level_table_index.level)
		if (get_backlayer) { rank_back_image = await Canvas.loadImage(process.cwd() + "/data/images/rank/rank_back_icon_" + get_backlayer.type + ".png"); }
		if (level_index > -1) { rank_front_image = await Canvas.loadImage(process.cwd() + "/data/images/rank/rank_front_icon_" + (level_index % 60) + ".png"); }
		if (level_index >= client.config.exp_level_max) { rank_front_image = await Canvas.loadImage(process.cwd() + "/data/images/rank/rank_front_icon_60.png"); }*/

		// Images
		let avatar_image = await Canvas.loadImage(get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128})); // 4096
		if (rank_back_image) { image_context.drawImage(rank_back_image, image_data_right, 4, image_data_rank_back_size, image_data_rank_back_size) }
		if (rank_front_image) { image_context.drawImage(rank_front_image, image_data_right + 34, 4 + 40, image_data_rank_front_size, image_data_rank_front_size) }
		
		image_context.lineWidth = 6;
		image_context.strokeStyle = "rgb(255, 255, 255)";
		image_context.strokeRect(image_data_position - 4, image_data_avatar_padding - 4, image_data_avatar_size + 8, image_data_avatar_size + 8);
		image_context.drawImage(avatar_image, image_data_position, image_data_avatar_padding, image_data_avatar_size, image_data_avatar_size);
		
		// String - Name
		let target_xp = client.functions.number_formatter(score_goal, 2);
		if (level_index >= client.config.exp_level_max) { target_xp = client.utils.getTrans(client, message.author, message.guild, "command.rank.image.xp.max"); }
		image_context.font = "48px xirod";
		image_context.textAlign = "left";
		image_context.textBaseline = "bottom";
		image_context.fillStyle = "rgb(255, 255, 255)";
		image_context.fillText(client.functions.number_formatter(get_level.score, 2) + " / " + target_xp + " " + client.utils.getTrans(client, message.author, message.guild, "command.rank.image.xp"), image_data_bar_padding_text, image_data_bar_vertical - 4);
		
		// String - Score
		image_context.font = "48px xirod";
		image_context.textAlign = "left";
		image_context.textBaseline = "top";
		image_context.fillStyle = "rgb(255, 255, 255)";
		image_context.fillText(client.utils.getTrans(client, message.author, message.guild, "command.rank.image.level") + ". " + level_index + " / " + client.config.exp_level_max, (image_data_avatar_padding + image_data_avatar_size) + 20, image_data_bar_padding);
		image_context.fillText("Rank" + " " + (get_rank + 1), (image_data_avatar_padding + image_data_avatar_size) + 20, image_data_bar_padding + 50);
		
		// Progress bar - Container
		image_context.beginPath();
		image_context.moveTo(image_data_bar_padding, image_data_bar_vertical + 20);
		image_context.lineTo(image_data_bar_padding + 20, image_data_bar_vertical);
		image_context.lineTo((image_data_bar_padding + image_data_bar_length) - 20, image_data_bar_vertical);
		image_context.lineTo((image_data_bar_padding + image_data_bar_length), image_data_bar_vertical + 20);
		image_context.lineTo((image_data_bar_padding + image_data_bar_length) - 20, image_data_bar_vertical + 40);
		image_context.lineTo(image_data_bar_padding + 20, image_data_bar_vertical + 40);
		image_context.lineTo(image_data_bar_padding, image_data_bar_vertical + 20);
		image_context.clip();
		image_context.fillStyle = "rgb(0, 0, 80)";
		image_context.fillRect(image_data_bar_padding, image_data_bar_vertical, image_data_bar_length, 40);
		
		// Progress bar - Fill
		image_context.beginPath();
		image_context.moveTo(image_data_bar_padding + 8, image_data_bar_vertical + 20);
		image_context.lineTo(image_data_bar_padding + 20, image_data_bar_vertical + 8);
		image_context.lineTo((image_data_bar_padding + image_data_bar_fill_length) - 20, image_data_bar_vertical + 8);
		image_context.lineTo((image_data_bar_padding + image_data_bar_fill_length) - 8, image_data_bar_vertical + 20);
		image_context.lineTo((image_data_bar_padding + image_data_bar_fill_length) - 20, image_data_bar_vertical + (40 - 8));
		image_context.lineTo(image_data_bar_padding + 20, image_data_bar_vertical + (40 - 8));
		image_context.lineTo(image_data_bar_padding + 8, image_data_bar_vertical + 20);
		image_context.clip();
		image_context.fillStyle = "rgb(0, 124, 177)";
		image_context.fillRect(image_data_bar_padding, image_data_bar_vertical, image_data_bar_length, 40);
		
		// Upload file
		var attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "rank.png"); 
		var embed = new Discord.MessageEmbed();
		embed.attachFiles(attachment);
		embed.setAuthor(client.utils.getTrans(client, message.author, message.guild, "command.rank.embed.title", [get_member.user.tag]), get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}));
		embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.rank.embed.footer") + ": " + message.guild.name, message.guild.iconURL());
		embed.setImage("attachment://" + attachment.name);
		embed.setColor(0x66b3ff);
		return message.channel.send(embed);
    }
};
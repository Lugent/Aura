const Discord = require("discord.js");
async function exp_handler(client, message) {
	if (message.author.bot) { return; }
	
	if (message.guild) {
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) { return; }
		
		if (client.exp_cooldowns.has(message.author.id)) { return; }
		
		let get_level_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(message.guild.id, message.author.id);
		let get_level = get_level_data;
		if (!get_level) { get_level = {guild_id: message.guild.id, user_id: message.author.id, level: 0, score: 0, messages: 0} }
		get_level.score += client.functions.getRandomInt(client.config.exp_gainrate);
		get_level.messages++;
		
		let previous_level = get_level.level;
		let next_level = get_level.level + 1;
		let exp_score_base = client.config.exp_score_base;
		let score_goal = (next_level * next_level) * exp_score_base;
		let score_max = (client.config.exp_level_max * client.config.exp_level_max) * exp_score_base;
		let finished_level = false;
		while (!finished_level) {
			if ((next_level <= client.config.exp_level_max) && (get_level.score > score_goal)) {
				get_level.level = next_level;
				next_level = get_level.level + 1;
				exp_score_base = client.config.exp_score_base;
				score_goal = (next_level * next_level) * exp_score_base;
			}
			else { finished_level = true; }
		}
		
		if (get_level.score > score_max) { get_level.score = score_max; }
		if (!get_level_data) { client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(get_level.guild_id, get_level.user_id, get_level.level, get_level.score, get_level.messages); }
		else { client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id); }
		client.exp_cooldowns.set(message.author.id, "active");
		setTimeout(() => client.exp_cooldowns.delete(message.author.id), client.config.exp_cooldown);
		
		if (get_level.level > previous_level) {
			let get_member = message.member;
			let level_index_old = previous_level;
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
			let image_data_left = image_data_rank_back_padding;
			let image_data_left2 = image_data_rank_front_padding;
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
			//let level_table = client.config.exp_shield_table;
			/*let rank_front_image_old = undefined;
			let rank_back_image_old = undefined;
			let get_backlayer_old = level_table.find(level_table_index => level_index_old >= level_table_index.level)
			if (get_backlayer_old) { rank_back_image_old = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/backlayer/rank_back_icon_" + get_backlayer_old.type + ".png"); }
			if (level_index_old > -1) { rank_front_image_old = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_" + (level_index_old % 60) + ".png"); }
			if (level_index_old >= client.config.exp_level_max) { rank_front_image_old = await Canvas.loadImage(process.cwd() + "/data/images/ranking/frontlayer/rank_front_icon_60.png"); }*/
			
			let rank_image = await client.functions.generateRankIcon(client, Canvas, level_index);
			let rank_image_old = await client.functions.generateRankIcon(client, Canvas, level_index_old);
			let rank_back_image = rank_image.rank_back_image;
			let rank_front_image = rank_image.rank_front_image;
			let rank_back_image_old = rank_image_old.rank_back_image;
			let rank_front_image_old = rank_image_old.rank_front_image;
			
			/*let rank_front_image = undefined;
			let rank_back_image = undefined;
			let get_backlayer = level_table.find(level_table_index => level_index >= level_table_index.level)
			if (get_backlayer) { rank_back_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/backlayer/rank_back_icon_" + get_backlayer.type + ".png"); }
			if (level_index > -1) { rank_front_image = await Canvas.loadImage(process.cwd() + "/assets/images/ranking/frontlayer/rank_front_icon_" + (level_index % 60) + ".png"); }
			if (level_index >= client.config.exp_level_max) { rank_front_image = await Canvas.loadImage(process.cwd() + "/data/images/ranking/frontlayer/rank_front_icon_60.png"); }*/

			// Images
			if (rank_back_image) { image_context.drawImage(rank_back_image, image_data_right, 4, image_data_rank_back_size, image_data_rank_back_size) }
			if (rank_front_image) { image_context.drawImage(rank_front_image, image_data_right + 34, 4 + 40, image_data_rank_front_size, image_data_rank_front_size) }
			if (rank_back_image_old) { image_context.drawImage(rank_back_image_old, image_data_left, 4, image_data_rank_back_size, image_data_rank_back_size) }
			if (rank_front_image_old) { image_context.drawImage(rank_front_image_old, image_data_left2 + 54, 4 + 40, image_data_rank_front_size, image_data_rank_front_size) }
			
			// String - Levels
			image_context.font = "48px xirod";
			image_context.textAlign = "center";
			image_context.textBaseline = "top";
			image_context.fillStyle = "rgb(255, 255, 255)";
			image_context.fillText(client.utils.getTrans(client, message.author, message.guild, "exphandler.levelup.image.level") + ". " + level_index_old, image_data_rank_back_padding + (image_data_rank_back_size / 2), image_data_bar_vertical - 4);
			image_context.fillText(client.utils.getTrans(client, message.author, message.guild, "exphandler.levelup.image.level") + ". " + level_index, image_data_width - (image_data_rank_back_padding + (image_data_rank_back_size / 2)), image_data_bar_vertical - 4);
			
			// Arrow
			image_context.beginPath();
			image_context.moveTo(image_data_width / 2, (image_data_rank_back_size / 2));
			image_context.lineTo((image_data_width / 2) - 96, 4);
			image_context.lineTo((image_data_width / 2), 4);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_back_size / 2));
			image_context.moveTo(image_data_width / 2, (image_data_rank_back_size / 2));
			image_context.lineTo((image_data_width / 2) - 96, image_data_rank_back_size);
			image_context.lineTo((image_data_width / 2), image_data_rank_back_size);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_back_size / 2));
			image_context.clip();
			image_context.fillStyle = "rgb(255, 255, 255)";
			image_context.fillRect(image_data_width / 2 - 96, 4, image_data_rank_back_size, image_data_rank_back_size);
			
			// Upload file
			var attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "levelup.png"); 
			var embed = new Discord.MessageEmbed();
			embed.attachFiles(attachment);
			embed.setAuthor(client.utils.getTrans(client, message.author, message.guild, "exphandler.levelup.embed.title"), get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}));
			embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "exphandler.levelup.embed.footer") + ": " + message.guild.name, message.guild.iconURL());
			embed.setImage("attachment://" + attachment.name);
			embed.setColor(0x66b3ff);
			return message.channel.send({content: "<@" + get_member.user.id + ">", embed: embed});
		}
	}
}
module.exports = exp_handler;
const Discord = require("discord.js");
const Canvas = require("canvas");

/**
 * @param {Canvas.CanvasRenderingContext2D} context
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} string 
 * @param {String} color 
 * @param {String} shadow_color 
 * @param {Number} offset 
 */
function shadowed_text(context, x, y, string, color, shadow_color, offset) {
	context.fillStyle = shadow_color;
	context.fillText(string, x + offset, y + offset);

	context.fillStyle = color;
	context.fillText(string, x, y);
}

/**
 * @description Executes all guild's experience system related
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns {Discord.Message} message
 */
async function exp_handler(client, message) {
	if (message.author.bot) { return; }
	
	if (message.guild) {
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) { return; }
		
		if (client.exp_cooldowns.has(message.author.id)) { return; }
		
		let get_level_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(message.guild.id, message.author.id);
		let get_level = get_level_data;
		if (!get_level) { get_level = {guild_id: message.guild.id, user_id: message.author.id, level: 0, score: 0, messages: 0}; }
		get_level.score += client.functions.getRandomNumber(client.config.exp_gain_rate);
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
		else { client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?;").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id); }
		client.exp_cooldowns.set(message.author.id, "active");
		setTimeout(() => client.exp_cooldowns.delete(message.author.id), client.config.exp_cooldown);
		
		if (get_level.level > previous_level) {
			let get_member = message.member;
			let level_index_old = previous_level;
			let level_index = get_level.level;
			if (level_index > client.config.exp_level_max) { level_index = client.config.exp_level_max; }
			
			let next_level = level_index + 1;
			if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }

			let image_data_width = 1600;
			let image_data_height = 496;
			
			let image_data_rank_front_padding = 100;
			let image_data_rank_front_size = 384;
			let image_data_right = (image_data_width - image_data_rank_front_size) - image_data_rank_front_padding;

			Canvas.registerFont(process.cwd() + "/assets/fonts/Stratum1-Bold.otf", {family: "Stratum1-Bold"});
			
			let image_canvas = Canvas.createCanvas(image_data_width, image_data_height);
			let image_context = image_canvas.getContext("2d");
			image_context.patternQuality = "nearest";
			image_context.quality = "nearest";
			image_context.imageSmoothingEnabled = false;
			
			// Background
			image_context.fillStyle = "#7289DA";
			image_context.fillRect(0, 0, image_data_width, image_data_height);
			
			// Images
			let rank_front_image = await client.functions.generateRankIcon(client, Canvas, level_index);
			let rank_front_image_old = await client.functions.generateRankIcon(client, Canvas, level_index_old);
			if (rank_front_image) { image_context.drawImage(rank_front_image, image_data_width - (image_data_rank_front_padding + image_data_rank_front_size), image_data_rank_front_padding / 2, image_data_rank_front_size, image_data_rank_front_size); }
			if (rank_front_image_old) { image_context.drawImage(rank_front_image_old, image_data_rank_front_padding, image_data_rank_front_padding / 2, image_data_rank_front_size, image_data_rank_front_size); }
			
			// String - Levels
			image_context.font = "64px Stratum1-Bold";
			image_context.textAlign = "center";
			image_context.textBaseline = "bottom";
			shadowed_text(image_context, image_data_rank_front_padding + (image_data_rank_front_size / 2), image_data_height - 4, client.functions.getTranslation(client, message.author, message.guild, "events/experience_handler", "levelup.level") + ". " + level_index_old, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
			shadowed_text(image_context, image_data_width - (image_data_rank_front_padding + (image_data_rank_front_size / 2)), image_data_height - 4, client.functions.getTranslation(client, message.author, message.guild, "events/experience_handler", "levelup.level") + ". " + level_index, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
			
			// Arrow
			image_context.beginPath();
			image_context.moveTo(image_data_width / 2, (image_data_rank_front_size / 2));
			image_context.lineTo((image_data_width / 2) - 96, 4);
			image_context.lineTo((image_data_width / 2), 4);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_front_size / 2));
			image_context.moveTo(image_data_width / 2, (image_data_rank_front_size / 2));
			image_context.lineTo((image_data_width / 2) - 96, image_data_rank_front_size);
			image_context.lineTo((image_data_width / 2), image_data_rank_front_size);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_front_size / 2));
			image_context.clip();
			image_context.fillStyle = "rgb(255, 255, 255)";
			image_context.fillRect(image_data_width / 2 - 96, 4, image_data_rank_front_size, image_data_rank_front_size);
			
			// Upload file
			var attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "levelup.png"); 
			var embed = new Discord.MessageEmbed();
			embed.attachFiles(attachment);
			embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "events/experience_handler", "levelup.title"), get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}));
			embed.setImage("attachment://" + attachment.name);
			embed.setColor(0x66b3ff);
			return message.channel.send({content: "<@" + get_member.user.id + ">", embed: embed});
		}
	}
}
module.exports = exp_handler;
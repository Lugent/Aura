const Discord = require("discord.js");
/*const Canvas = require("canvas");
Canvas.registerFont(process.cwd() + "/assets/fonts/Stratum1-Medium.otf", {family: "Stratum1"});
*/
/**
 * @param {Canvas.CanvasRenderingContext2D} context
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} string 
 * @param {String} color 
 * @param {String} shadow_color 
 * @param {Number} offset 
 */
 /*
function shadowed_text(context, x, y, string, color, shadow_color, offset) {
	context.fillStyle = shadow_color;
	context.fillText(string, x + offset, y + offset);

	context.fillStyle = color;
	context.fillText(string, x, y);
}*/

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
		if (!get_level) { get_level = {guild_id: message.guild.id, user_id: message.author.id, level: 1, score: 0, messages: 0}; }
		get_level.score += client.functions.getRandomNumber(client.config.exp_gain_rate);
		get_level.messages++;
		
		let previous_level = get_level.level;
		let next_level = get_level.level + 1;
		let score_goal = client.config.exp_formula(next_level);
		let score_max = client.config.exp_formula(client.config.exp_level_max);
		let finished_level = false;
		while (!finished_level) {
			if ((next_level <= client.config.exp_level_max) && (get_level.score > score_goal)) {
				get_level.level = next_level;
				next_level = get_level.level + 1;
				score_goal = client.config.exp_formula(next_level);
			}
			else { finished_level = true; }
		}
		
		if (get_level.score > score_max) { get_level.score = score_max; }
		if (!get_level_data) { client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(get_level.guild_id, get_level.user_id, get_level.level, get_level.score, get_level.messages); }
		else { client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?;").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id); }
		client.exp_cooldowns.set(message.author.id, "active");
		setTimeout(() => client.exp_cooldowns.delete(message.author.id), client.config.exp_cooldown);
		
		//console.log(get_level.score, score_goal)
		//console.log(get_level.level, previous_level)
		if (get_level.level > previous_level) {
			let get_member = message.member;
			let level_index_old = previous_level;
			let level_index = get_level.level;
			if (level_index > client.config.exp_level_max) { level_index = client.config.exp_level_max; }
			
			let next_level = level_index + 1;
			if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }
/*
			let image_data_width = 1600;
			let image_data_height = 496;
			
			let image_data_rank_front_padding = 100;
			let image_data_rank_front_size = 384;
			let image_data_right = (image_data_width - image_data_rank_front_size) - image_data_rank_front_padding;
			
			let image_canvas = Canvas.createCanvas(image_data_width, image_data_height);
			let image_context = image_canvas.getContext("2d");
			image_context.patternQuality = "nearest";
			image_context.quality = "nearest";
			image_context.imageSmoothingEnabled = false;
			
			// Background
			image_context.fillStyle = "#7289DA";
			image_context.fillRect(0, 0, image_data_width, image_data_height);
			
			// String - Levels
			image_context.font = "96px Stratum1";
			image_context.textAlign = "center";
			image_context.textBaseline = "bottom";
			shadowed_text(image_context, image_data_rank_front_padding + (image_data_rank_front_size / 2), image_data_height / 2, level_index_old, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
			shadowed_text(image_context, image_data_width - (image_data_rank_front_padding + (image_data_rank_front_size / 2)), image_data_height / 2, level_index, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
			
			// Arrow
			image_context.beginPath();
			image_context.moveTo(image_data_width / 2, (image_data_rank_front_size / 2) + 40);
			image_context.lineTo((image_data_width / 2) - 96, 4 + 40);
			image_context.lineTo((image_data_width / 2), 4  + 40);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_front_size / 2) + 40);
			image_context.moveTo(image_data_width / 2, (image_data_rank_front_size / 2) + 40);
			image_context.lineTo((image_data_width / 2) - 96, image_data_rank_front_size + 40);
			image_context.lineTo((image_data_width / 2), image_data_rank_front_size + 40);
			image_context.lineTo((image_data_width / 2) + 96, (image_data_rank_front_size / 2) + 40);
			image_context.clip();
			image_context.fillStyle = "rgb(255, 255, 255)";
			image_context.fillRect(image_data_width / 2 - 96, 4 + 40, image_data_rank_front_size, image_data_rank_front_size);*/
			
			// Upload file
			let button = new Discord.MessageButton();
			button.setStyle("SECONDARY");
			button.setLabel(client.functions.getTranslation(client, message.guild, "events/experience_handler", "leaderboard_button"));
			button.setCustomId("show_leaderboard");
			button.setEmoji("🏆");

			//let attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "levelup.png"); 
			let embed = new Discord.MessageEmbed();
			embed.setAuthor({name: client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_header", [message.member.nickname ? message.member.nickname : message.author.username]), iconURL: (get_member.avatar ? get_member.displayAvatarURL({format: "png", dynamic: false, size: 128}) : get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}))});
			embed.setDescription("**" + client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_name") + " " + level_index_old + "**" + " --> " + "**" + client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_name") + " " + level_index + "**");
			//embed.setImage("attachment://levelup.png");
			embed.setColor([47, 49, 54]);
			return message.reply({embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]}); // files: [attachment]
		}
	}
}
module.exports = exp_handler;
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

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

module.exports = {
    name: "rank",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "rank.usage",
	description: "rank.description",
	flags: constants.cmdFlags.noHelp,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "no_guild"));
			embed.setColor([255, 255, 0]);
			return message.reply({embed: embed});
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "is_disabled"));
			embed.setColor([255, 0, 0]);
			return message.reply({embed: embed});
		}
		
		
		let get_member = message.member;
		let members = await message.guild.members.fetch();
		if (args[0]) {
			let mentioned_member = message.mentions.members.first();
			let search_member = get_member || message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length));
			get_member = mentioned_member || search_member || members.find(member => member.id === args[0]);
		}
		
		if (!get_member) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "no_member"));
			embed.setColor([255, 0, 0]);
			return message.reply({embed: embed});
		}
		
		if (get_member.user.bot) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "bot_member"));
			embed.setColor([255, 0, 0]);
			return message.reply({embed: embed});
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
		
		let image_data_width = 1200; // 400
		let image_data_height = 600;
		
		let image_data_avatar_padding = 64;
		let image_data_avatar_size = 256;
		let image_data_rank_back_padding = 64;
		let image_data_rank_back_size = 320;
		let image_data_rank_front_size = 320;
		let image_data_left = image_data_avatar_padding;
		let image_data_right = (image_data_width - image_data_rank_back_size) - image_data_rank_back_padding;
		let image_data_position = image_data_left;
		
		let image_data_bar_length = (image_data_width - (image_data_width / 4)) - (image_data_avatar_padding * 2);
		let image_data_bar_fill_length = ((get_level.score - score_actual) / (score_goal - score_actual)) * image_data_bar_length;
		if (image_data_bar_fill_length < 40) { image_data_bar_fill_length = 40; }
		if (image_data_bar_fill_length > image_data_bar_length) { image_data_bar_fill_length = image_data_bar_length; }
		if (level_index >= client.config.exp_level_max) { image_data_bar_fill_length = image_data_bar_length; }
		
		const Canvas = require("canvas");
		Canvas.registerFont(process.cwd() + "/assets/fonts/DJB Get Digital.ttf", {family: "Get-Digital"});
		
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
		let avatar_image = await Canvas.loadImage(get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 512})); // 4096
		if (rank_front_image) { image_context.drawImage(rank_front_image, image_data_right, 0, image_data_rank_front_size, image_data_rank_front_size); }
		
		image_context.lineWidth = 16;
		image_context.fillStyle = "rgb(64, 64, 64)";
		image_context.fillRect(image_data_position - 4, image_data_avatar_padding - 4, image_data_avatar_size + 8, image_data_avatar_size + 8);
		
		image_context.strokeStyle = "#43B581";
		switch (get_member.user.presence.status) {
			case "idle": { image_context.strokeStyle = "#FAA61A"; break; }
			case "dnd": { image_context.strokeStyle = "#F04747"; break; }
			case "offline": { image_context.strokeStyle = "#99AAB5"; break; }
		}
		
		image_context.strokeRect(image_data_position - 8, image_data_avatar_padding - 8, image_data_avatar_size + 16, image_data_avatar_size + 16);
		image_context.drawImage(avatar_image, image_data_position, image_data_avatar_padding, image_data_avatar_size, image_data_avatar_size);
		
		// Progress bar - Container
		image_context.fillStyle = "rgb(0, 0, 127)";
		image_context.fillRect(image_data_avatar_padding - 8, ((image_data_height - 12) - 4) - 120, image_data_width - (image_data_avatar_padding * 2) + 16, 96 + 8);

		image_context.fillStyle = "rgb(0, 0, 0)";
		image_context.fillRect(image_data_avatar_padding + 8, ((image_data_height - 12) + 4) - 120, image_data_width - (image_data_avatar_padding * 2) - 16, 96 - 8);

		let progress_bar = ((get_level.score - score_actual) / (score_goal - score_actual)) * (image_data_width - (image_data_avatar_padding * 2) - 8);
		image_context.fillStyle = "rgb(0, 127, 0)";
		image_context.fillRect(image_data_avatar_padding + 8, ((image_data_height - 12) + 4) - 120, progress_bar, 96 - 8);

		// String - Level
		image_context.font = "82px Get-Digital";
		image_context.textAlign = "left";
		image_context.textBaseline = "bottom";
		shadowed_text(image_context, image_data_avatar_padding + 16, image_data_height - 32, client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "level") + ". " + level_index, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 8);

		// String - XP
		let target_xp = client.functions.getFormattedNumber(score_goal, 2);
		if (level_index >= client.config.exp_level_max) { target_xp = client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "xp_max"); }
		image_context.font = "82px Get-Digital";
		image_context.textAlign = "right";
		image_context.textBaseline = "bottom";
		shadowed_text(image_context, image_data_width - image_data_avatar_padding - 16, image_data_height - 32, client.functions.getFormattedNumber(get_level.score, 2) + " / " + target_xp + " " + client.functions.getTranslation(client, message.author, message.guild, "commands_rank", "xp"), "rgb(255, 255, 255)", "rgb(0, 0, 0)", 8);

		// String - Rank
		image_context.font = "82px Get-Digital";
		image_context.textAlign = "left";
		image_context.textBaseline = "bottom";
		shadowed_text(image_context, image_data_avatar_padding - 8, image_data_height - (24 + 128), client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "rank") + " " + (get_rank + 1) + " / " + (levels_database.length), "rgb(255, 255, 255)", "rgb(0, 0, 0)", 8);
		
		// Upload file
		var attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "rank.png"); 
		var embed = new Discord.MessageEmbed();
		embed.attachFiles(attachment);
		embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/rank", "embed.title", [get_member.user.tag]), get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}));
		embed.setImage("attachment://" + attachment.name);
		embed.setColor(0x66b3ff);
		return message.reply({embed: embed});
    }
};
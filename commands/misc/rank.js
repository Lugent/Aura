const Discord = require("discord.js");
const path = require("path");
const constants = require(process.cwd() + "/configurations/constants.js");
const Canvas = require("canvas");
Canvas.registerFont(process.cwd() + "/assets/fonts/Stratum1-Medium.otf", {family: "Stratum1"});

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
 * 
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction|Discord.ContextMenuInteraction} interaction 
 */
async function execute_rank(client, interaction) {
	let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(interaction.guild.id);
	let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
	if (get_disabled_functions.includes("exp")) {
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "is_disabled"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	
	let get_member = interaction.isContextMenu() ? interaction.targetMember : (interaction.isButton() ? interaction.member :interaction.options.getMember("member"));
	if (!get_member) { get_member = interaction.member; }
	if (get_member.user.bot) {
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "bot_member"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	await interaction.deferReply();
	
	let get_rank = 0;
	let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(interaction.guild.id); //client.server_level.list.all(interaction.guild.id);
	for (let level_index = 0; level_index < levels_database.length; level_index++) {
		if (get_member.user.id === levels_database[level_index].user_id) {
			get_rank = level_index;
			break;
		}
	}
	
	let get_level = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_member.user.id); //client.server_level.select.get(interaction.guild.id, get_member.user.id);
	let level_index = get_level.level;
	if (level_index > client.config.exp_level_max) { level_index = client.config.exp_level_max; }
	
	let next_level = level_index + 1;
	if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }
	
	let exp_score_base = client.config.exp_score_base;
	let score_actual = client.config.exp_formula(level_index); //(level_index * level_index) * exp_score_base;
	let score_goal = client.config.exp_formula(next_level); //(next_level * next_level) * exp_score_base;
	//console.log(score_actual)
	//console.log(score_goal)
	
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
	
	let image_canvas = Canvas.createCanvas(image_data_width, image_data_height);
	let image_context = image_canvas.getContext("2d");
	image_context.patternQuality = "nearest";
	image_context.quality = "nearest";
	image_context.imageSmoothingEnabled = false;

	// Background
	let get_profile = client.bot_data.prepare("SELECT * FROM profiles WHERE user_id = ?;").get(get_member.user.id);
	let get_colour = (get_profile && get_profile.accent_colour && get_profile.accent_colour.startsWith("#")) ? get_profile.accent_colour : "#ffffff";
	image_context.fillStyle = "#ffffff" //get_colour;
	image_context.fillRect(0, 0, image_data_width, image_data_height);

	// Card
	image_context.fillStyle = "#000000"; //"#2f3136";
	image_context.fillRect(8, 8, (image_data_width - 16), (image_data_height - 16));

	// Avatar frame
	image_context.fillStyle = "#444444"; //"#000000";
	image_context.fillRect((image_data_position - 8) + 4, (image_data_avatar_padding - 8) + 4, (image_data_avatar_size + 16) + 4, (image_data_avatar_size + 16) + 4);
	
	image_context.fillStyle = "#ffffff"; //"#99AAB5";
	/*if (get_member.presence) {
		switch (get_member.presence.status) {
			case "online": { image_context.fillStyle = "#43B581"; break; }
			case "idle": { image_context.fillStyle = "#FAA61A"; break; }
			case "dnd": { image_context.fillStyle = "#F04747"; break; }
		}
	}*/
	image_context.fillRect(image_data_position - 8, image_data_avatar_padding - 8, image_data_avatar_size + 16, image_data_avatar_size + 16);

	// Avatar
	let avatar_image = await Canvas.loadImage(get_member.avatar ? get_member.displayAvatarURL({format: "png", dynamic: false, size: 256}) : get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 256}));
	//let avatar_image = await Canvas.loadImage(get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 512})); // 4096
	image_context.drawImage(avatar_image, image_data_position, image_data_avatar_padding, image_data_avatar_size, image_data_avatar_size);
	
	// A white drawing to fill space lmao -- nah
	/*
	image_context.lineWidth = 16;
	
	image_context.strokeStyle = "#000000";
	image_context.beginPath();
	image_context.moveTo((image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2)) + 4, (image_data_avatar_padding + 48) + 4);
	image_context.lineTo(((image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2) + (image_data_avatar_size / 2)) - 16) + 4, (image_data_avatar_padding + (image_data_avatar_size / 2)) + 4);
	image_context.lineTo((image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2)) + 4, ((image_data_avatar_padding + image_data_avatar_size) - 48) + 4);
	image_context.stroke();
	
	image_context.strokeStyle = "#ffffff";
	image_context.beginPath();
	image_context.moveTo(image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2), image_data_avatar_padding + 48);
	image_context.lineTo((image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2) + (image_data_avatar_size / 2)) - 16, (image_data_avatar_padding + (image_data_avatar_size / 2)));
	image_context.lineTo(image_data_width - ((image_data_avatar_padding + image_data_avatar_size) * 2), (image_data_avatar_padding + image_data_avatar_size) - 48);
	image_context.stroke();
	*/
	
	// Level
	// Shadow
	image_context.fillStyle = "#444444";
	image_context.beginPath();
	image_context.moveTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2))) + 4, image_data_avatar_padding + 4);
	image_context.lineTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)) - (image_data_avatar_size / 2)) + 4, (image_data_avatar_padding + (image_data_avatar_size / 2)) + 4);
	image_context.lineTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2))) + 4, (image_data_avatar_padding + image_data_avatar_size) + 4);
	image_context.lineTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)) + (image_data_avatar_size / 2)) + 4, (image_data_avatar_padding + (image_data_avatar_size / 2)) + 4);
	image_context.closePath();
	image_context.fill();
	
	// Background
	image_context.fillStyle = "#888888"; //"#4f545c";
	image_context.beginPath();
	image_context.moveTo(image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)), image_data_avatar_padding);
	image_context.lineTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)) - (image_data_avatar_size / 2)), (image_data_avatar_padding + (image_data_avatar_size / 2)));
	image_context.lineTo(image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)), (image_data_avatar_padding + image_data_avatar_size));
	image_context.lineTo((image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)) + (image_data_avatar_size / 2)), (image_data_avatar_padding + (image_data_avatar_size / 2)));
	image_context.closePath();
	image_context.fill();
	
	// Text
	image_context.font = "82px Stratum1";
	image_context.textAlign = "center";
	image_context.textBaseline = "middle";
	shadowed_text(image_context, image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)), image_data_avatar_padding + (image_data_avatar_size / 2), level_index, "rgb(255, 255, 255)", "rgb(72, 72, 72)", 4);
	
	image_context.font = "64px Stratum1";
	image_context.textBaseline = "bottom";
	shadowed_text(image_context, image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)), image_data_height - 192, client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "level"), "rgb(255, 255, 255)", "rgb(72, 72, 72)", 4);
	
	// Rank
	image_context.font = "64px Stratum1";
	image_context.textAlign = "left";
	image_context.textBaseline = "bottom";
	shadowed_text(image_context, 64, image_data_height - (92 + 68), client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "rank") + " #" + (get_rank + 1), "rgb(255, 255, 255)", "rgb(72, 72, 72)", 4);
	
	// Progress Bar
	// Path
	/*image_context.beginPath();
	image_context.moveTo(8, (image_data_height - 8));
	image_context.lineTo(64, (image_data_height - 64));
	image_context.lineTo((image_data_width - 64), (image_data_height - 64));
	image_context.lineTo((image_data_width - 8), (image_data_height - 8));
	image_context.closePath();
	image_context.clip();*/
	
	// Render
	// Background
	image_context.fillStyle = "#cccccc"; //"#F04747";
	image_context.fillRect(8 + 16, (image_data_height - (64 + 16)), (image_data_width - 16) - 32, 64 - 8);
	
	// Foreground
	let progress_bar = ((get_level.score - score_actual) / (score_goal - score_actual)) * ((image_data_width - 16) - 32);
	if (progress_bar < 0) { progress_bar = 0; }
	if (level_index >= client.config.exp_level_max) { progress_bar = (image_data_width - 16) - 32; }
	image_context.fillStyle = "#ffffff"; //"#43B581";
	image_context.fillRect(8 + 16, (image_data_height - (64 + 16)), progress_bar, 64 - 8);
	
	// Score
	let target_xp = client.functions.getFormattedNumber(score_goal, 2);
	image_context.font = "52px Stratum1";
	image_context.textAlign = "center";
	image_context.textBaseline = "middle";
	
	let xp_text = client.functions.getFormattedNumber(get_level.score, 2) + " / " + target_xp + " " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "xp");
	if (level_index >= client.config.exp_level_max) { xp_text = client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "xp_max"); }
	shadowed_text(image_context, image_data_width / 2, image_data_height - 54, xp_text, "rgb(0, 0, 0)", "rgb(72, 72, 72)", 4);

	// Upload file
	let attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "rank.png");
	let embed = new Discord.MessageEmbed();
	embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "user_header", [get_member.nickname ? get_member.nickname : get_member.user.username]), iconURL: (get_member.avatar ? get_member.displayAvatarURL({format: "png", dynamic: false, size: 128}) : get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}))});
	embed.setFooter({text: client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "server_name", [interaction.guild.name]), iconURL: interaction.guild.iconURL()});
	embed.setImage("attachment://rank.png");
	embed.setColor([47, 49, 54]);
	
	let button = new Discord.MessageButton();
	button.setLabel(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "leaderboard_button"));
	button.setCustomId("show_leaderboard");
	button.setStyle("SECONDARY");
	button.setEmoji("????");
	await interaction.editReply({files: [attachment], embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]}).catch(async (error) => {
		embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "fatal_error"));
		embed.setColor([47, 49, 54]);
		interaction.editReply({embeds: [embed]});
	});
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)} : null;
}

function isDarkColor(hexColor) {
	const {r, g, b} = hexToRgb(hexColor);
	let colorArray = [r / 255, g / 255, b / 255].map(v => {
		if (v <= 0.03928) { return (v / 12.92);}
		return Math.pow((v + 0.055) / 1.055, 2.4);
	});

	const luminance = (0.2126 * colorArray[0]) + (0.7152 * colorArray[1]) + (0.0722 * colorArray[2]);
	return (luminance <= 0.179);
}

function cleanString(input) {
    let output = "";
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) { output += input.charAt(i); }
    }
    return output;
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction|Discord.ContextMenuInteraction} interaction 
 */
async function execute_leaderboard(client, interaction) {
	let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(interaction.guild.id);
	let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
	if (get_disabled_functions.includes("exp")) {
		let embed = new Discord.MessageEmbed();
		embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "is_disabled"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	await interaction.deferReply();
	
	let image_canvas = Canvas.createCanvas(1280, 720);
	let image_context = image_canvas.getContext("2d");
	image_context.patternQuality = "nearest";
	image_context.quality = "nearest";
	image_context.imageSmoothingEnabled = false;
	
	image_context.fillStyle = "#ffffff" //"#7289DA";
	image_context.fillRect(0, 0, 1280, 720);
	
	
	// rendering values
	let offset_x = 0;
	let offset_y = 48;
	let bar_space = 1276;
	
	// header
	image_context.fillStyle = "#ffffff" //"#2f3136";
	image_context.fillRect(2, 2, bar_space, 44);
	
	image_context.font = "36px Stratum1";
	image_context.textAlign = "left";
	image_context.textBaseline = "top";
	shadowed_text(image_context, 64, 2, client.functions.getTranslation(client, interaction.guild, "commands/ranking/leaderboard", "leaderboard_member"), "#000000", "#ffffff", 2);
	
	image_context.textAlign = "right";
	shadowed_text(image_context, 1280 - 64, 2, client.functions.getTranslation(client, interaction.guild, "commands/ranking/leaderboard", "leaderboard_score"), "#000000", "#ffffff", 2);
	
	let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(interaction.guild.id);
	let members_get = await interaction.guild.members.fetch();
	for (let level_index = 0; level_index < 14; level_index++) {
		let level_element = levels_database[level_index];
		if (level_index > 14) { break; }
		
		// background
		image_context.fillStyle = "#000000" //"#2f3136"; //(level_element.user_id == interaction.user.id) ? "#FAA61A" : "#2f3136";
		image_context.fillRect(offset_x + 2, offset_y + 2, bar_space, 44);
		
		if (level_element) {		
			// role colour
			let member_object = await interaction.guild.members.fetch(level_element.user_id).catch(error => { return undefined; });
			image_context.fillStyle = member_object ? member_object.displayHexColor : "#ffffff"; //((member_object && !isDarkColor(member_object.displayHexColor)) ? member_object.displayHexColor : "#ffffff");
			image_context.fillRect(offset_x + 2, offset_y + 2, 44, 44);
			
			// rank
			image_context.font = "36px Stratum1";
			image_context.textAlign = "center";
			image_context.textBaseline = "top";
			shadowed_text(image_context, offset_x + (8 + 64), offset_y + 4, (level_index + 1), "#ffffff", "#000000", 2);
			
			// avatar
			let user_object = await client.users.fetch(level_element.user_id).catch(error => { return undefined; });
			if (user_object) {
				let avatar_image = await Canvas.loadImage(member_object ? member_object.displayAvatarURL({format: "png", dynamic: false, size: 64}) : user_object.displayAvatarURL({format: "png", dynamic: false, size: 64}));
				image_context.drawImage(avatar_image, offset_x + (96 + 12), offset_y + 2, 44, 44);
			}
			
			// name
			image_context.font = "36px Stratum1";
			image_context.textAlign = "left";
			image_context.textBaseline = "top";
			shadowed_text(image_context, offset_x + (16 + 144), offset_y + 6, cleanString((member_object && member_object.nickname) ? member_object.nickname : (user_object ? user_object.username : (level_element.user_id))), "#ffffff", "#000000", 2);
			
			// score
			image_context.font = "36px Stratum1";
			image_context.textAlign = "right";
			image_context.textBaseline = "top";
			shadowed_text(image_context, offset_x + (bar_space - (144 + 64)), offset_y + 4, client.functions.getFormattedNumber(level_element.score, 2) + " " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "xp"), "#ffffff", "#000000", 2);
			
			// level
			image_context.font = "36px Stratum1";
			image_context.textAlign = "right";
			image_context.textBaseline = "top";
			shadowed_text(image_context, offset_x + (bar_space - (16 + 64)), offset_y + 4, client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "level_short") + ". " + client.functions.getFormattedNumber(level_element.level, 0), "#ffffff", "#000000", 2);
		}
		else {
			// No Data
			image_context.font = "36px Stratum1";
			image_context.textAlign = "center";
			image_context.textBaseline = "top";
			shadowed_text(image_context, (bar_space / 2), offset_y + 4, client.functions.getTranslation(client, interaction.guild, "commands/ranking/leaderboard", "no_data"), "#cccccc", "#000000", 2);
		}
		
		// offsets
		offset_y = (48 * ((level_index + 2)));
		//offset_x = (640 * Math.floor((level_index + 1) / 10));
	}
	
	let button = new Discord.MessageButton();
	button.setStyle("SECONDARY");
	button.setLabel(client.functions.getTranslation(client, interaction.guild, "events/experience_handler", "rank_button"));
	button.setCustomId("show_rank");
	button.setEmoji("????");
	
	let attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "leaderboard.png");
	let embed = new Discord.MessageEmbed();
	embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/ranking/leaderboard", "server_header", [interaction.guild.name]), iconURL: interaction.guild.iconURL()});
	embed.setImage("attachment://leaderboard.png");
	embed.setColor([47, 49, 54]);
	await interaction.editReply({files: [attachment], embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]}).catch(async (error) => {
		embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "fatal_error"));
		embed.setColor([47, 49, 54]);
		interaction.editReply({embeds: [embed]});
	});
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */
async function execute_xp(client, interaction) {
	let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(interaction.guild.id);
	let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
	if (get_disabled_functions.includes("exp")) {
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "is_disabled"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	
	if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD )) { // Permission check
		let embed = new Discord.MessageEmbed();
		embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "no_permission"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	await interaction.deferReply();
	
	switch (interaction.options.getSubcommand()) {
		default: {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "not_done_yet"));
			embed.setColor([47, 49, 54]);
			return interaction.editReply({embeds: [embed]});
		}

		case "recalculate": {
			let guild_members = await interaction.guild.members.fetch(); // get members
			let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(interaction.guild.id); // get actual rankings
			
			// counters for visual tracking
			let count_added = 0;
			let count_recalculated = 0;
			let count_removed = 0;
			let count_total = 0;
			
			// part one: check rankings
			for (let member_index = 0; member_index < levels_database.length; member_index++) {
				let level_element = levels_database[member_index];
				let get_member = await interaction.guild.members.fetch(level_element.user_id).catch(error => { return undefined; });
				if (!get_member) { // remove it already since it's gone
					client.server_data.prepare("DELETE FROM exp WHERE guild_id = ? AND user_id = ?;").run(interaction.guild.id, level_element.user_id);
					count_removed++;
				}
				else { // recalculate their level based on their actual score
					let previous_level = 1; // easy hack to do this from zero - nvm, do this from one
					let next_level = previous_level + 1;
					let score_goal = client.config.exp_formula(next_level);
					let score_max = client.config.exp_formula(client.config.exp_level_max);
					let finished_level = false;
					let level_up = false;
					while (!finished_level) {
						if ((next_level <= client.config.exp_level_max) && (level_element.score > score_goal)) {
							previous_level = next_level;
							next_level = previous_level + 1;
							score_goal = client.config.exp_formula(next_level);
							level_up = true;
						}
						else {
							finished_level = true;
							if (levels_database[member_index].level !== previous_level) { count_recalculated++; }
						}
					}
					
					if (level_element.score > score_max) { level_element.score = score_max; }
					client.server_data.prepare("UPDATE exp SET level = ?, score = ? WHERE guild_id = ? AND user_id = ?;").run(previous_level, level_element.score, level_element.guild_id, level_element.user_id);
				}
			}
			
			// part two: check if there are members not in the member list
			guild_members.forEach(async function (member) {
				if (!member.user.bot) {
					let get_level = levels_database.find((element) => element.user_id == member.user.id);
					if (!get_level) {
						client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(interaction.guild.id, member.user.id, 1, 0, 0);
						count_added++;
					}
					count_total++;
				}
			});

			let button = new Discord.MessageButton();
			button.setStyle("SECONDARY");
			button.setLabel(client.functions.getTranslation(client, interaction.guild, "events/experience_handler", "leaderboard_button"));
			button.setCustomId("show_leaderboard");
			button.setEmoji("????");

			let embed_data = [];
			if (count_added) { embed_data.push(client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "recalculate.added", [count_added])); }
			if (count_recalculated) { embed_data.push(client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "recalculate.updated", [count_recalculated])); }
			if (count_removed) { embed_data.push(client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "recalculate.removed", [count_removed])); }
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "recalculate.done", [count_total]));
			embed.setDescription(embed_data.length ? embed_data.join("\n") : client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "recalculate.no_changes"));
			embed.setColor([47, 49, 54]);
			return interaction.editReply({embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]});
		}
		
		case "set": {
			let get_member = interaction.options.getMember("member");
			let get_level = interaction.options.getInteger("level");

			if (get_member.user.bot) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "bot_member"));
				embed.setColor([47, 49, 54]);
				return interaction.reply({embeds: [embed]});
			}

			let get_level_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_member.user.id);
			if (!get_level_data) {
				client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(interaction.guild.id, get_member.user.id, 1, 0, 0);
			}
			
			if (get_level < 1) { get_level = 1; }
			if (get_level > client.config.exp_level_max) { get_level = client.config.exp_level_max; }
			client.server_data.prepare("UPDATE exp SET level = ?, score = ? WHERE guild_id = ? AND user_id = ?;").run(get_level, client.config.exp_formula(get_level), interaction.guild.id, get_member.user.id);
			
			let button = new Discord.MessageButton();
			button.setStyle("SECONDARY");
			button.setLabel(client.functions.getTranslation(client, interaction.guild, "events/experience_handler", "leaderboard_button"));
			button.setCustomId("show_leaderboard");
			button.setEmoji("????");
			
			let embed = new Discord.MessageEmbed();
			embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/ranking/xp", "set.user_header", [get_member.nickname ? get_member.nickname : get_member.user.username, get_level]), iconURL: (get_member.avatar ? get_member.displayAvatarURL({format: "png", dynamic: false, size: 128}) : get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}))});
			embed.setColor([47, 49, 54]);
			return interaction.editReply({embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]});
		}

		/*case "delete": {
			
			break;
		}*/
	}
}

module.exports = {
    id: "rank",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand|constants.cmdTypes.buttonInteraction,
	
	applications: [
		{
			format: {
				name: "rank",
				description: "rank.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "USER",
						name: "member",
						description: "rank.member.description",
						required: false
					}
				]
			},

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) { execute_rank(client, interaction); }
		},
		{
			format: {
				name: "leaderboard",
				description: "leaderboard.description",
				type: "CHAT_INPUT"
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) { execute_leaderboard(client, interaction); }
		},
		{
			format: {
				name: "xp",
				description: "xp.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "set",
						description: "xp.set.description",
						options: [
							{
								type: "USER",
								name: "member",
								description: "xp.set.member.description",
								required: true
							},
							{
								type: "INTEGER",
								name: "level",
								description: "xp.set.level.description",
								required: true
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "delete",
						description: "xp.delete.description",
						options: [
							{
								type: "USER",
								name: "member",
								description: "xp.delete.member_user.description",
								required: false
							},
							{
								type: "STRING",
								name: "id",
								description: "xp.delete.member_id.description",
								required: false
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "recalculate",
						description: "xp.recalculate.description"
					},
					/*{
						type: "SUB_COMMAND",
						name: "blacklist",
						description: "xp.blacklist.description",
						options: [
							{
								type: "USER",
								name: "member",
								description: "xp.blacklist.member.description",
								required: true
							},
						]
					},*/
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) { execute_xp(client, interaction); }
		},
		{
			format: {
				name: "Ranking",
				type: "USER"
			},

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.ContextMenuInteraction} interaction
			 */
			async execute(client, interaction) { execute_rank(client, interaction); }
		}
	],
	buttons: [
		{
			id: "show_rank",
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.ButtonInteraction} interaction
			 */
			async execute(client, interaction) { execute_rank(client, interaction); }
		},
		{
			id: "show_leaderboard",

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.ButtonInteraction} interaction
			 */
			async execute(client, interaction) { execute_leaderboard(client, interaction); }
		}
	],
};
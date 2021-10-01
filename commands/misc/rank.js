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
	
	let get_member = interaction.options ? interaction.options.getMember("member") : (interaction.targetId ? await interaction.guild.members.fetch(interaction.targetId) : interaction.member);
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
	
	let image_canvas = Canvas.createCanvas(image_data_width, image_data_height);
	let image_context = image_canvas.getContext("2d");
	image_context.patternQuality = "nearest";
	image_context.quality = "nearest";
	image_context.imageSmoothingEnabled = false;

	// Background
	image_context.fillStyle = "#7289DA";
	image_context.fillRect(0, 0, image_data_width, image_data_height);

	// Card
	image_context.fillStyle = "#2f3136";
	image_context.fillRect(8, 8, (image_data_width - 16), (image_data_height - 16));

	// Avatar frame
	image_context.fillStyle = "#99AAB5";
	if (get_member.presence) {
		switch (get_member.presence.status) {
			case "online": { image_context.fillStyle = "#43B581"; break; }
			case "idle": { image_context.fillStyle = "#FAA61A"; break; }
			case "dnd": { image_context.fillStyle = "#F04747"; break; }
		}
	}
	image_context.fillRect(image_data_position - 8, image_data_avatar_padding - 8, image_data_avatar_size + 16, image_data_avatar_size + 16);

	// Avatar
	let avatar_image = await Canvas.loadImage(get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 512})); // 4096
	image_context.drawImage(avatar_image, image_data_position, image_data_avatar_padding, image_data_avatar_size, image_data_avatar_size);
	
	// Level
	image_context.font = "96px Stratum1";
	image_context.textAlign = "center";
	image_context.textBaseline = "middle";
	shadowed_text(image_context, image_data_width - (image_data_avatar_padding + (image_data_avatar_size / 2)), image_data_avatar_padding + (image_data_avatar_size / 2), level_index, "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
	
	// Rank
	image_context.font = "64px Stratum1";
	image_context.textAlign = "left";
	image_context.textBaseline = "bottom";
	shadowed_text(image_context, 64, image_data_height - (92 + 68), client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "rank") + " #" + (get_rank + 1), "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);
	
	// Progress Bar
	// Path
	image_context.beginPath();
	image_context.moveTo(8, (image_data_height - 8));
	image_context.lineTo(64, (image_data_height - 64));
	image_context.lineTo((image_data_width - 64), (image_data_height - 64));
	image_context.lineTo((image_data_width - 8), (image_data_height - 8));
	image_context.closePath();
	image_context.clip();
	
	// Render
	// Background
	image_context.fillStyle = "#F04747";
	image_context.fillRect(8, (image_data_height - 64), (image_data_width - 16), (image_data_height - 8));
	
	// Foreground
	let progress_bar = ((get_level.score - score_actual) / (score_goal - score_actual)) * (image_data_width - 16);
	image_context.fillStyle = "#43B581";
	image_context.fillRect(8, (image_data_height - 64), progress_bar, (image_data_height - 8));
	
	// Score
	let target_xp = client.functions.getFormattedNumber(score_goal, 2);
	if (level_index >= client.config.exp_level_max) { target_xp = client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "xp_max"); }
	image_context.font = "52px Stratum1";
	image_context.textAlign = "center";
	image_context.textBaseline = "middle";
	shadowed_text(image_context, image_data_width / 2, image_data_height - 38, client.functions.getFormattedNumber(get_level.score, 2) + " / " + target_xp + " " + client.functions.getTranslation(client, interaction.guild, "commands_rank", "xp"), "rgb(255, 255, 255)", "rgb(0, 0, 0)", 4);

	// Upload file
	let attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "rank.png");
	let embed = new Discord.MessageEmbed();
	embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "embed.title", [get_member.user.tag]), get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}));
	embed.setImage("attachment://rank.png");
	embed.setColor([47, 49, 54]);
	
	let button = new Discord.MessageButton();
	button.setLabel(client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "button.label"));
	button.setCustomId("show_leaderboard");
	button.setStyle("PRIMARY");
	button.setEmoji("🏆");
	return interaction.editReply({files: [attachment], embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]});
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
		embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "is_disabled"));
		embed.setColor([47, 49, 54]);
		return interaction.reply({embeds: [embed], ephemeral: true});
	}
	await interaction.deferReply();
	
	let image_canvas = Canvas.createCanvas(1280, 720);
	let image_context = image_canvas.getContext("2d");
	image_context.patternQuality = "nearest";
	image_context.quality = "nearest";
	image_context.imageSmoothingEnabled = false;
	
	image_context.fillStyle = "#7289DA";
	image_context.fillRect(0, 0, 1280, 720);
	
	// test member
	let offset_x = 0;
	let offset_y = 0;
	let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(interaction.guild.id);
	let members_get = await interaction.guild.members.fetch();
	for (let level_index = 0; level_index < levels_database.length; level_index++) {
		let level_element = levels_database[level_index];
		if (level_index > 9) { break; }
		
		// background
		image_context.fillStyle = (level_element.user_id == interaction.user.id) ? "#FAA61A" : "#2f3136";
		image_context.fillRect(offset_x + 2, offset_y + 2, 1276, 68);
		
		// avatar
		let user_object = await client.users.fetch(level_element.user_id).catch(error => { return undefined; });
		let avatar_image = await Canvas.loadImage(user_object.displayAvatarURL({format: "png", dynamic: false, size: 64}));
		image_context.drawImage(avatar_image, offset_x + 4, offset_y + 4, 64, 64);
		
		// name
		image_context.font = "48px Stratum1";
		image_context.textAlign = "left";
		image_context.textBaseline = "top";
		shadowed_text(image_context, offset_x + (8 + 64), offset_y + 6, user_object.tag, "#ffffff", "#000000", 2);
		
		// level
		image_context.font = "48px Stratum1";
		image_context.textAlign = "right";
		image_context.textBaseline = "top";
		shadowed_text(image_context, offset_x + (1276 - 392), offset_y + 6, client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "level") + ". " + level_element.level, "#ffffff", "#000000", 2);
		
		// score
		image_context.font = "48px Stratum1";
		image_context.textAlign = "right";
		image_context.textBaseline = "top";
		shadowed_text(image_context, offset_x + (1276 - 132), offset_y + 6, client.functions.getFormattedNumber(level_element.score, 2) + " " + client.functions.getTranslation(client, interaction.guild, "commands/ranking/rank", "xp"), "#ffffff", "#000000", 2);
		
		// rank
		image_context.font = "48px Stratum1";
		image_context.textAlign = "right";
		image_context.textBaseline = "top";
		shadowed_text(image_context, offset_x + (1276 - 4), offset_y + 6, "#" + (level_index + 1), "#ffffff", "#000000", 2);
		
		// offsets
		offset_y = (72 * ((level_index + 1)));
		//offset_x = (640 * Math.floor((level_index + 1) / 10));
	}
	
	
	var attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "leaderboard.png");
	var embed = new Discord.MessageEmbed();
	embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/ranking/leaderboard", "embed.author", [interaction.guild.name]), interaction.guild.iconURL());
	embed.setImage("attachment://leaderboard.png");
	embed.setColor([47, 49, 54]);
	return interaction.editReply({files: [attachment], embeds: [embed]});
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
								type: "STRING",
								name: "type",
								description: "xp.set.type.description",
								required: true,
								choices: [
									{value: "score", name: "score"},
									{value: "level", name: "level"},
								]
							},
							{
								type: "INTEGER",
								name: "number",
								description: "xp.set.number.description",
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
								description: "xp.delete.member.description",
								required: true
							},
						]
					},
					{
						type: "SUB_COMMAND",
						name: "recalculate",
						description: "xp.recalculate.description"
					},
					{
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
					},
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				
			}
		},
		{
			format: {
				name: "Get Rank",
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
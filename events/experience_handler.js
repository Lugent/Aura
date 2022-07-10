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
	if (message.content.length <= 4) { return; }
	
	if (message.guild) {
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		if (!get_features) { return; }

		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) { return; }
		
		if (client.exp_cooldowns.has(message.author.id)) { return; }
		
		let get_level = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(message.guild.id, message.author.id);
		if (!get_level) { return; }
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

		client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?;").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id);
		client.exp_cooldowns.set(message.author.id, "active");
		setTimeout(() => client.exp_cooldowns.delete(message.author.id), client.config.exp_cooldown);

		if (get_level.level > previous_level) {
			let get_member = message.member;
			let level_index_old = previous_level;
			let level_index = get_level.level;
			if (level_index > client.config.exp_level_max) { level_index = client.config.exp_level_max; }
			
			let next_level = level_index + 1;
			if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }
			
			// Embed Button
			let button = new Discord.MessageButton();
			button.setStyle("SECONDARY");
			button.setLabel(client.functions.getTranslation(client, message.guild, "events/experience_handler", "leaderboard_button"));
			button.setCustomId("show_leaderboard");
			button.setEmoji("🏆");

			// Send embed
			let embed = new Discord.MessageEmbed();
			embed.setAuthor({name: client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_header", [message.member.nickname ? message.member.nickname : message.author.username]), iconURL: (get_member.avatar ? get_member.displayAvatarURL({format: "png", dynamic: false, size: 128}) : get_member.user.displayAvatarURL({format: "png", dynamic: false, size: 128}))});
			embed.setDescription("**" + client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_name") + " " + level_index_old + "**" + " --> " + "**" + client.functions.getTranslation(client, message.guild, "events/experience_handler", "level_name") + " " + level_index + "**");
			embed.setColor([47, 49, 54]);
			return message.reply({embeds: [embed], components: [{type: "ACTION_ROW", components: [button]}]}); // files: [attachment]
		}
	}
}
module.exports = exp_handler;
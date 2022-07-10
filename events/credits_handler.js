const Discord = require("discord.js");

/**
 * @description Executes all guild's credits system related
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @returns {Discord.Message} message
 */
async function exp_handler(client, message) {
	if (message.author.bot) { return; }
	if (message.content.length <= 4) { return; }
	
	if (message.guild) {
		if (client.credits_cooldowns.has(message.author.id)) { return; }
		
		let get_credits = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(message.guild.id, message.author.id);
		if (!get_credits) { return; }
		get_credits.credits += client.functions.getRandomNumberRange(1, client.config.credits_gain_rate);

		let credits_max = client.config.credits_max;
		if (get_credits.credits > credits_max) { get_credits.credits = credits_max; }
		client.server_data.prepare("UPDATE profiles SET credits = ? WHERE guild_id = ? AND user_id = ?;").run(get_credits.credits, get_credits.guild_id, get_credits.user_id);
		
		client.credits_cooldowns.set(message.author.id, "active");
		setTimeout(() => client.credits_cooldowns.delete(message.author.id), client.config.credits_cooldown);
	}
}
module.exports = exp_handler;
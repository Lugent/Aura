const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Guild} guild
 */
function handleServerDatabase(client, guild) {
	if (!guild) { return; }
	
	let get_server_settings = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(guild.id);
	if (!get_server_settings) {
		try {
			client.server_data.prepare("INSERT INTO settings (guild_id, prefix, language, starboard_channel) VALUES (?, ?, ?, ?);").run(guild.id, process.env.DEFAULT_PREFIX, process.env.DEFAULT_LANGUAGE, "");
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created settings for guild: " + guild.name);
		}
	}
	
	let get_server_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(guild.id);
	if (!get_server_features) {
		try {
			client.server_data.prepare("INSERT INTO features (guild_id, disabled_functions, disabled_commands) VALUES (?, ?, ?);").run(guild.id, "", "");
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create features for guild: " + guild.name + "\n", error);
		}
		finally {
			console.log("Created features for guild: " + guild.name);
		}
	}
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.User} user 
 */
function handleUserDatabase(client, user) {
	if (!user) { return; }
	if (user.bot) { return; }
	
	let get_user_settings = client.user_data.prepare("SELECT * FROM settings WHERE user_id = ?;").get(user.id);
	if (!get_user_settings) {
		try {
			client.user_data.prepare("INSERT INTO settings (user_id, language) VALUES (?, ?)").run(user.id, client.config.default.language);
		}
		catch (error) {
			console.error("ERROR: " + "Cannot create settings for user: " + user.tag + "\n", error);
		}
		finally {
			console.log("Created settings for user: " + user.tag);
		}
	}
}

module.exports = {
	handleServerDatabase: handleServerDatabase,
	handleUserDatabase: handleUserDatabase
};
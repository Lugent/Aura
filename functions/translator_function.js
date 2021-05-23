const Discord = require("discord.js");
const fs = require("fs");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.User} user 
 * @param {Discord.Guild} guild 
 * @param {String} index 
 * @param {String} string 
 * @param {Array} values
 * @returns {String}
 */
function getTranslation(client, user, guild, index, string, values) {
	if (typeof index !== "string") { index = "undefined"; }
	if (typeof string !== "string") { return; }
	
	let translated_string;
	let language_data;
	let language_target = "es";
	let language_file = "spanish";
	if (guild) {
		let get_guild_language = client.server_data.prepare("SELECT language FROM settings WHERE guild_id = ?;").get(guild.id);
		if (get_guild_language) { language_target = get_guild_language.language; }
	}
	else if (user) {
		let get_user_language = client.user_data.prepare("SELECT language FROM settings WHERE user_id = ?;").get(user.id);
		if (get_user_language) { language_target = get_user_language.language; }
	}
	
	try {
		switch (language_target) {
			case "en": { language_file = "english"; break; }
			default: { language_file = "spanish"; break; }
		}

		let search_file = index + ".js";
		let target_file = process.cwd() + "/languages/" + language_file + "/" + search_file;
		if (fs.existsSync(target_file)) {
			delete require.cache[require.resolve(target_file)];
			language_data = require(target_file);
		}
	}
	catch (error) {
		console.error(error);
	}
	finally {
		if (!language_data) { return string; }
		
		translated_string = language_data[string];
		if (!translated_string) { return string; }
		if (values) { translated_string = client.functions.getFormatedString(translated_string, values); }
		return translated_string;
	}
}
module.exports = getTranslation;
const fs = require("fs");

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
		
		let search_file = language_file + "_" + index + ".js";
		let root_dir = fs.readdirSync(process.cwd() + "/functions/languages/" + language_file).filter(dir => dir.includes(".js"));
		for (let file of root_dir) {
			if (file === search_file) {
				delete require.cache[require.resolve(process.cwd() + "/functions/languages/" + language_file + "/" + search_file)];
				language_data = require(process.cwd() + "/functions/languages/" + language_file + "/" + search_file);
				break;
			}
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
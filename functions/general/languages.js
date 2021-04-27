function parse(string, values) {
    if ((typeof string !== "string") || (typeof values !== "object")) { return; }
	
    var regex = /%s\(([a-zA-Z0-9_]{1,15})\)/g, i;
    if (regex.test(string)) { string = string.replace(regex, function (found, match) { return values[match]; }); }
	else { for (i in values) { string = string.replace(/%s/, values[i]); } }
    return string;
}

const fs = require("fs");
function getTranslation(client, user, guild, key, string, values) {
	if (typeof string !== "string") { return; }
	
	let translated_string = "";
	let language_data = "";
	let language_target = "es";
	let language_name = "spanish";
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
			default: { language_name = "spanish"; break; }
			case "en": { language_name = "english"; break; }
		}
		
		let language_dir = process.cwd() + "/functions/languages/" + language_name;
		let language_file = language_name + "_" + key + ".js";
		let directory = fs.readdirSync(language_dir).filter(dir => !dir.includes(".js"));
		for (let file of directory) {
			if (file === language_file) {
				delete require.cache[require.resolve(language_dir + "/" + language_file)];
				language_data = require(language_dir + "/" + language_file);
			}
		}
	}
	catch (error) {
		console.error(error);
	}
	finally {
		translated_string = language_data[string];
		if (translated_string === undefined) { return string; }
		if (values) { translated_string = parse(translated_string, values); }
		return translated_string;
	}
}
module.exports = getTranslation;
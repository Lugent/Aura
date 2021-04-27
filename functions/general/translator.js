const fs = require("fs");

function parse(string, values) {
    if ((typeof string !== "string") || (typeof values !== "object")) { return; }
	
    var regex = /%s\(([a-zA-Z0-9_]{1,15})\)/g, i;
    if (regex.test(string)) { string = string.replace(regex, function (found, match) { return values[match]; }); }
	else { for (i in values) { string = string.replace(/%s/, values[i]); } }
    return string;
}

function getTranslation(client, user, guild, index, string, values) {
	if (typeof index !== "string") { index = "undefined"; }
	if (typeof string !== "string") { return; }
	
	let translated_string = undefined;
	let language_data = undefined;
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
			default: { language_file = "spanish"; break; }
			case "en": { language_file = "english"; break; }
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
		
		/*switch (language_target) {
			default: {
				delete require.cache[require.resolve(process.cwd() + "/functions/languages/spanish.js")];
				language_data = require(process.cwd() + "/functions/languages/spanish.js");
				break;
			}
			
			case "en": {
				delete require.cache[require.resolve(process.cwd() + "/functions/languages/english.js")];
				language_data = require(process.cwd() + "/functions/languages/english.js");
				break;
			}
		}*/
	}
	catch (error) {
		console.error(error);
	}
	finally {
		if (!language_data) { return string; }
		
		translated_string = language_data[string];
		if (!translated_string) { return string; }
		if (values) { translated_string = parse(translated_string, values); }
		return translated_string;
	}
}
module.exports = getTranslation;
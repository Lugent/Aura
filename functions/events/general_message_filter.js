function messageFilter(client, message) {
	delete require.cache[require.resolve(process.cwd() + "/configurations/blacklisted_links.js")];
	var blacklisted_links = require(process.cwd() + "/configurations/blacklisted_links.js")
	for (let blacklisted_index = 0; blacklisted_index < blacklisted_links.length; blacklisted_index += 1) {
		let escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		let filterRegex = new RegExp("^(" + escapeRegex(blacklisted_links[blacklisted_index].name) + ")\\s*");
		if (!filterRegex.test(message.content)) { continue; }
		
		let get_message = message.channel.messages.cache.get(message.id);
		if (!get_message) { return; }
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("auto_moderator")) { return; }
		
		let get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "generic_type");
		switch (blacklisted_links[blacklisted_index].type) {
			case "gif_crasher": { get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "gif_crasher_type"); break; }
			case "video_crasher": { get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "video_crasher_type"); break; }
			case "nsfw_link": { get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "nsfw_link_type"); break; }
			case "spam_link": { get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "spam_link_type"); break; }
			case "discord_invite": { get_type = client.functions.getTranslation(client, message.author, message.guild, "message_filter", "discord_invite_type"); break; }
		}
		
		get_message.delete().then(async (deleted_message) => {
			deleted_message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "message_filter", "filter_warning", [deleted_message.author.tag, get_type]));
		});
	}
}
module.exports = messageFilter;
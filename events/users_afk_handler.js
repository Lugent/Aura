const Discord = require("discord.js");

async function messageAFK(client, message) {
	if (message.author.bot) { return; }

	let get_afk = client.user_data.prepare("SELECT * FROM afk WHERE user_id = ?").get(message.author.id);
	if (get_afk) {
		let afk_time = client.functions.generateDurationString(client, message.author, message.guild, get_afk.time);
		let afk_message = client.functions.getTranslation(client, message.author, message.guild, "events/afk_handler", "caller.returned", [message.author.tag]) + "\n" + client.functions.getTranslation(client, message.author, message.guild, "events/afk_handler", "caller.time", [afk_time]);
		
		client.user_data.prepare("DELETE FROM afk WHERE user_id = ?").run(message.author.id);
		return message.reply(afk_message).then(async (sent_message) => {
			sent_message.delete({timeout: 5000});
		});
	}
	
	let users = message.mentions.users.array();
	for (let index = 0; index < users.length; index++) {
		let user = users[index];
		let get_user = client.user_data.prepare("SELECT * FROM afk WHERE user_id = ?").get(user.id);
		if (get_user) {
			let afk_time = client.functions.generateDurationString(client, message.author, message.guild, get_user.time);
			let afk_message = client.functions.getTranslation(client, message.author, message.guild, "events/afk_handler", "pinged", [get_user.name]) + "\n" + client.functions.getTranslation(client, message.author, message.guild, "events/afk_handler", "pinged.time", [afk_time]) + "\n\n" + get_user.reason;
			return message.reply(afk_message);
		}
	}
}
module.exports = messageAFK;
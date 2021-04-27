const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

module.exports = {
	name: "afk",
	path: path.basename(__dirname),
	usage: "command.afk.usage",
    cooldown: 5,
	description: "command.afk.desc",
	execute(client, message, args) {
		let actual_time = new Date().getTime();
        let reason = args.slice(0).join(" ");
		client.user_data.prepare("INSERT OR REPLACE INTO afk (user_id, name, reason, time) VALUES (?, ?, ?, ?);").run(message.author.id, message.author.tag, reason, actual_time);
		return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.afk.set", [message.author.tag]) + "\n\n" + reason);
	},
};
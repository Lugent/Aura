const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

module.exports = {
	name: "afk",
	path: path.basename(__dirname),
	usage: "afk.usage",
    cooldown: 5,
	description: "afk.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		let actual_time = new Date().getTime();
        let reason = args.slice(0).join(" ");
		client.user_data.prepare("INSERT OR REPLACE INTO afk (user_id, name, reason, time) VALUES (?, ?, ?, ?);").run(message.author.id, message.author.tag, reason, actual_time);
		return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/general/afk", "set", [message.author.tag]) + "\n\n" + reason);
	},
};
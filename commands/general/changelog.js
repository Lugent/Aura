const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const changelog = require(process.cwd() + "/configurations/changelog.js");
const path = require("path");
module.exports = {
    name: "changelog",
	path: path.basename(__dirname),
    aliases: ["version"],
    cooldown: 5,
    usage: "command.changelog.usage",
	description: "command.changelog.desc",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		let versionNumber = 0;
		if (args[0]) { versionNumber = args[0] - 1; }
		if (!changelog[versionNumber]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/general/changelog", "not_found"));
			return message.reply({embeds: [embed]});
		}
		
		let changelogMessage = "";
		for (let index = 0; index < changelog[versionNumber].data.length; index++) {
			changelogMessage += changelog[versionNumber].data[index] + "\n";
		}
		
        let embed = new Discord.MessageEmbed();
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/general/changelog", "embed.title", [changelog[versionNumber].version]));
		embed.setDescription((changelogMessage === "") && "command.changelog.embed.empty" || changelogMessage);
        embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/general/changelog", "embed.footer", [(versionNumber + 1), changelog.length])); 
		embed.setColor(0x66b3ff);
        return message.reply({embeds: [embed]});
    }
};
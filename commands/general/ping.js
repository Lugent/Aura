const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "ping",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,

    cooldown: 5,
	description: "ping.description",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
        var embed = new Discord.MessageEmbed();
		embed.setColor([254, 254, 254]);
		embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/general/ping", "loading"));
        message.reply({embeds: [embed]}).then(async old_message => {
            let ping = (old_message.createdTimestamp - message.createdTimestamp);
			let selfping = client.ws.ping;
            let pingcolor = [254, 254, 254];
            if (ping > 330) { pingcolor = [127, 0, 0]; }
            else if (ping > 225) { pingcolor = [255, 0, 0]; }
            else if (ping > 140) { pingcolor = [255, 255, 0]; }
            else if (ping > 75) { pingcolor = [0, 255, 0]; }
            else if (ping > 30) { pingcolor = [0, 255, 255]; }
            
            var embed = new Discord.MessageEmbed();
			embed.setColor(pingcolor);
			embed.setDescription(":satellite_orbital: " + "Roundtrip Latency: **" + ping + "**ms" + "\n" + ":satellite: " + "Bot Latency: **" + selfping + "**ms");
            old_message.edit({embeds: [embed]});
        });
	},
};
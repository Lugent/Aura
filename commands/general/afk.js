const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

const image_filters = [".png", ".jpg", ".gif", ".jpeg"];
const invite_filters = ["discord.gg", "discord.me", "discord.io/", "discordapp.com/invite"];

module.exports = {
	name: "afk",
	path: path.basename(__dirname),
	usage: "command.afk.usage",
    cooldown: 5,
	description: "command.afk.desc",
	//flags: constants.cmdFlags.dontLoad,
	execute(client, message, args) {
		let actual_time = new Date().getTime();
        let reason = args.slice(0).join(" ");
		client.user_data.prepare("INSERT OR REPLACE INTO afk (user_id, name, reason, time) VALUES (?, ?, ?, ?);").run(message.author.id, message.author.tag, reason, actual_time);
		return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.afk.set", [message.author.tag]) + "\n\n" + reason);
		
		/*let get_link = "";
		if (args.length) {
			for (var argument_index = 0; argument_index < arguments.length; argument_index++) {
				if (!args[argument_index]) { continue };
				if (image_filters.some(find_http => args[argument_index].includes(find_http))) {
					get_link = args.splice(argument_index).toString();
				}
			}
			reason = args.slice(0).join(" ");
		}*/
		
		/*let embed = new Discord.MessageEmbed();
		embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.afk.set", [message.author.tag])); // "**" + message.author.tag + "**" + " esta AFK"
		if (reason.length) { embed.setDescription(reason); }
		if (get_link.length) { embed.setImage(get_link); }
		embed.setColor([255, 255, 0]);
		return message.channel.send(embed);*/
	},
};
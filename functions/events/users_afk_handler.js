const Discord = require("discord.js");

const image_filters = [".png", ".jpg", ".gif", ".jpeg"];
const invite_filters = ["discord.gg", "discord.me", "discord.io/", "discordapp.com/invite"];

async function messageAFK(client, message) {
	let get_afk = client.user_data.prepare("SELECT * FROM afk WHERE user_id = ?").get(message.author.id); //client.user_afk.select.get(message.author.id);
	if (get_afk) {
		let afk_time = client.functions.generateDurationString(client, message.author, message.guild, get_afk.time);
		let afk_message = client.utils.getTrans(client, message.author, message.guild, "afk_handler.caller.returned", [message.author.tag]) + "\n" + client.utils.getTrans(client, message.author, message.guild, "afk_handler.caller.time", [afk_time]);
		
		client.user_data.prepare("DELETE FROM afk WHERE user_id = ?").run(message.author.id); //client.user_afk.delete.run(message.author.id);
		return message.channel.send(afk_message);
		
		/*var embed = new Discord.MessageEmbed();
		embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "afkhandler.title.gone", [message.author.tag]));
		embed.setFooter("Lasted " + afk_time)
		embed.setColor([0, 255, 0]);
		return message.channel.send(embed);*/ // message.author.tag
	}
	
	let users = message.mentions.users.array();
	for (let index = 0; index < users.length; index++) {
		let user = users[index];
		let get_user = client.user_data.prepare("SELECT * FROM afk WHERE user_id = ?").get(user.id); //client.user_afk.select.get(user.id);
		if (get_user) {
			let afk_time = client.functions.generateDurationString(client, message.author, message.guild, get_user.time);
			let afk_message = client.utils.getTrans(client, message.author, message.guild, "afk_handler.pinged", [message.author.tag]) + "\n" + client.utils.getTrans(client, message.author, message.guild, "afk_handler.pinged.time", [afk_time]) + "\n\n" + get_user.reason;
			return message.channel.send(afk_message);
			
			/*let reason = get_user.reason;
			let reason_array = reason.split(" ");
			let get_link = "";
			if (reason_array.length) {
				for (var argument_index = 0; argument_index < arguments.length; argument_index++) {
					if (!reason_array[argument_index]) { continue };
					if (image_filters.some(find_http => reason_array[argument_index].includes(find_http))) {
						get_link = reason_array.splice(argument_index).toString();
					}
				}
				reason = reason_array.slice(0).join(" ");
			}*/
			
			
			/*let embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "afkhandler.title.active", [get_user.name])); // get_user.name
			if (reason.length) { embed.setDescription(reason); }
			if (get_link.length) { embed.setImage(get_link); }
			embed.setFooter(afk_time + "ago.");
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);*/
		}
	}
}
module.exports = messageAFK;
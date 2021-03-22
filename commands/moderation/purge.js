const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "purge",
	path: path.basename(__dirname),
    cooldown: 1,
    usage: "command.purge.usage",
	description: "command.purge.desc",
    async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.purge.error.noguild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!message.member.permissions.has("MANAGE_MESSAGES")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.purge.error.onlyadmins"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		let member = undefined;
		if (args[0]) {
			let get_member = undefined;
			if (args[0]) { get_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
			
			let mentioned_member = message.mentions.members.first();
			member = mentioned_member || get_member;
		}
		
		let amount = member ? ((!isNaN(args[1])) ? args[1] : 0) : ((!isNaN(args[0])) ? args[0] : 0);
		if (!amount) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.purge.error.noamount"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		let filter = (get_message => (!get_message.pinned) && (!get_message.system));
		if (member) { filter = (get_message => (get_message.author.id == member.id) && (!get_message.pinned) && (!get_message.system)); }
		
		let get_messages = await message.channel.messages.fetch({limit: 100, force: true});
		let get_filtered_messages = get_messages.filter(filter);
		if (!get_filtered_messages.array().length) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.purge.failure.nomessages"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		let total_messages = get_filtered_messages.array().slice(0, amount);
		message.channel.bulkDelete(total_messages, true).then(async (deleted_messages) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.purge.success.desc", [total_messages.length]));
			embed.setColor([0, 255, 0]);
			message.channel.send(embed).then(async (sent_message) =>{ sent_message.delete({timeout: 3000}); });
		});
    }
};
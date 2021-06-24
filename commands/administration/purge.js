const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "purge",
	path: path.basename(__dirname),
    cooldown: 1,
    usage: "command.purge.usage",
	description: "command.purge.desc",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		if (!message.member.permissions.has("MANAGE_MESSAGES")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "no_permission"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		let member;
		if (args[0]) {
			let get_member;
			if (args[0]) { get_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
			
			let mentioned_member = message.mentions.members.first();
			member = mentioned_member || get_member;
		}
		
		let amount = member ? ((!isNaN(args[1])) ? args[1] : 0) : ((!isNaN(args[0])) ? args[0] : 0);
		if (!amount) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "no_amount"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		let filter = (get_message => (!get_message.pinned) && (!get_message.system));
		if (member) { filter = (get_message => (get_message.author.id == member.id) && (!get_message.pinned) && (!get_message.system)); }
		
		let get_messages = await message.channel.messages.fetch({limit: 100, force: true});
		let get_filtered_messages = get_messages.filter(filter);
		if (!get_filtered_messages.array().length) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "no_messages"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		let total_messages = get_filtered_messages.array().slice(0, amount);
		message.channel.bulkDelete(total_messages, true).then(async (deleted_messages) => {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "success", [total_messages.length]));
			if (member) { embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/purge", "success.member", [total_messages.length, member.user.tag])); }
			embed.setColor([0, 255, 0]);
			message.channel.send({embeds: [embed]}).then(async (sent_message) => { setTimeout(async () => { await sent_message.delete(); }, 5000); });
		});
    }
};
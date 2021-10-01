const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "purge",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "purge",
				description: "purge.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "INTEGER",
						name: "amount",
						description: "purge.amount.description",
						required: true
					},
					{
						type: "USER",
						name: "member",
						description: "purge.member.description",
						required: false
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "no_permission"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				}

				// Get the amount and the optional member, then make a search filter
				let message_amount = interaction.options.getInteger("amount")
				let target_member = interaction.options.getMember("member");
				let search_filter = target_member ? (get_message => (get_message.author.id === target_member.user.id) && (!get_message.pinned) && (!get_message.system)) : (get_message => (!get_message.pinned) && (!get_message.system));

				// Get the recent 100 messages and filter them
				let channel_messages = await interaction.channel.messages.fetch({limit: 100});
				let filtered_messages = channel_messages.filter(search_filter);
				if (!filtered_messages.size) { // No messages found
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "no_messages"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}

				// Get an array of messages to delete and delete it
				let target_messages = filtered_messages.first(message_amount);
				interaction.channel.bulkDelete(target_messages, true).then(async (deleted_messages) => {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "success", [target_messages.length]));
					if (target_member) { embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "success.member", [target_messages.length, target_member.user.tag])); }
					embed.setColor([47, 49, 54]);
					interaction.reply({embeds: [embed]}).then(async (sent_message) => { setTimeout(async () => { await sent_message.delete(); }, 5000); });
				});
			}
		}
	],
	
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
		if (!message.guild) {
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
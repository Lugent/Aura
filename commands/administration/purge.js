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
				await interaction.deferReply();

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
					return interaction.editReply({embeds: [embed]});
				}

				// Get an array of messages to delete and delete it
				let target_messages = filtered_messages.first(message_amount);
				interaction.channel.bulkDelete(target_messages, true).then(async (deleted_messages) => {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "success", [target_messages.length]));
					if (target_member) { embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/purge", "success.member", [target_messages.length, target_member.user.tag])); }
					embed.setColor([47, 49, 54]);
					interaction.editReply({embeds: [embed]}).then(async (reply_message) => { setTimeout(async () => { await interaction.deleteReply(); }, 5000); });
				});
			}
		}
	]
};
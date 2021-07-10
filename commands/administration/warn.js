const Discord = require("discord.js");
const path = require("path");
module.exports = {
    name: "warn",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "warn.usage",
	description: "warn.description",
	
	/**
	 * @param {Discord.Client} client The client bot
	 * @param {Discord.Message} message The target message
	 * @param {Array} args The arguments as array entries
	 * @param {String} prefix The used prefix
	 */
    async execute(client, message, args, prefix) {
		if (!message.guild) { // This command only works with guilds
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}

		// Minium need the required permissions
		if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "no_permission"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}

		// Need the first argument for the member input
		if (!args[0]) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "need_member"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}

		// Search the member via username and tag
		// Otherwise, search via the first mention
		// Otherwise, fetches the member via snowflake
		// If everything fails, return undefined
		let find_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.join(" ").length) === args.join(" ").toLowerCase().substring(0, args.join(" ").length));
		let mentioned_member = message.mentions.members.first();
		let fetched_member = await message.guild.members.fetch(args[0]).catch(async (error) => { return undefined; });

		// Check if the member is valid from above
        let member = find_member || mentioned_member || fetched_member;
		if (!member) { // Otherwise, send an error
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "dont_exists"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}

		// If the id is the same as the executor, abort the command and send a error
		if (member.user.id === message.author.id) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "cannot.yourself"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}

		// Get the optional reason
		let warn_reason = args.slice(1).join(" ");
		if (!warn_reason.length) { warn_reason = client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "no_reason"); }

		// Add the warn to the database
		client.server_data.prepare("INSERT INTO warns (guild_id, user_id, reason) VALUES (?, ?, ?);").run(message.guild.id, member.user.id, warn_reason);

		// Prepare a embed and send it
		let embed = new Discord.MessageEmbed();
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "success.title", [member.user.tag]));
		embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "success.description", [warn_reason]));
		embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/administration/warn", "success.footer", [message.author.tag]));
		return message.reply({embeds: [embed]});
	}
};
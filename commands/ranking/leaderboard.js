const Discord = require("discord.js");
const path = require("path");
module.exports = {
    name: "leaderboard",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "leaderboard.usage",
	description: "leaderboard.description",
	aliases: ["top"],
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		if ((message.channel.type !== "text") && (!((args[0]) && (message.author.id === client.config.owner)))) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/leaderboard", "no_guild"));
			embed.setColor([255, 255, 0]);
			return message.channel.send({embed: embed});
		}
		
		let guild = message.guild;
		if ((args[0]) && (message.author.id === client.config.owner)) {
			guild = await client.guilds.fetch(client, args[0]);
		}
		if (!guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/leaderboard", "invalid_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embed: embed});
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/leaderboard", "is_disabled"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embed: embed});
		}
		
		let members_levels = "";
		let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(guild.id);
		let members_get = await guild.members.fetch();
		for (let level_index = 0; level_index < levels_database.length; level_index++) {
			let rank = (level_index + 1);
			let level_element = levels_database[level_index];
			let member_find = members_get.find(member => { return member.user.id === level_element.user_id; });
			let member_name = "Invalid Member";
			if (member_find) { member_name = member_find.user.tag; }
			else {
				let user_find = await client.users.fetch(level_element.user_id);
				if (user_find) { member_name = user_find.tag; }
			}
			members_levels += "**" + "#" + rank + "**" + " | " + "**" + member_name + "**" + " | " + "Lv. " + "**" + level_element.level + "**" + " | " + "**" + client.functions.getFormattedNumber(level_element.score, 2) + "**" + " XP" + " | " + "**" + client.functions.getFormattedNumber(level_element.messages, 2) + "**" + " Messages" + "\n";
		}
		
		var embed = new Discord.MessageEmbed();
		embed.setAuthor(client.functions.getTranslation(client, message.author, message.guild, "commands/ranking/leaderboard", "embed.author", [guild.name]), guild.iconURL());
		embed.setDescription(members_levels);
		return message.channel.send({embed: embed});
    }
};
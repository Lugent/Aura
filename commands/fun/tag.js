const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "tag",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["t"],
	description: "tag.description",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		let subcommands_array = [
			"<tag_name>",
			"add <tag_name> <tag_content>",
			"remove <tag_name>",
			"list [user]",
			"owner <tag_tag>"
		];

        if (!args[0]) {
			let subcommands_string = "";
			for (let subcommands_index = 0; subcommands_index < subcommands_array.length; subcommands_index++) {
				subcommands_string += "**" + prefix + "tag" + " " + subcommands_array[subcommands_index] + "**" + "\n";
			}
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "main.subcommands") + ":");
			embed.setDescription(subcommands_string);
			embed.setColor(0x66b3ff);
			return message.reply({embeds: [embed]});
		}
		
		switch (args[0]) {
			case "add": {
				let tag_name = args[1];
				let tag_content = args[2];
				
				if (!tag_name) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "add.no_name"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				if (!tag_content) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "add.no_content"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "add.already_exists"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}

				if (subcommands_array.includes(tag_name)) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "add.hardcoded_command"));
					embed.setColor([255, 0, 0]);
					return message.reply(embed, {allowedMentions: {repliedUser: false}});
				}
				
				try {
					client.user_data.prepare("INSERT INTO tags (author_id, name, content, uses, creation_date) VALUES (?, ?, ?, ?, ?);").run(message.author.id, tag_name, tag_content, 0, Date.now());
				}
				catch (error) {
					throw error;
				}
				finally {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "add.created"));
					embed.setColor([0, 255, 0]);
					return message.reply({embeds: [embed]});
				}
				break;
			}
			
			case "remove": {
				let tag_name = args[1];
				if (!tag_name) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "remove.no_name"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (!find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "remove.dont_exists"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				if (message.author.id !== find_tag.author_id) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "remove.not_owner"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				
				try {
					client.user_data.prepare("DELETE FROM tags WHERE name = ?").run(tag_name);
				}
				catch (error) {
					throw error;
				}
				finally {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "remove.deleted"));
					embed.setColor([0, 255, 0]);
					return message.reply({embeds: [embed]});
				}
				break;
			}
			
			case "forceremove": {
				let tag_name = args[1];
				if (!tag_name) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "forceremove.no_name"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (!find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "forceremove.dont_exists"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				if (message.author.id !== process.env.OWNER_ID) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "forceremove.not_owner"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				
				try {
					client.user_data.prepare("DELETE FROM tags WHERE name = ?").run(tag_name);
				}
				catch (error) {
					throw error;
				}
				finally {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "forceremove.deleted"));
					embed.setColor([0, 255, 0]);
					return message.reply({embeds: [embed]});
				}
				break;
			}
			
			case "list": {
				let get_user;
				if (args[1]) { get_user = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
				
				let mentioned_user = message.mentions.users.first();
				let user = mentioned_user || get_user;
				if (!user) {
					if (args[1]) { user = await client.users.fetch(args[1]); } else { user = message.author; }
				}
				
				let tag_list = client.user_data.prepare("SELECT * FROM tags WHERE author_id = ? ORDER BY creation_date DESC;").all(get_user.id);
				if (!tag_list.length) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "list.not_tags"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let offset = (args[1] && (args[1] - 1)) || 0;
				let start_index = 25 * offset;
				let end_index = 25 * (offset + 1);
				if (start_index > tag_list.length) {
					start_index = 0;
					end_index = 25;
				}

				let tag_total = "";
				if (tag_list.length > 0) {
					for (let tag_index = Math.min(start_index, tag_list.length); tag_index < Math.min(end_index, tag_list.length); tag_index++) {
						let tag_element = tag_list[tag_index];
						tag_total += (tag_index + 1) + ".- " + tag_element.name + "\n";
					}
				}
				
				let embed = new Discord.MessageEmbed();
				embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "list.title", [message.author.tag]));
				embed.setDescription(tag_total);
				embed.setColor(0x66b3ff);
				return message.reply({embeds: [embed]});
			}
			
			case "owner": {
				let tag_name = args[1];
				if (!tag_name) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "owner.no_name"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (!find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "owner.dont_exists"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let user = await client.users.fetch(find_tag.author_id);
				if (!user) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "owner.no_user"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				let embed = new Discord.MessageEmbed();
				embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "owner.title", [user.tag]));
				embed.setColor(0x66b3ff);
				return message.reply({embeds: [embed]});
			}
			
			default: {
				let tag_name = args[0];
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (!find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/fun/tag", "use.dont_exists"));
					embed.setColor([255, 0, 0]);
					return message.reply({embeds: [embed]});
				}
				
				return message.reply(find_tag.content);
			}
		}
    }
};
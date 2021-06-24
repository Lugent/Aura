const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const maths = require("mathjs");
module.exports = {
	name: "users",
	path: path.basename(__dirname),
	description: "Muestra todos los usuarios en donde renocozco.",
	aliases: ["members"],
	usage: "[page]",
	flags: constants.cmdFlags.ownerOnly,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	execute(client, message, args, prefix) {
		let embed = new Discord.MessageEmbed();
		embed.setTitle("Lista de usuarios que reconozco:");

		let total_count = 0;
		let collected_users = new Discord.Collection();
		let all_guilds = client.guilds.cache.array();
		for (let index = 0; index < all_guilds.length; index++) {
			let all_guild_members = all_guilds[index].members.cache.array();
			for (let index = 0; index < all_guild_members.length; index++) {
				let element = all_guild_members[index];
				if (!collected_users.has(element.user.id)) {
					collected_users.set(element.user.id, {id: element.user.id, tag: element.user.tag, username: element.user.username, bot: element.user.bot});
					total_count = total_count + 1;
				}
			}
		}

		let total_array = collected_users.array();
		let users_array = new Array([]);
		if (total_array.length > 0) {
			for (let user_index = 0; user_index < total_array.length; user_index++) {
				if (total_array[user_index].bot) { continue; }
				users_array.push(total_array[user_index]);
			}
		}
		users_array.sort(function (a, b) {
			if (a.username > b.username) { return 1; }
			if (b.username > a.username) { return -1; }
			return 0;
		});

		let bots_array = new Array([]);
		if (total_array.length > 0) {
			for (let bot_index = 0; bot_index < total_array.length; bot_index++) {
				if (!total_array[bot_index].bot) { continue; }
				bots_array.push(total_array[bot_index]);
			}
		}
		bots_array.sort(function (a, b) {
			if (a.username > b.username) { return 1; }
			if (b.username > a.username) { return -1; }
			return 0;
		});

		let total_users_array = users_array.concat(bots_array);
		let offset = (args[0] && (args[0] - 1)) || 0;
		let start_index = 25 * offset;
		let end_index = 25 * (offset + 1);
		if (start_index > total_users_array.length) {
			start_index = 0;
			end_index = 25;
		}

		if (total_users_array.length > 0) {
			for (let index = Math.min(start_index, total_users_array.length); index < Math.min(end_index, total_users_array.length); index++) {
				let element = total_users_array[index];
				let is_bot = (element.bot && " :robot:") || "";
				embed.addField(element.tag + is_bot, element.id, true);
			}
		}
		embed.setFooter("Pagina " + (Math.ceil(start_index / 25) + 1) + " de " + Math.ceil(total_count / 25) + " (" + Math.min(start_index, total_users_array.length) + " de " + Math.min(end_index, total_users_array.length) + " de "+ total_count + " usuarios)");
		return message.channel.send({embeds: [embed]});
	},
}; 
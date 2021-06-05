const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const credits = require(process.cwd() + "/configurations/credits.js");
const path = require("path");
const os = require("os");
const packages_json = require(process.cwd() + "/package.json");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };
module.exports = {
    name: "about",
	path: path.basename(__dirname),
	format: {
		name: "about",
		description: "Look up information about the bot"
	},

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 */
    async execute(client, interaction)
    {
		let uptime_count = client.functions.generateDurationString(client, interaction.author, interaction.guild, client.readyAt.getTime());
		
		let creditsName = [];
		for (let credits_index = 0; credits_index < credits.length; credits_index++) {
			creditsName.push(credits[credits_index]);
		}

        let embed = new Discord.MessageEmbed();
		embed.setAuthor(client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.author", [client.users.cache.get(client.config.owner).tag]), client.users.cache.get(client.config.owner).displayAvatarURL({ format: "png", dynamic: true, size: 256 }));
		embed.setTitle(client.user.tag);
        embed.setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":gear: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.software") + ":", ":desktop: " + os.version() + " " + os.arch() + "\n" + ":scroll: " + "Node.js " + process.version + " - " + "discord.js v" + packages_json.dependencies["discord.js"]);
		embed.addField(":file_cabinet: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.resources_usage") + ":", ":battery: " + client.statsCPU.total.toFixed(2) + "%" + " / " + ":card_box: " + (process.memoryUsage().rss / 1000000).toFixed(2) + "MB", true);
		embed.addField(":satellite: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.time_connected") + ":", uptime_count, false);
		embed.addField(":tools: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.source_code") + ":", "[Github](https://github.com/Lucario-TheAuraPokemon/TheAuraPokemon-Bot/)", false);
		//embed.addField(":calendar_spiral: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.creation_date") + ":", client.functions.generateDateString(client, interaction.author, interaction.guild, client.user.createdAt).capitalize(), false);
		embed.addField(":medal: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "commands/general/about", "embed.credits") + ":", creditsName.join("\n"));
		embed.setColor(0x0580aa);
        return interaction.reply(embed);
    }
};
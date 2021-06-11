const Discord = require("discord.js");
const path = require("path");
const weather = require("weather-js");
module.exports = {
    name: "weather",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "cweather.usage",
	description: "weather.description",
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix)
    {
		if (!args[0]) { return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "no_arguments")); }
		
		let get_language = "es-ES";
		let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(message.guild.id);
		let server_language = server_data.language;
		switch (server_language) {
			case "en": { get_language = "en-US"; break; }
		}
		
		weather.find({search: args.slice(0).join(" "), degreeType: 'C', lang: get_language}, function(error, result) {
			if (error) {
				throw error;
			}
			
			if (!result[0]) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "not_found"));
				embed.setColor(0xff0000);
				return message.channel.send({embed: embed});
			}
			
			let currentWeather = result[0].current;
			let locationWeather = result[0].location;
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(currentWeather.observationpoint);
			embed.setThumbnail(currentWeather.imageUrl);
			embed.setDescription(currentWeather.skytext);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "embed.temp") + ": ", currentWeather.temperature + "°" +  locationWeather.degreetype);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "embed.wind") + ": ", currentWeather.winddisplay);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "embed.humidity") + ": ", currentWeather.humidity + "%");
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "embed.timezone") + ": ", currentWeather.day + " " + currentWeather.date + " (GMT "  + locationWeather.timezone + ")");
			embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands/information/weather", "embed.coords") + ": " + locationWeather.lat + " / " + locationWeather.long);
			embed.setColor(0x66b3ff);
			return message.channel.send({embed: embed});
		});
    }
};
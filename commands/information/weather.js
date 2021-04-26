const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const weather = require("weather-js");
module.exports = {
    name: "weather",
	path: path.basename(__dirname),
    //aliases: ["profile"],
    cooldown: 5,
    usage: "command.weather.usage",
	description: "command.weather.desc",
    async execute(client, message, args)
    {
		if (!args[0]) { return message.channel.send(client.functions.getTranslation(client, message.author, message.guild, "command.weather.error")); }
		
		let get_language = "es-ES";
		let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(message.guild.id);
		let server_language = server_data.language;
		switch (server_language) {
			case "en": { get_language = "en-US"; break; }
		}
		
		weather.find({search: args.slice(0).join(" "), degreeType: 'C', lang: get_language}, function(error, result) {
			if (error) {
				console.error(error);
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.weather.failure"));
				embed.setColor(0xff0000);
				return message.channel.send(embed);
			}
			
			if (!result[0]) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.weather.not_found"));
				embed.setColor(0xff0000);
				return message.channel.send(embed);
			}
			
			let currentWeather = result[0].current;
			let locationWeather = result[0].location;
			
			let embed = new Discord.MessageEmbed();
			embed.setTitle(currentWeather.observationpoint);
			embed.setThumbnail(currentWeather.imageUrl);
			embed.setDescription(currentWeather.skytext)
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.weather.embed.temp") + ": ", currentWeather.temperature + "°" +  locationWeather.degreetype)
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.weather.embed.wind") + ": ", currentWeather.winddisplay)
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.weather.embed.humidity") + ": ", currentWeather.humidity + "%")
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "command.weather.embed.timezone") + ": ", currentWeather.day + " " + currentWeather.date + " (GMT "  + locationWeather.timezone + ")")
			embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "command.weather.embed.coords") + ": " + locationWeather.lat + " / " + locationWeather.long);
			embed.setColor(0x66b3ff);
			return message.channel.send(embed);
		})
    }
};
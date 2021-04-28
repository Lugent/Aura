const Discord = require("discord.js");
async function first_time_welcome(client, guild) {
	console.log("Guild joined " + "'" + guild.name + "'" + "." + " (" + guild.id + ")");
	
	let channel_target;
	
	
	let welcome_description = [
		"Gracias por añadirme a su servidor y es un placer estar aqui.",
		"Soy un bot con caracteristicas posiblemente interesantes y detalladas.",
		"Para comenzar a saber como funciono escriba `=help`.",
		"Para saber la lista de cambios use `" + client.config.default.prefix + "changelog`. (Solo disponible en español).",
	];
	
	let bot_owner = client.users.cache.get(client.config.owner);
	let embed = new Discord.MessageEmbed();
	embed.setAuthor(bot_owner.tag, bot_owner.displayAvatarURL({format: "png", dynamic: false, size: 128}));
	embed.setTitle("Saludos.");
	embed.setDescription(welcome_description.join("\n"));
	embed.setColor([0, 0, 0]);
	
}
module.exports = first_time_welcome;
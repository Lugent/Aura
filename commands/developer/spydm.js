const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "spydm",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.ownerOnly,
    usage: "<usuario>",
	async execute(client, message, args) {
		let name_user = undefined;
		if (args[0]) { name_user = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		else { return; }

		if (!name_user) { name_user = client.users.cache.get(args[0]); }
		if (!name_user) { return message.channel.send("Usuario no encontrado, revise ID o tag."); }

		let get_channel = name_user.dmChannel;
		if (!get_channel) { await name_user.createDM({force: true}).then((dmChannel) => { get_channel = dmChannel; }); /*return message.channel.send("El DM con este usuario no existe.");*/ }

		let messages = get_channel.messages.cache.array();
		if (!messages.length) { return message.channel.send("No hay mensajes."); }

		for (let message_index = 0; message_index < messages.length; message_index++) {
			let get_message = messages[message_index];
			console.log(get_message.author.tag + ": " + get_message.cleanContent);
		}
    }
}; 
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "sayin",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["talkin", "speakin"],
    usage: "<channel> <message>",
    flags: constants.cmdFlags.ownerOnly,
	description: "El mismo comando de **say**, aunque en un canal de un servidor en especifico. Solo pon la ID del canal, el servidor se busca por si solo.",
    execute(client, message, args) {
        let channel_target = null;
        let channel_id = args[0];
        let message_content = args.slice(1).join(" ");
        let guilds_array = client.guilds.cache.array();
        for (let guild_index = 0; guild_index < guilds_array.length; guild_index++) {
            let guild_element = guilds_array[guild_index];
            channel_target = guild_element.channels.cache.get(channel_id);
            if (channel_target) { break; }
        }
		
        if (!channel_target) { return message.channel.send("El canal expecificado no existe, revisa bien la ID."); }
        if (!message_content) { return message.channel.send("No puedo mandar un agujero negro como mensaje."); }
		
        return channel_target.send(message_content).then(() => {
            console.log("SAYIN: " + message.author.tag + " => " + channel_target.name + " > " + message_content);
			
			if (message.channel.type === "text") {
				message.delete().catch(() => {
					message.channel.send("No he podido borrar el mensaje quien ha usando el comando, porfavor, pongame el permiso o si no le quita la gracia del comando.");
				})
			}
			else { message.channel.send("Enviado."); }
        }).catch(() => {
            message.channel.send("No pude enviarlo, sera que la API de discord falla o es idea mia?");
        });
    }
};
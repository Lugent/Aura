const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const download = require('file-download');
module.exports = {
    name: "dm",
	path: path.basename(__dirname),
    cooldown: 5,
    aliases: ["md", "private"],
    usage: "command.dm.usage",
	description: "command.dm.desc", //(Y con archivos, aunque es altamente experimental)",
    execute(client, message, args, prefix) {
		if (!args[0]) {
			var embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.dm.help.title", [prefix]));
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.dm.help.desc"));
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.dm.help.user"), client.utils.getTrans(client, message.author, message.guild, "command.dm.help.user.field"), false);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.dm.help.msg"), client.utils.getTrans(client, message.author, message.guild, "command.dm.help.msg.field"), false);
			embed.setColor([0, 255, 255]);
			return message.channel.send(embed);
		}
		
        let target = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(user => user.tag.toLowerCase().substring(0, args[0].length) === args[0].toLowerCase().substring(0, args[0].length));
        let msg = args.slice(1).join(" ");
        let file = undefined; //message.attachments.first();
		
		// message
        if ((!args[0]) || (!target)) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.user.failure.nofound")); }
		if (target.bot) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.user.failure.userbot")); }
		if (target.id === client.config.owner) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.user.failure.myowner")); }
		if (target.id === message.author.id) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.user.failure.yourself")); }
		
		// target
        if ((!msg) && (!file)) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.msg.failure.empty"));  }
        if ((msg === "** **") && (!file)) { return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.msg.failure.markdowncheat"));  }

        //if (file) { msg += "\n" + file.url; }
		//if (file) { download(file.url, { directory: "./tempfiles/", filename: file.name }, function(err) { if (err) { throw err; } }); }
        target.send(msg).then(() => {
			console.log("DM: " + message.author.tag + " => " + target.tag + " > " + msg);
            return ((message.channel.type === "text") && message.delete()) || (message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.target.sended")));
        }).catch(() => {
            return message.channel.send(client.utils.getTrans(client, message.author, message.guild, "command.dm.target.failure"));
        });
    }
};
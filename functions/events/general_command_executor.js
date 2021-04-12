const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
async function commandExecutor(client, message) {
	let prefix = client.config.default.prefix;
	if (message.guild) {
		let get_server_prefix = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(message.guild.id);  //client.server_prefix.select.get(message.guild.id);
		if (get_server_prefix) { prefix = get_server_prefix.prefix; }
	}
	
	let escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	let prefixRegex = new RegExp("^(<@!?" + client.user.id + ">|" + escapeRegex(prefix) + ")\\s*");
	if ((!prefixRegex.test(message.content)) || message.author.bot) { return; }

    // Get command
	let [, matchedPrefix] = message.content.match(prefixRegex);
	let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    let name = args.shift().toLowerCase();
	let command = client.commands.get(name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
    if (!command) {	return;	}
	
	// Flag check; if works with the bot's owner
    if ((command.flags & constants.cmdFlags.ownerOnly) && (message.author.id !== client.config.owner)) {
        var embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "cmdexec.error.owner", [client.users.cache.get(client.config.owner).tag])); // client.users.cache.get(client.config.owner).tag
        return message.channel.send(embed);
    }
	
	// Flag check; if works only on guilds
    if ((command.flags & constants.cmdFlags.guildOnly) && (message.channel.type !== "text")) {
        var embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "cmdexec.error.guild"));
        return message.channel.send(embed);
    }
	
	// Flag check; if works only on direct messages
	if ((command.flags & constants.cmdFlags.dmOnly) && (message.channel.type !== "dm")) {
        var embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "cmdexec.error.md"));
        return message.channel.send(embed);
    }
	
	// Guild check; if is disabled on that guild
	if (message.guild) {
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
		if (get_disabled_commands.includes(command.name)) {
			var embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "cmdexec.error.disabled"));
			return message.channel.send(embed);
		}
	}
	

    // Cooldown
	if (!client.cooldowns.has(command.name)) { client.cooldowns.set(command.name, new Discord.Collection()); }
    let time_actual = Date.now();
	let time_cooldown = (command.cooldown || 1) * 1000;
    let time_data = client.cooldowns.get(command.name);
    if (time_data.has(message.author.id)) {
        let time_count = time_data.get(message.author.id) + time_cooldown;
        if (time_actual < time_count) {
            let time_remaining = (time_count - time_actual) / 1000;
            var embed = new Discord.MessageEmbed();
            embed.setColor([0, 255, 255]);
            embed.setDescription(":information_source: " + client.utils.getTrans(client, message.author, message.guild, "cmdexec.error.cooldown", [time_remaining.toFixed(2)])); // time_remaining.toFixed(2)
            return message.channel.send(embed);
        }
    }

    // Execute
    try {
		client.last_msg = message.channel;
		command.execute(client, message, args, prefix);
	}
    catch (error) {
        console.error("Command failure '" + command.name + "'" + "\n", error);
		
		let error_name = "Undefined Error";
		if (error instanceof EvalError) { error_name = "Evaluation Error"; }
		else if (error instanceof RangeError) { error_name = "Range Error"; }
		else if (error instanceof ReferenceError) { error_name = "Reference Error"; }
		else if (error instanceof SyntaxError) { error_name = "Syntax Error"; }
		else if (error instanceof TypeError) { error_name = "Type Error"; }
		//else if (error instanceof AggregateError) { error_name = "Aggregate Error"; }
		//else if (error instanceof InternalError) { error_name = "INTERNAL ERROR"; }
		else if (error instanceof Discord.DiscordAPIError) { error_name = "Discord API Error"; }
		
		let code_error = "";
		if (error instanceof Discord.DiscordAPIError) { code_error = " - " + error.httpStatus; }
		
        var embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + "Execution Error");
        embed.addField(error_name + code_error, error.message || "");
        return message.channel.send(embed);
    }
    finally {
        time_data.set(message.author.id, time_actual);
        setTimeout(() => time_data.delete(message.author.id), time_cooldown);
    }
}
module.exports = commandExecutor;
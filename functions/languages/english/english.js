let language = {
	/* UTILS */
	"utils.date.day.sunday": "sunday",
	"utils.date.day.monday": "monday",
	"utils.date.day.tuesday": "tuesday",
	"utils.date.day.wednesday": "wednesday",
	"utils.date.day.thursday": "thursday",
	"utils.date.day.friday": "friday",
	"utils.date.day.saturday": "saturday",
	"utils.date.month.january": "january",
	"utils.date.month.february": "february",
	"utils.date.month.march": "march",
	"utils.date.month.april": "april",
	"utils.date.month.may": "may",
	"utils.date.month.june": "june",
	"utils.date.month.july": "july",
	"utils.date.month.august": "august",
	"utils.date.month.september": "september",
	"utils.date.month.october": "october",
	"utils.date.month.november": "november",
	"utils.date.month.december": "december",
	"utils.date.complete_date": "%s(3) %s(2), %s(4)",
	"utils.date.complete_time": "%s:%s:%s%s",
	"utils.duration.seconds": "seconds",
	"utils.duration.minutes": "minutes",
	"utils.duration.hours": "hours",
	"utils.duration.days": "days",
	/* UTILS */
	
	/* COMMAND CATEGORIES */
	"command.help.category.administration": "Administration",
	"command.help.category.general": "General",
	"command.help.category.developer": "Developer",
	"command.help.category.fun": "Fun",
	"command.help.category.information": "Information",
	"command.help.category.misc": "Misc",
	"command.help.category.ranking": "Ranking",
	"command.help.category.searching": "Searching",
	"command.help.category.utilities": "Utilities",
	/* COMMAND CATEGORIES */
	
	/* EXP HANDLER */
	"exphandler.levelup.image.level": "Lv",
	"exphandler.levelup.embed.title": "Level up!",
	"exphandler.levelup.embed.footer": "Guild",
	/* EXP HANDLER */
	
	/* AFK HANDLER */
	"afk_handler.caller.returned": "**%s** returned back from AFK.",
	"afk_handler.caller.time": "After %s.",
	"afk_handler.pinged": "**%s** is AFK.",
	"afk_handler.pinged.time": "During %s",
	/* AFK HANDLER */
	
	/* COMMAND EXECUTOR */
	"cmdexec.error.owner": "Only **%s** Can use that.",
	"cmdexec.error.autorized": "Only autorized users can use that.",
	"cmdexec.error.guild": "This command is useless on **Direct Messages**.",
	"cmdexec.error.md": "Use that on **Direct message**.",
	"cmdexec.error.cooldown": "Wait **%s second(s)** before use that again.",
	"cmdexec.error.disabled": "This command is disabled on this guild.",
	/* COMMAND EXECUTOR */
	
	/* ADMINISTRATION COMMANDS */
	// Ban
	"command.ban.usage": "<member> [reason]",
	"command.ban.desc": "Bans a member of the server with a specified reason. (Only members with **Ban Members** permission)",
	"command.ban.noreason": "No specified",
	"command.ban.error.noperms": "You didn't have **Ban Members** permissions to do that.",
	"command.ban.error.cantban": "The specified member isn't banneable.",
	"command.ban.error.dontexists.title": "Member not found.",
	"command.ban.error.dontexists.desc": "Either the member isn't on the server or didn't exists.",
	"command.ban.error.selfbot.desc": "Ehm.. I can't to that to myself.",
	"command.ban.error.self.desc": "Only leave the server and done.",
	"command.ban.error.owner.desc": "That's impossible.",
	"command.ban.error.creator.desc": "No.",
	"command.ban.success.title": "%s banned",
	"command.ban.success.reason": "**Reason:** %s",
	"command.ban.success.by": "Responsable: %s (%s)",
	
	// Purge
	"command.purge.usage": "[member] <amount>",
	"command.purge.desc": "Delete a amount of messages. Also you can specify the member.",
	"command.purge.error.noguild": "This command is exclusive to guilds",
	"command.purge.error.onlyadmins": "You need **Manage Messages** permission before.",
	"command.purge.error.noamount": "You didn't specified the amount of messages to delete.",
	"command.purge.failure.nomessages": "Not found messages, try again if you believe that is a error.",
	"command.purge.success.desc": "Deleted **%s** messages.",
	
	// Guild Settings
	"command.gsettings.usage": "[option] [value]",
	"command.gsettings.desc": "Configure bot's funtions inside the guild through Control Panel. (Require **Manage Guild** permission).",
	"command.gsettings.error.noguild": "Unable to use this command in a DM Channel.",
	"command.gsettings.setting.prefix": "Prefix",
	"command.gsettings.setting.language": "Language",
	"command.gsettings.embed.title": "Control Panel",
	"command.gsettings.embed.field.subcommands": "Subcommands",
	"command.gsettings.embed.field.actualsettings": "Actual Settings",
	"command.gsettings.error.noperms": "You lack **Manage Guild** permission to do this action.",
	"command.gsettings.error.invalidsubcommand": "Invalid option.",
	"command.gsettings.prefix.title": "Actual Prefix: %s",
	"command.gsettings.prefix.desc": "Usage %sgsettings prefix <new_prefix>",
	"command.gsettings.prefix.extra": "Or you can easily mention me and done. You decides.",
	"command.gsettings.prefix.error.notfound": "Couldn't find server's prefix, probably a database failure.",
	"command.gsettings.prefix.changed.new": "New prefix: %s",
	"command.gsettings.language.title": "Actual language: %s",
	"command.gsettings.language.list": "Available languages",
	"command.gsettings.language.footer": "Usage %sgsettings language <new_language>",
	"command.gsettings.language.error.notfound": "Couldn't find server's language, probably a database failure.",
	"command.gsettings.language.changed.new": "Language changed: %s",
	"command.gsettings.language.changed.warning": "This language is uncompleted, can contain translation failures or incomplete texts.",
	"command.gsettings.language.error.notenabled": "This language isn't available for the moment.",
	"command.gsettings.language.error.notexists": "This language doesn't exists.",
	"command.gsettings.toggle.error.noperms": "You lack from **Administrator** permission to do that.",
	"command.gsettings.toggle.error.invalidsubcommand": "Invalid subcommand.",
	"command.gsettings.toggle.function.disabled": "**%s** function disabled.",
	"command.gsettings.toggle.function.enabled": "**%s** function enabled.",
	"command.gsettings.toggle.error.command.notfound": "Invalid command/alias or not found.",
	"command.gsettings.toggle.error.command.developer": "Invalid command/alias or not found.", // "You can't disable a developer command.",
	"command.gsettings.toggle.error.command.cantdisable": "Cannot disabled this command.",
	"command.gsettings.toggle.command.disabled": "**%s** command disabled.",
	"command.gsettings.toggle.command.enabled": "**%s** command enabled.",
	
	// Kick
	"command.kick.usage": "<member> [reason]",
	"command.kick.desc": "Kicks a member from the server. (Requires **Kick Members** permission).",
	"command.kick.no_perms": "You lack from **Kick Members** permission to do that.",
	"command.kick.no_reason": "No reason.",
	"command.kick.dont_exists": "Specified member didn't exists.",
	"command.kick.myself": "Impossible to do that action.",
	"command.kick.yourself": "You can leave from the server easily.",
	"command.kick.is_owner": "Can't do that against server's ownership.",
	"command.kick.cant_kick": "I'm unable to do that due porably it's in a higher role that me.",
	"command.kick.success.title": "%s was kicked from the server.",
	"command.kick.success.reason": "Reason: %s",
	"command.kick.success.by": "Operator: %s",
	/* ADMINISTRATION COMMANDS */
	
	/* GENERAL COMMANDS */
	// Help
	"command.help.usage": "[command]",
	"command.help.desc": "Show all visible commands.",
	"command.help.list.title": "List of all visible commands:",
	"command.help.list.nodesc": "No description.",
	"command.help.list.footer": "Type %shelp [command] for specific information of a command.",
	"command.help.list.send.success": "Check your DM for the list of visible commands.",
	"command.help.list.send.failure": "Unable to show a list of visible commands due to, or your DMs are closed or the API failed.",
	"command.help.find.failure": "That command doesn't exists or wasn't found.",
	"command.help.find.aliases": "Aliases: ",
	"command.help.find.cooldown": "Cooldown: ",
	"command.help.find.cooldown.field": "%s second(s).",
	"command.help.find.send.success": "Check your DM for detaills of the command.",
	"command.help.find.send.failure": "Unable to show detaills of the command due to, or your DMs are closed or the API failed.",
	
	// Math
	"command.math.usage": "<math expression>",
	"command.math.desc": "A calculator, amazing.",
	"command.math.error.empty": "Empty expression, impossible to calculate.",
	"command.math.error.failure": "Syntax Error.",
	"command.math.error.fatal": "Unexcepted Execution",
	
	// Ping
	"command.ping.desc": "Latency meter. (Approximate).",
	"command.ping.loading": "**Wait...**",
	
	// Afk
	"command.afk.usage": "[reason]",
	"command.afk.desc": "Set your on AFK to let know other that you're not currently available." + "\n" + "When a user mentions you, I'll respond that you're AFK for the moment.",
	"command.afk.set": "**%s** is now AFK",
	
	// Invite
	"command.invite.usage": "Get a bot's invite.",
	
	// Discord Status
	"command.discordstatus.desc": "Views discord's status.",
	"command.discordstatus.servicestatus.none": "All System Operational",
	"command.discordstatus.servicestatus.minor": "Partial systems downgrade",
	"command.discordstatus.servicestatus.major": "Mayor systems downgrade",
	"command.discordstatus.servicestatus.critical": "Critical systems downgrade",
	"command.discordstatus.failure.fatal": "HTTP PETITION ERROR",
	/* GENERAL COMMANDS */
	
	/* FUN COMMANDS */
	// DM
	"command.dm.usage": "<user> <message>",
	"command.dm.desc": "Send a DM to a user.",
	"command.dm.help.title": "%sdm <user> <message>",
	"command.dm.help.desc": "Send a DM to a user.",
	"command.dm.help.user": "<user>",
	"command.dm.help.user.field": "The user to send DM. (Mention, ID or tag)",
	"command.dm.help.msg": "<message>",
	"command.dm.help.msg.field": "Message content. (Attached Files not supported).",
	"command.dm.user.failure.nofound": "The user didn't exists, or isn't in a mutla server with me, or the search failed.",
	"command.dm.user.failure.userbot": "Can't send DM t oa bot, specify a valid user.",
	"command.dm.user.failure.myowner": "Creator's DM only used for development.",
	"command.dm.user.failure.yourself": "Impossible to do that.",
	"command.dm.msg.failure.empty": "Discord doesn't allow empty messages, write something.",
	"command.dm.msg.failure.markdowncheat": "Markdown cheat disabled.",
	"command.dm.target.sended": "Message sended.",
	"command.dm.target.failure": "Not sended, the user has DM to Only Friend or the API is getting problems.",
	
	// Say
	"command.say.usage": "<message>",
	"command.say.desc": "Just a say command, that's it.",
	"command.say.msg.failure.empty": "Can't send empty message.",
	"command.say.msg.failure.markdowncheat": "Nice try, no markdown cheat.",
	"command.say.permissions": "Need **Manage Messages** permission to delete invocator message.",
	"command.say.delete.failure": "Can't delete invocator message, did I have the corrent permissions?",
	"command.say.send.failure": "Can't send message, API is okay?",
	/* FUN COMMANDS */
	
	/* INFORMATION COMMANDS */
	// Avatar
	"command.avatar.usage": "[user]",
	"command.avatar.desc": "Show your own photo profile or from others." + "\n" + "(Mention, ID or tag)",
	"command.avatar.show.footer": "%s's Photo Profile" + "\n" + "(%s)",
	"command.avatar.error.notfound": "User not found.",
	
	// Changelog
	"command.changelog.usage": "[page]",
	"command.changelog.desc": "Show the changelog. (Spanish only).",
	"command.changelog.error.notfound": "That version didn't exist.",
	"command.changelog.embed.title": "%s",
	"command.changelog.embed.empty": "No changelog...",
	"command.changelog.embed.footer": "Page %s of %s",
	
	// Guild
	"command.guild.usage": "[id]",
	"command.guild.desc": "Show server's info." + "\n" + "Or of a specified server, only works if I'm in that server.",
	"command.guild.dm.warning.title": "Command used in DM.",
	"command.guild.dm.warning.desc": "type **%sguild <id>** to get specific server's info.",
	"command.guild.loading.title": "Getting server's info...",
	"command.guild.loading.desc": "Hold on...",
	"command.guild.failure.title": "Error getting server's info.",
	"command.guild.failure.desc": "That server isn't available, or I'm not there, or the API failed.",
	"command.guild.data.members.empty": "Unknown",
	"command.guild.data.members.failure": "Member's list failed",
	"command.guild.data.members.online": "**%s** Online",
	"command.guild.data.members.idle": "**%s** Idle",
	"command.guild.data.members.dnd": "**%s** *Do Not Disturb*",
	"command.guild.data.members.offline": "**%s** Offline",
	"command.guild.data.members.bots": "**%s** Bots",
	"command.guild.data.members.members": "**%s** Members",
	"command.guild.data.members.total": "**%s** Total",
	"command.guild.data.verlevel.empty": "Unknown",
	"command.guild.data.verlevel.none": "None",
	"command.guild.data.verlevel.low": "Low",
	"command.guild.data.verlevel.medium": "Medium",
	"command.guild.data.verlevel.high": "High",
	"command.guild.data.verlevel.veryhigh": "Higher",
	"command.guild.data.region.empty": "Unknown",
	"command.guild.data.region.us.east": "United States East",
	"command.guild.data.region.us.center": "United States Center",
	"command.guild.data.region.us.south": "United States of South",
	"command.guild.data.region.us.west": "United States of West",
	"command.guild.data.region.sydney": "Sydney",
	"command.guild.data.region.southafrica": "Southafrica",
	"command.guild.data.region.russia": "Russia",
	"command.guild.data.region.japan": "Japan",
	"command.guild.data.region.india": "India",
	"command.guild.data.region.hongkong": "Hong Kong",
	"command.guild.data.region.brazil": "Brazil",
	"command.guild.data.region.singapore": "Singapur",
	"command.guild.data.region.europe": "Europe",
	"command.guild.data.language.empty": "Unknown",
	"command.guild.data.language.es": "Spanish",
	"command.guild.data.language.en": "English",
	"command.guild.data.explicitfilter.empty": "Unknown",
	"command.guild.data.explicitfilter.disabled": "Disabled",
	"command.guild.data.explicitfilter.noroles": "Members without roles",
	"command.guild.data.explicitfilter.everyone": "Everyone",
	"command.guild.data.mfalevel.off": "Deactivaded",
	"command.guild.data.mfalevel.on": "Activaded",
	"command.guild.data.booslevel.empty": "Unknown",
	"command.guild.data.booslevel.none": "None",
	"command.guild.data.booslevel.one": "Level 1",
	"command.guild.data.booslevel.two": "level 2",
	"command.guild.data.booslevel.three": "Level 3",
	"command.guild.data.booslevel.count": "%s boosts",
	"command.guild.data.booslevel.countboosters": "%s boosters",
	"command.guild.data.vertype.none": "No verified and no partnered",
	"command.guild.data.vertype.nopartner": "Verified and no partnered",
	"command.guild.data.vertype.noverify": "No verified and partnered",
	"command.guild.data.vertype.both": "Verified and partnered",
	"command.guild.data.communityfeatures.enabled": "Community Server",
	"command.guild.data.communityfeatures.discovery": "Visible in Discovery",
	"command.guild.data.communityfeatures.featured": "Featured in Discovery",
	"command.guild.data.communityfeatures.welcomescreen": "Welcome Screen",
	"command.guild.data.communityfeatures.vanitycode": "Custom Invite Code",
	"command.guild.data.extrafeatures.gif": "Animated Icon (GIF)",
	"command.guild.data.extrafeatures.banner": "Banner",
	"command.guild.data.extrafeatures.commerce": "Commerce Functions",
	"command.guild.data.extrafeatures.invitesplash": "Invite Splash Screen",
	"command.guild.data.extrafeatures.news": "News Channels",
	"command.guild.data.extrafeatures.vip": "VIP Features",
	"command.guild.data.channels.categorys": "%s Categories",
	"command.guild.data.channels.texts": "%s Text",
	"command.guild.data.channels.voices": "%s Voice",
	"command.guild.data.channels.news": "%s News",
	"command.guild.data.channels.stores": "%s Store",
	"command.guild.data.notifications.all": "All messages",
	"command.guild.data.notifications.mentions": "Only @mentions",
	"command.guild.data.systemchannel.nomessages": "No Messages",
	"command.guild.data.systemchannel.nowelcome": "Only Boosts",
	"command.guild.data.systemchannel.noboost": "Only Welcomes",
	"command.guild.data.systemchannel.all": "Welcomes and Boosts",
	"command.guild.data.systemchannel.disabled": "Disabled",
	"command.guild.data.widget.disabled": "Disabled",
	"command.guild.data.ruleschannel.none": "None",
	"command.guild.embed.region": "Voice Region",
	"command.guild.embed.language": "Language",
	"command.guild.embed.notifications": "Notifications",
	"command.guild.embed.moderator": "Moderation",
	"command.guild.embed.filter": "Explicit Filter",
	"command.guild.embed.mfa": "MFA",
	"command.guild.embed.members": "Members",
	"command.guild.embed.members.max": "(%s max)",
	"command.guild.embed.channels": "Channels",
	"command.guild.embed.channels.field.none": "None",
	"command.guild.embed.roles": "Roles",
	"command.guild.embed.roles.field.none": "None",
	"command.guild.embed.roles.field.count": "%s Roles",
	"command.guild.embed.emojis": "Emotes",
	"command.guild.embed.emojis.field.none": "None",
	"command.guild.embed.emojis.field.normal": "%s Normal",
	"command.guild.embed.emojis.field.animated": "%s Animated",
	"command.guild.embed.boostlevel": "Boosts",
	"command.guild.embed.community": "Community",
	"command.guild.embed.creationdate": "Creation Date",
	"command.guild.embed.locale": "Locate",
	"command.guild.embed.stats": "Stats",
	"command.guild.embed.features": "Features",
	"command.guild.embed.admin": "Administration",
	"command.guild.embed.systemchannel": "System Channel",
	"command.guild.embed.widget": "Widget",
	"command.guild.embed.ruleschannel": "Rules Channel",
	
	// Guilds
	"command.guilds.desc": "Show all servers that I'm in.",
	"command.guilds.embed.title": "List of servers that I'm in",
	"command.guilds.embed.footer": "%s servers.",
	
	// Minecraft server
	"command.mcserver.usage": "<ip> [/p] [/m] [/s] [/w]",
	"command.mcserver.desc": "Get Minecraft: Java Edition or Minecraft: Bedrock Edition server's info.",
	"command.mcserver.help.title": "mcserver <ip> [/p] [/m] [/s] [/w]",
	"command.mcserver.help.desc": "Get Minecraft: Java Edition or Minecraft: Bedrock Edition server's info.",
	"command.mcserver.help.args0": "<ip>",
	"command.mcserver.help.args0.field": "IP's Server.",
	"command.mcserver.help.args1": "[/p]",
	"command.mcserver.help.args1.field": "Get online player list." + "\n" + "(Didn't work sometimes).",
	"command.mcserver.help.args2": "[/m]",
	"command.mcserver.help.args2.field":  "Get plugins and/or mods list." + "\n" + "(Didn't work sometimes).",
	"command.mcserver.help.args3": "[/s]",
	"command.mcserver.help.args3.field": "Get server's software (custom JAR) that runs the server." + "\n" + "(Didn't work sometimes).",
	"command.mcserver.help.args4": "[/w]",
	"command.mcserver.help.args4.field": "Get server's current world." + "\n" + "(Didn't work sometimes).",
	"command.mcserver.help.footer": "API: https://api.mcsrvstat.us/",
	"command.mcserver.loading.desc": "Getting server's info...",
	"command.mcserver.loading.toolong": "Operation is taking too long, please wait...",
	"command.mcserver.failure.desc": "Unable to get server's info.",
	"command.mcserver.error.desc": "AN INTERNAL ERROR OCURRED DURING THE PROCESS",
	"command.mcserver.data.motd": "MOTD",
	"command.mcserver.data.info": "Info",
	"command.mcserver.data.players": "Players",
	"command.mcserver.data.players.list": "Playerlist",
	"command.mcserver.data.players.list.limit": "There's to many players only that reach Discord's limits!",
	"command.mcserver.data.players.list.send": "Due Discord's limits, playerlist was sended to a attached text file.",
	"command.mcserver.data.version": "Version",
	"command.mcserver.data.world": "World",
	"command.mcserver.data.software": "Software",
	"command.mcserver.data.plugins": "Plugins",
	"command.mcserver.data.mods": "Mods",
	"command.mcserver.data.ip": "IP",
	"command.mcserver.data.notonline": "The server is offline",
	"command.mcserver.data.dontexists": "The server didn't exists",
	
	// Member
	"command.member.usage": "[member]",
	"command.member.desc": "Show specific member's info." + "\n" + "(Mention, ID or tag)",
	"command.member.dm.warning.title": "Command used on DM",
	"command.member.dm.warning.desc": "Please use the same command in a server." + "\n" + "In the server you can specify the member using `%smember [miembro]`.",
	"command.member.loading.title": "Getting member's info...",
	"command.member.loading.desc": "Hold a second...",
	"command.member.failure.title": "Error getitng member's info.",
	"command.member.failure.desc": "The member isn't on the server, or the API failed.",
	"command.member.data.permissions.general.viewchannel": "View Channels",
	"command.member.data.permissions.general.auditlog": "View Audit Log",
	"command.member.data.permissions.general.manageserver": "Manage Server",
	"command.member.data.permissions.general.managechannels": "Manage Channels",
	"command.member.data.permissions.general.manageroles": "Manage Roles",
	"command.member.data.permissions.general.manageemojis": "Manage Emotes",
	"command.member.data.permissions.general.managewebhooks": "Manage Webhooks",
	"command.member.data.permissions.membership.createinvite": "Create Instant Invite",
	"command.member.data.permissions.membership.changenickname": "Change Nickname",
	"command.member.data.permissions.membership.managenicknames": "Manage Nicknames",
	"command.member.data.permissions.membership.kickmembers": "Kick Members",
	"command.member.data.permissions.membership.banmembers": "Ban Members",
	"command.member.data.permissions.text.sendmessages": "Send Messages",
	"command.member.data.permissions.text.sendttsmessages": "Send TTS Messages",
	"command.member.data.permissions.text.insertlinks": "Insert Links",
	"command.member.data.permissions.text.insertfiles": "Attach Files",
	"command.member.data.permissions.text.addreactions": "Add Reactions",
	"command.member.data.permissions.text.useexternalemojis": "Use External Emotes",
	"command.member.data.permissions.text.mentioneveryone": "Mention Everyone and All Roles",
	"command.member.data.permissions.text.managemessages": "Manage Messages",
	"command.member.data.permissions.text.readmessagehistory": "View Messages History",
	"command.member.data.permissions.voice.connect": "Connect to Voice",
	"command.member.data.permissions.voice.speak": "Speak to Voice",
	"command.member.data.permissions.voice.stream": "Stream",
	"command.member.data.permissions.voice.usevad": "Voice Activity Detection",
	"command.member.data.permissions.voice.priorityspeaker": "Priority Speaker",
	"command.member.data.permissions.voice.mutemembers": "Mute Members",
	"command.member.data.permissions.voice.deafenmembers": "Deafen Members",
	"command.member.data.permissions.voice.movemembers": "Move and Disconnect Members",
	"command.member.embed.roles": "Roles",
	"command.member.embed.permissions.general": "Permissions (General)",
	"command.member.embed.permissions.membership": "Permissions (Members)",
	"command.member.embed.permissions.text": "Permissions (Text)",
	"command.member.embed.permissions.voice": "Permissions (Voice)",
	"command.member.embed.boostdate": "Boost Date",
	"command.member.embed.joindate": "Join Date",
	
	// Uptime
	"command.uptime.desc": "Show bot's info",
	"command.uptime.result.software": "Software",
	"command.uptime.result.resources_usage": "Resources usage",
	"command.uptime.result.time_connected": "Time connected",
	"command.uptime.result.time_connected.field": "%s days, %s hours, %s minutes, y %s seconds",
	"command.uptime.result.creation_date": "Creation date",
	
	// User
	"command.user.usage": "[user]",
	"command.user.desc": "Show specific user's info." + "\n" + "(Mention, ID or tag)",
	"command.user.loading.title": "Getting user's info...",
	"command.user.loading.desc": "Hold a moment...",
	"command.user.failure.title": "Error getting user's info.",
	"command.user.failure.desc": "User didn't exists, or API failed.",
	"command.user.data.badges.staff": "Discord's Staff",
	"command.user.data.badges.teamuser": "Team User",
	"command.user.data.badges.system": "System",
	"command.user.data.badges.bughunter.levelone": "Bug Hunter - Level I",
	"command.user.data.badges.bughunter.leveltwo": "Bug Hunter - Level II",
	"command.user.data.badges.partner": "Discord's Partner",
	"command.user.data.badges.partneredserverowner": "Partnered server's owner",
	"command.user.data.badges.developer.verified": "Verified developer",
	"command.user.data.badges.developer.verified.early": "Early verified developer",
	"command.user.data.badges.early.supporter": "Early discord supporter",
	"command.user.data.badges.hypesquad.events": "Hypesquad Events",
	"command.user.data.badges.hypesquad.bravery": "Hypesquad (Bravery)",
	"command.user.data.badges.hypesquad.brillance": "Hypesquad (Brillance)",
	"command.user.data.badges.hypesquad.balance": "Hypesquad (Balance)",
	"command.user.data.status.online": "Online",
	"command.user.data.status.idle": "Idle",
	"command.user.data.status.dnd": "*Do Not Disturb*",
	"command.user.data.status.offline": "Offline",
	"command.user.data.device.web": "Web",
	"command.user.data.device.mobile": "Mobile",
	"command.user.data.device.desktop": "Desktop",
	"command.user.embed.status": "Status",
	"command.user.embed.device": "Connected on",
	"command.user.embed.locale": "Locale",
	"command.user.embed.badges": "Badges",
	"command.user.embed.creationdate": "Creation Date",
	"command.user.embed.id": "ID",
	
	// Weather
	"command.weather.usage": "<localization>",
	"command.weather.desc": "Show specific climatic status",
	"command.weather.error": "Specify a place.",
	"command.weather.failure": "Unexcepted error during consulting the weather.",
	"command.weather.embed.temp": "Temperature",
	"command.weather.embed.wind": "Wind",
	"command.weather.embed.humidity": "Humidity",
	"command.weather.embed.timezone": "Time Zone",
	"command.weather.embed.coords": "Coordinates",
	"command.weather.not_found": "Invalid location.",
	
	// Youtube
	"command.youtube.usage": "<search>",
	"command.youtube.desc": "Search a Youtube's video. (For the moment)",
	"command.youtube.error.nosearch": "Specify search.",
	"command.youtube.loading.desc": "Searching video...",
	"command.youtube.loading.channel": "Getting channel's video info...",
	"command.youtube.loading.stats": "Getting video's statistics...",
	"command.youtube.failure.fatal": "FAILED TO PROCESS HTTP REQUEST",
	"command.youtube.failure.notfound": "No result found.",
	"command.youtube.embed.stats": "Stats",
	
	// Image
	"command.image.usage": "<search>",
	"command.image.error.nosearch": "Specify search.",
	"command.image.loading.desc": "Searching image...",
	"command.image.warning.experimental": "Experimental command, errors ahead.",
	"command.image.success.string": "Result of: %s",
	"command.image.failure.fatal": "FAILED TO PROCESS HTTP REQUEST",
	"command.image.failure.notfound": "No result found.",
	
	// Rank
	"command.rank.usage": "[member]",
	"command.rank.desc": "Displays your own exp or others exp members.",
	"command.rank.warning.noguild": "This command only works in guilds.",
	"command.rank.error.disabled": "This command requires `exp` function to work.",
	"command.rank.error.nomember": "Couldn't find member.",
	"command.rank.error.bot": "Bots cannot be in the level system.",
	"command.rank.image.level": "Lv",
	"command.rank.image.xp": "XP",
	"command.rank.image.xp.max": "MAX",
	"command.rank.embed.title": "Current %s's level",
	"command.rank.embed.footer": "Guild",
	
	// Leaderboard
	"command.leaderboard.usage": "[page]",
	"command.leaderboard.desc": "Shows guild's exp leaderboard.",
	"command.leaderboard.warning.noguild": "You're not in a guild to use this command.",
	"command.leaderboard.error.disabled": "This command requires `exp` function to work.",
	"command.leaderboard.embed.author": "%s's Leaderboard",
	
	// Discord Status
	"command.discordstatus.desc": "Shows actual Discord's status.",
	"command.discordstatus.loading.desc": "Getting information...",
	"command.discordstatus.failure.fatal": "AN ERROR OCCURED DURING HTTP REQUEST.",
	
	// Music
	"command.music.usage": "<option> [value]",
	"command.music.desc": "Heard music. (INCOMPLETE)",
	
	// Geometry Dash
	"command.gd.usage": "Gets Robtop's Geometry Dash data via GDColon's API.",
	"command.gd.usage.title": "List of available subcommands",
	"command.gd.usage.field_0": "help",
	"command.gd.usage.desc_0": "Get help by specifying a subcommand.",
	"command.gd.usage.field_1": "search",
	"command.gd.usage.desc_1": "Search for levels with the use of filters. (Defaults to 'Most Downloaded').",
	"command.gd.usage.field_2": "level",
	"command.gd.usage.desc_2": "Get level's details using an ID.",
	"command.gd.usage.field_3": "profile",
	"command.gd.usage.desc_3": "Get player's profile via username or ID. (Only works with registered accounts).",
	"command.gd.usage.field_4": "comments",
	"command.gd.usage.desc_4": "Get comments from a level, or posts from a profile, or the comment history from a profile.",
	"command.gd.usage.field_5": "mappack",
	"command.gd.usage.desc_5": "Get a list of levels in the specified mappack.",
	"command.gd.usage.field_6": "gauntlets",
	"command.gd.usage.desc_6": "Get a list of level in the specified gauntlet.",
	"command.gd.usage.field_7": "leaderboard",
	"command.gd.usage.desc_7": "Gets the actual ~~and outdated~~ leaderboard, or the accurate leaderboard with some filters.",
	"command.gd.usage.field_8": "song",
	"command.gd.usage.desc_8": "Verifies if a song is allowed to use in-game.",
	"command.gd.usage.footer": "API by GDColon",
	"command.gd.invalid_subcommand": "Invalid subcommand.",
	"command.gd.help_invalid_command": "Invalid subcommand.",
	"command.gd.help.search.title": "%sgd search [arguments]",
	"command.gd.help.search.desc_main": "Search levels like Geometry Dash by using filters. If no filters were given, the search fallbacks to 'Most Downloaded'.",
	"command.gd.help.search.field_0": "/page=<number>",
	"command.gd.help.search.desc_0": "The number of the page to search.",
	"command.gd.help.search.field_1": "/difficulty=<number/string>",
	"command.gd.help.search.desc_1": "The difficulty to search." + "\n" + "Valid numbers: 0-11 (NA - Extreme Demon)" + "\n" + "Valid strings: `na`, `auto`, `easy`, `medium`, `hard`, `harder`, `insane`, `easy_demon`, `medium_demon`, `hard_demon`, `insane_demon`, `extreme_demon`.",
	"command.gd.help.search.field_2": "/length=<number/string>",
	"command.gd.help.search.desc_2": "The duration of the level." + "\n" + "Valid numbers: 0-4 (Tiny - XL)" + "\n" + "Valid strings: `tiny`, `short`, `medium`, `long`, `xl`.",
	"command.gd.help.search.field_3": "/count=<number>",
	"command.gd.help.search.desc_3": "Maximum of levels to display in the embed. (5 max. - 1 min.).",
	"command.gd.help.search.field_4": "/songID=<number/string>",
	"command.gd.help.search.desc_4": "The official song to search. (No support for Meltdown, World and Subzero yet)." + "\n" + "Valid numbers: 1-21 (Stereo Madness - Fingerdash)" + "\n" + "Valid strings: `stereo_madness`, `back_on_track`, `polargeist`, `dry_out`, `base_after_base`, `cant_let_go`, `jumper`, `time_machine`, `cycles`, `xstep`, `clutterfunk`, `theory_of_everything`, `electroman_adventures`, `clubstep`, `electrodynamix`, `hexagon_force`, `blast_processing`, `theory_of_everything_2`, `geometrical_dominator`, `deadlocked`, `fingerdash`.",
	"command.gd.help.search.field_5": "/customSong=<number>",
	"command.gd.help.search.desc_5": "The Newground's audio ID to search.",
	"command.gd.help.search.field_6": "/list=<ids>",
	"command.gd.help.search.desc_6": "Use different level IDs separated in commas to search in a specific way.",
	"command.gd.help.search.field_7": "/creators=<ids>",
	"command.gd.help.search.desc_7": "Same as above, but with player IDs.",
	"command.gd.help.search.field_8": "/user=<ids>",
	"command.gd.help.search.desc_8": "The player ID to get their levels.",
	"command.gd.help.search.field_9": "/type=<string>",
	"command.gd.help.search.desc_9": "The type of search, some search types can ignore filters." + "\n" + "Valid strings: `mostdownloaded`, `mostliked`, `trending`, `recent`, `awarded`, `featured`, `magic`, `halloffame`.",
	"command.gd.help.search.field_10": "/featured",
	"command.gd.help.search.desc_10": "Only levels with featured rating.",
	"command.gd.help.search.field_11": "/original",
	"command.gd.help.search.desc_11": "Only original levels.",
	"command.gd.help.search.field_12": "/twoPlayer",
	"command.gd.help.search.desc_12": "Only levels with two player mode.",
	"command.gd.help.search.field_13": "/coins",
	"command.gd.help.search.desc_13": "Only levels verified coinds.",
	"command.gd.help.search.field_14": "/epic",
	"command.gd.help.search.desc_14": "Only levels with epic rating.",
	"command.gd.help.search.field_15": "/starred",
	"command.gd.help.search.desc_15": "Only levels with star rating.",
	"command.gd.help.search.field_16": "/noStar",
	"command.gd.help.search.desc_16": "Only levels without star rating.",
	"command.gd.search.not_found": "No levels found!",
	"command.gd.search.failure": "Something went wrong...",
	"command.gd.level.no_argument": "No ID specified.",
	"command.gd.level.no_data": "Level not found!",
	"command.gd.level.failure": "Something went wrong...",
	"command.gd.profile.no_argument": "No username or ID specified.",
	"command.gd.profile.no_data": "Profile not found!",
	"command.gd.profile.failure": "Something went wrong...",
	
	// Wikipedia
	"command.wikipedia.usage": "Search information from Wikipedia.",
	"command.wikipedia.no_arguments": "Specify a search.",
	"command.wikipedia.not_found": "No result found.",
	"command.wikipedia.fatal_error": "Something went wrong during HTTP request.",
	
	// Google
	"command.google.usage": "<search>",
	"command.google.desc": "Perform a search via Google",
	"command.google.no_arguments": "Specify a search.",
	"command.google.loading": "Searching...",
	"command.google.results.author": "Results of %s",
	"command.google.results.title": "Found %s results." + "\n" + "(%s seconds aprox.).",
	"command.google.not_found": "No results found.",
	"command.google.fatal_failure": "Something went wrong during HTTP request."
	/* INFORMATION COMMANDS */
}
module.exports = language;
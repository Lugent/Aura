const Discord = require("discord.js");
async function invite_tracker(client) {
	//console.log("");
	await client.guild_invites.forEach(async function(guild) { await client.guild_invites.delete(guild); });
	var guilds_array = client.guilds.cache.array();
	for (var guild_index = 0; guild_index < guilds_array.length; guild_index += 1) {
		var guild_data = client.guild_invites.get(guilds_array[guild_index].id);
		if (!guild_data) {
			client.guild_invites.set(guilds_array[guild_index].id, new Discord.Collection());
			guild_data = client.guild_invites.get(guilds_array[guild_index].id);
		}
		
		await guilds_array[guild_index].fetchInvites().then(async (invites) => {
			var invites_array = invites.array();
			for (var invite_index = 0; invite_index < invites_array.length; invite_index += 1) {
				guild_data.set(invites_array[invite_index].code, invites_array[invite_index].uses);
			}
		});
	}
}
module.exports = invite_tracker;
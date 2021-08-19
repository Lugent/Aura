const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client 
 */
async function invite_tracker(client) {
	await client.guild_invites.forEach(async function(guild) { await client.guild_invites.delete(guild); });
	
	let invite_count = 0;
	let guilds_count = 0;
	client.guilds.cache.forEach(async function (guild) {
		let guild_data = client.guild_invites.get(guild.id);
		if (!guild_data) {
			client.guild_invites.set(guild.id, new Discord.Collection());
			guild_data = client.guild_invites.get(guild.id);
		}
		guilds_count++;
		
		await guild.invites.fetch().then(async (invites) => {
			invites.forEach(async function (invite) {
				guild_data.set(invite.code, invite.uses);
				invite_count++;
			});
		});
	});
}
module.exports = invite_tracker;
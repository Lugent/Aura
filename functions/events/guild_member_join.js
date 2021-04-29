const guild_invite_tracker = require(process.cwd() + "/functions/main/invite_tracker.js");
async function guild_member_join(client, member) {
	var get_guild = client.guild_invites.get(member.guild.id);
	await member.guild.fetchInvites().then(async (invites) => {
		var guild_invite = invites.find(invite => get_guild.get(invite.code) < invite.uses);
		if (guild_invite) {
			var member_inviter;
			if (guild_invite.inviter) {
				await client.users.fetch(guild_invite.inviter.id, true, true).then((user) => { member_inviter = user; });
				guild_invite_tracker(client);
				console.log("'" + member.user.tag + "' joined '" + member.guild.name + "', invite '" + guild_invite.code + "' by '" + member_inviter.tag + "'.");
				console.log("Invite was used " + guild_invite.uses + " times.");
			}
			else {
				console.log("'" + member.user.tag + "' joined '" + member.guild.name + "', but couldn't find the inviter.");
			}
		}
		else {
			if (member.user.bot) {
				console.log("'" + member.user.tag + "' joined '" + member.guild.name + "', as bot.");
			}
			else {
				console.log("'" + member.user.tag + "' joined '" + member.guild.name + "'.");
			}
		}
	});
}
module.exports = guild_member_join;
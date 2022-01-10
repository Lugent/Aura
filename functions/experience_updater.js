async function updateGuildLevels(client) {
	console.log("Updating levels...");
	
	let guild_count = 0;
	let member_count = 0;
	let added_count = 0;
	let updated_count = 0;
	let still_count = 0;
	client.guilds.cache.forEach(async function (guild) {
		guild.members.cache.forEach(async function (member) {
			if (!member.user.bot) {
				let get_level_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(guild.id, member.user.id);
				let get_level = get_level_data;
				if (!get_level) { get_level = {guild_id: guild.id, user_id: member.user.id, level: 0, score: 0, messages: 0}; added_count++; }
				
				let previous_level = get_level.level;
				let next_level = get_level.level + 1;
				let exp_score_base = client.config.exp_score_base;
				let score_goal = (next_level * next_level) * exp_score_base;
				let score_max = (client.config.exp_level_max * client.config.exp_level_max) * exp_score_base;
				let finished_level = false;
				let level_up = false;
				while (!finished_level) {
					if ((next_level <= client.config.exp_level_max) && (get_level.score > score_goal)) {
						get_level.level = next_level;
						next_level = get_level.level + 1;
						exp_score_base = client.config.exp_score_base;
						score_goal = (next_level * next_level) * exp_score_base;
						level_up = true;
						updated_count++;
					}
					else { finished_level = true; still_count++; }
				}
				
				if (get_level.score > score_max) { get_level.score = score_max; }
				if (!get_level_data) { client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(get_level.guild_id, get_level.user_id, get_level.level, get_level.score, get_level.messages); }
				else { client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?;").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id); }
				member_count++;
			}
		});
		guild_count++;
	});
	console.log("Looked at " + guild_count + " guilds and " + member_count + " members.");
	console.log("Added " + added_count + " entries, updated " + updated_count + " entries and " + still_count + " entries didn't changed.");
}
module.exports = updateGuildLevels;
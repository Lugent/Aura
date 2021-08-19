async function updateGuildLevels(client) {
	client.guilds.cache.forEach(async function (guild) {
		guild.members.cache.forEach(async function (member) {
			if (!member.user.bot) {
				let get_level_data = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? AND user_id = ?;").get(guild.id, member.user.id);
				let get_level = get_level_data;
				if (!get_level) { get_level = {guild_id: guild.id, user_id: member.user.id, level: 0, score: 0, messages: 0}; }
				
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
					}
					else { finished_level = true; }
				}
				
				if (get_level.score > score_max) { get_level.score = score_max; }
				if (!get_level_data) { client.server_data.prepare("INSERT INTO exp (guild_id, user_id, level, score, messages) VALUES (?, ?, ?, ?, ?);").run(get_level.guild_id, get_level.user_id, get_level.level, get_level.score, get_level.messages); }
				else { client.server_data.prepare("UPDATE exp SET level = ?, score = ?, messages = ? WHERE guild_id = ? AND user_id = ?;").run(get_level.level, get_level.score, get_level.messages, get_level.guild_id, get_level.user_id); }
			}
		});
	});
}
module.exports = updateGuildLevels;
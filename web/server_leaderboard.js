const fs = require("fs");
module.exports = {
	name: "server_leaderboard",
	async execute(client, app, request, response) {
		if (!client.connected) {
			return response.send("ERROR: Bot isn't connected!");
		}
		
		var get_header = await fs.readFileSync(process.cwd() + "/assets/web/html/main_header.html", "utf8");
		
		let target_guild = undefined;
		let target_id = request.params.id;
		if (target_id) {
			target_guild = await client.fetchers.getGuild(client, target_id);
		}
		if (!target_guild) {
			let variable_data = {
				web_header: get_header,
				bot_image: client.user.displayAvatarURL({format: "png", dynamic: true, size: 64}),
				error_message: "Invalid guild ID!"
			}
			fs.readFile(process.cwd() + "/assets/web/html/error.html", "utf8", function(err, data) {
				if (err) { console.error(err); }
				
				let html = data;
				let variables = Object.keys(variable_data);
				variables.forEach((x) => {
					let regex = new RegExp(`\\%\\%${x}\\%\\%`, "g");
					html = html.replace(regex, variable_data[x]);
				});
				return response.send(html);
			});
			return;
			//return response.send("ERROR: Invalid ID!");
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(target_guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (get_disabled_functions.includes("exp")) {
			let variable_data = {
				web_header: get_header,
				bot_image: client.user.displayAvatarURL({format: "png", dynamic: true, size: 64}),
				error_message: "Specified guild disabled Ranking system!"
			}
			fs.readFile(process.cwd() + "/assets/web/html/error.html", "utf8", function(err, data) {
				if (err) { console.error(err); }
				
				let html = data;
				let variables = Object.keys(variable_data);
				variables.forEach((x) => {
					let regex = new RegExp(`\\%\\%${x}\\%\\%`, "g");
					html = html.replace(regex, variable_data[x]);
				});
				return response.send(html);
			});
			return;
			//return response.send("ERROR: This guild disabled the Ranking system!");
		}
		
		let members_levels = "<table class=\"scoreboard_table\"><tr><th>Rank</th><th>Username</th><th>Level</th><th>Messages</th></tr>";
		let levels_database = client.server_data.prepare("SELECT * FROM exp WHERE guild_id = ? ORDER BY score DESC;").all(target_guild.id); //client.server_level.list.all(message.guild.id);
		let members_get = await client.fetchers.getGuildMembers(client, target_guild);
		for (let level_index = 0; level_index < levels_database.length; level_index++) {
			let level_element = levels_database[level_index];
			
			let next_level = level_element.level + 1;
			if (next_level > client.config.exp_level_max) { next_level = client.config.exp_level_max; }
			
			let exp_score_base = client.config.exp_score_base;
			let score_actual = (level_element.level * level_element.level) * exp_score_base;
			let score_goal = (next_level * next_level) * exp_score_base;
			let score_progress = ((level_element.score - score_actual) / (score_goal - score_actual)) * 100
			
			let rank = (level_index + 1);
			let member_find = members_get.find(member => member.user.id === level_element.user_id);
			let member_name = "Invalid Member"; //let member_name = member_find ? member_find.user.tag : "Invalid Member";
			let member_id = "Invalid ID";
			if (member_find) {
				member_name = member_find.user.tag;
				member_id = member_find.user.id;
			}
			else {
				let user_find = await client.fetchers.getUser(client, level_element.user_id);
				if (user_find) {
					member_name = user_find.tag;
					member_id = user_find.id;
				}
			}
			members_levels += "<tr><td>" + rank + "#" + "</td><td>" + member_name + " (" + member_id + ")" + "</td><td>" + "Lv. " + level_element.level + " (" + client.functions.number_formatter(level_element.score, 2) + " / " + client.functions.number_formatter(score_goal, 2) + " XP)" + "</td><td>" + level_element.messages + " Messages" + "</td></tr>";
		}
		members_levels += "</table>";
		
		let variable_data = {
			web_header: get_header,
			bot_image: client.user.displayAvatarURL({format: "png", dynamic: true, size: 64}),
			server_name: target_guild.name,
			server_leaderboard: members_levels
		}
		
		fs.readFile(process.cwd() + "/assets/web/html/server_leaderboard.html", "utf8", function(err, data) {
			if (err) { console.error(err); }
			
			let html = data;
			let variables = Object.keys(variable_data);
			variables.forEach((x) => {
				let regex = new RegExp(`\\%\\%${x}\\%\\%`, "g");
				html = html.replace(regex, variable_data[x]);
			});
			return response.send(html);
		});
	}
}
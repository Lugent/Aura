const config = {
	owner: "258976701730521088",
    default: {
		prefix: "=",
		language: "es",
	},
	web_dir: "web",
	commands_dir: "commands",
	exp_score_base: 50,
	exp_level_max: 780,
	exp_gainrate: 10,
	exp_cooldown: 4000,
	exp_shield_table: [
		{level: 720, type: 11}, {level: 660, type: 10}, {level: 600, type: 9}, {level: 540, type: 8},
		{level: 480, type: 7}, {level: 420, type: 6}, {level: 360, type: 5}, {level: 300, type: 4},
		{level: 240, type: 3}, {level: 180, type: 2}, {level: 120, type: 1}, {level: 60, type: 0}
	]
};
module.exports = config;
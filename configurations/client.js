const math = require("mathjs");
const config = {
	commands_dir: "commands",
	exp_score_base: 16,
	exp_level_max: 200,
	exp_gain_rate: 3,
	exp_cooldown: 7000,
	exp_exponent: 2,
	credits_gain_rate: 2,
	credits_max: Number.MAX_SAFE_INTEGER,
	credits_cooldown: 5000
};
config.exp_formula = function(level) { return math.floor(level * (config.exp_score_base ** config.exp_exponent)); }
module.exports = config;
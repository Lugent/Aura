const math = require("mathjs");
const config = {
	commands_dir: "commands",
	exp_score_base: 48,
	exp_level_max: 200,
	exp_gain_rate: 4,
	exp_cooldown: 10000,
	exp_exponent: 1.6,
};
config.exp_formula = function(level) { return math.floor(level * (config.exp_score_base ** config.exp_exponent)); }
module.exports = config;
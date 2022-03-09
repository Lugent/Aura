const math = require("mathjs");
const config = {
	commands_dir: "commands",
	exp_score_base: 27,
	exp_level_max: 200,
	exp_gain_rate: 9,
	exp_cooldown: 2000, //10000,
	exp_exponent: 1.5,
};
config.exp_formula = function(level) { return math.floor(level * (config.exp_score_base ** config.exp_exponent)); }
module.exports = config;
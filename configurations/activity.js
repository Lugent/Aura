let status_data = [
	{
		activities: [{
			name: process.env.DEFAULT_PREFIX + "help",
			type: "LISTENING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: process.env.DEFAULT_PREFIX + " or @mention",
			type: "LISTENING"
		}],
		status: "online"
	},
	{
		activities: [{
			name: "the Aura Pokémon",
			type: "WATCHING"
		}],
		status: "dnd"
	},
	{
		activities: [{
			name: "the Aura Power",
			type: "WATCHING"
		}],
		status: "dnd"
	},
	{
		activities: [{
			name: "with Lucario#6931",
			type: "PLAYING"
		}],
		status: "idle"
	},
	{
		activities: [{
			name: "for others Lucario",
			type: "WATCHING"
		}],
		status: "idle"
	},
];
module.exports = status_data;
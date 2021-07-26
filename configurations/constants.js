const cmdFlags = {
	ownerOnly: 1,
	noHelp: 2,
	dontLoad: 4,
	cantDisable: 8
};

const cmdTypes = {
	normalCommand: 1,
	slashCommand: 2,
	buttonInteraction: 4,
	selectMenuInteraction: 8
};
module.exports = {cmdFlags: cmdFlags, cmdTypes: cmdTypes};
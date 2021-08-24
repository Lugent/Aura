const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "eval",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand|constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "eval",
				description: "Ejecutar código JavaScript arbitrario.",
				options: [
					{
						type: "STRING",
						name: "eval",
						description: "Expresión a ejecutar",
						required: true
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (interaction.user.id !== process.env.OWNER_ID) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.author, interaction.guild, "events/command_executor", "only_owner", [client.users.cache.get(process.env.OWNER_ID).tag]));
					embed.setColor([255, 0, 0]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				eval(interaction.options.getString("eval"));
				return interaction.reply({content: "Ejecución hecha", ephemeral: true});
			},
		}
	],
	
	command_name: "eval",
    command_cooldown: 0,
    command_flags: constants.cmdFlags.ownerOnly,
    command_usage: "<expresión>",
	command_description: "Ejecutar código JavaScript arbitrario.",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async command_execute(client, message, args, prefix) {
        let evaluate = args.slice(0).join(" ");
        if (!evaluate.length) {
			let embed = new Discord.MessageEmbed();
            embed.setDescription(":no_entry: " + "Expresión invalido, no se puede ejecutar código inexistente.");
			embed.setColor([255, 0, 0]);
            return message.inlineReply(embed);
		}
        try { eval(evaluate); } catch (error) { throw error; }
    }
}; 
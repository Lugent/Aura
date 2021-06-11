const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const credits = require(process.cwd() + "/configurations/credits.js");
const path = require("path");
const os = require("os");
const packages_json = require(process.cwd() + "/package.json");

/**
 * @param {String} string 
 * @returns {String}
 */
function getMentionFromId(string) {
    if (string.startsWith("<@")) { string = string.slice(2); }
    if (string.endsWith(">")) { string = string.slice(0, -1); }
    if (string.startsWith("!")) { string = string.slice(1); }
    return string;
}

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };
module.exports = {
    name: "kick",
	path: path.basename(__dirname),
	format: {
		name: "kick",
		description: "Kicks a member with a specified reason",
        options: [
            {
                type: "USER",
                name: "member",
                description: "The member to kick",
                required: true,
            },
            {
                type: "STRING",
                name: "reason",
                description: "The reason of the kick",
                required: false,
            },
            {
                type: "BOOLEAN",
                name: "is_silent",
                description: "If true, the kick message only show up to the executor",
                required: false,
            }
        ]
	},

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.CommandInteraction} interaction
	 */
    async execute(client, interaction)
    {
        let is_silent = (interaction.options.get("is_silent") && interaction.options.get("is_silent").value);

        if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has("KICK_MEMBERS")) {
            return interaction.reply("You don't have the **Kick Members** permission for that!", {ephemeral: is_silent});
        }

        let get_member = interaction.options.get("member").member;
        if (!get_member) {
            return interaction.reply("You should specify a member!", {ephemeral: is_silent});
        }

        let reason = interaction.options.get("reason") ? interaction.options.get("reason").value : "No reason";
        get_member.kick(reason).then(async (member) => {
            await member.user.send("Kicked from **" + interaction.guild.name + "** with the reason of **" + reason + "**");
            return interaction.reply("kicked **" + get_member.user.tag + "**, with a reason of **" + reason + "**", {ephemeral: is_silent});
        }).catch(async (error) => {
            return interaction.reply("Failed to kick **" + get_member.user.tag + "**, check if my permissions and role position are correct.", {ephemeral: is_silent});
        });
    }
};
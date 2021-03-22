const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const ytdl = require("ytdl-core");
module.exports = {
    name: "music",
	path: path.basename(__dirname),
    cooldown: 5,
    usage: "command.music.usage",
	description: "command.music.desc",
    async execute(client, message, args, prefix)
    {
		if (message.channel.type !== "text") {
			message.channel.send("GO TO A TEXT CHANNEL YOU MORRON!!!");
			return;
		}
		
		let evoker_channel = message.channel;
		let voice_channel = message.member.voice.channel;
		if (!args[0]) {
			message.channel.send("Specify subcommand!" + "\n" + "`" + prefix + "music play <file/url>`");
			return;
		}
		
		switch (args[0]) {
			case "play": {
				if (!voice_channel) {
					message.channel.send("Join a voice channel!");
					return;
				}
				else {
					let youtube_link = undefined;
					let url_link = undefined;
					if (args[1]) {
						youtube_link = args[1].startsWith("https://www.youtube.com/") ? args[1] : undefined;
						url_link = (args[1].startsWith("http://") || args[1].startsWith("https://")) ? args[1] : undefined;
					}
					let audio_file = message.attachments.first() || undefined;
					let selected_music = youtube_link || url_link || audio_file;
					if (selected_music) {
						voice_channel.join().then(async (connection) => {
							//connection.on("disconnect", () => { evoker_channel.send("Disconnected."); });
							//connection.on("ready", () => { evoker_channel.send("Resumed connection."); });
							connection.on("error", (error) => { evoker_channel.send(error.message); });
							
							let target_audio = undefined;
							if (youtube_link) { target_audio = ytdl(youtube_link, {quality: "highestaudio"}); }
							else if (url_link) { target_audio = url_link; }
							else if (audio_file) { target_audio = audio_file.url; }
							
							let dispatcher = connection.play(target_audio, {highWaterMark: 1}); //connection.play("D:/Archivos/Variado/Audios/LSPE/bgmSpecialStage.wav");
							dispatcher.on("start", () => { evoker_channel.send("Playing..."); });
							dispatcher.on("error", () => {
								evoker_channel.send("An error occurred during playback. Disconnecting...");
								connection.disconnect();
							});
							/*dispatcher.on("finish", () => {
								evoker_channel.send("Playback ended. Disconnecting...");
								connection.disconnect();
							});*/
						});
					}
					else {
						message.channel.send("Specify an URL or an file!");
					}
				}
				break;
			}
			default: {
				message.channel.send("Invalid subcommand!" + "\n" + "`" + prefix + "music play <file/url>`");
				break;
			}
		}
    }
};
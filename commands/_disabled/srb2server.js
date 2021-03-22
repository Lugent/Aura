const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const net = require("net");
const https = require("https");
module.exports = { 
    name: "srb2server",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.noHelp,
	execute(client, message, args) {
		let socket = new net.Socket();
		socket.connect(5030, "173.255.224.103");
		socket.on("connect", () => { console.log("Connected!"); })
		socket.on("data", (data) => { console.log(data); })
		socket.on("error", (error) => { console.error(error); })
		console.log(socket.pending)
		// NOT WORKING, I DON'T HAVE ANY IDEA OF HOW SRB2'S COMNNECTIONS WORKS WITHOUT THE SERVER REFUSING THE REQUEST
		
		//let srb2_masterserver_url = 
		/*let kart_masterserver_url = "https://ms.kartkrew.org/ms/api/games/SRB2Kart/7/servers?v=2";
		let raw_masterserver_data = "";
		https.get(kart_masterserver_url, async (res) => {
			res.on("data", async (chunk) => { raw_masterserver_data += chunk; });
			res.on("end", async () => {
				console.log(raw_masterserver_data);
			});
		}).on("error", (error) => {
			console.error(error);
			
		});*/
	},
};
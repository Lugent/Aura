/* HEXADECIMAL x BINARY */
function binaryToHexadecimal(binary) { return parseInt(binary, 2).toString(16).toUpperCase(); }
function hexadecimalToBinary(hex) { return (parseInt(hex, 16).toString(2)).padStart(8, '0'); }

/* BINARY x STRING */
function binaryToString(binary) { return binary.split(' ').map((bin) => String.fromCharCode(parseInt(bin, 2))).join(''); }
function stringToBinary(string) {
	var result = "";
	for (var i = 0; i < string.length; i++) {
		var bin = string[i].charCodeAt().toString(2);
		result += Array(8 - bin.length + 1).join("0") + bin;
	} 
	return result;
}

/* RGB x HEXADECIMAL */
function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
function hexToRgb(hex) { // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) { return r + r + g + g + b + b; });

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)} : null;
}

const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "convert",
	path: path.basename(__dirname),
	description: "Convierte valores a otros valores. (INCOMPLETO)",
	aliases: ["conv"],
	usage: "<conversor> <valor>",
	cooldown: 5,
	//flags: constants.cmdFlags.noHelp,
	execute(client, message, args) {
        if (!args[0]) {
			var embed = new Discord.MessageEmbed();
			embed.setTitle("convert <conversor> <valor>");
			embed.setDescription("Convierte un valor a otro valor mediante un conversor.");
			embed.addField("<conversor>", "El tipo de conversor a usar." + "\n" + "Conversores actuales:" + "\n" + "**rgb**, **hex**, **string**, **bin**", false);
			embed.addField("<valor>", "El valor que se va a convertir.", false);
			embed.setColor([0, 255, 255]);
			return message.channel.send(embed);
		}
		
		switch (args[0]) {
			case "rgb": {
				if (!args[1]) {
					var embed = new Discord.MessageEmbed();
					embed.setTitle("Especifica valor a convertir a RGB");
					embed.setDescription("Valores permitidos:" + "\n" + "**hex**");
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
				}
				
				var result = hexToRgb(args[1]);
				if (!result) {
					var embed = new Discord.MessageEmbed();
					embed.setTitle("Valor especificado no valido");
					embed.setDescription("Valores permitidos:" + "\n" + "**hex**");
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
				}
				
				var embed = new Discord.MessageEmbed();
				embed.setTitle("Resultado:");
				embed.setDescription("R: " + result.r + " - " + "G: " + result.g + " - " + "B: " + result.b);
				embed.setColor([result.r, result.g, result.b]);
				return message.channel.send(embed);
				break;
			}
			
			case "hex": {
				
				break;
			}
			
			case "bin": {
				
				break;
			}
			
			case "string": {
				
				break;
			}
			
			default: {
				var embed = new Discord.MessageEmbed();
				embed.setTitle("Conversor no valido");
				embed.setDescription("Conversores actuales:" + "\n" + "**rgb**, **hex**, **string**, **bin**");
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
				break;
			}
		}
	},
};
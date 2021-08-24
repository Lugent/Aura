const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");

const Card = class {
	constructor(id, color) {
		this.id = id;
		this.color = color;
		this.wild = !this.color;
	}
	
	static deserialize(obj) {
		return new Card(obj.id, obj.color);
	}
	
	serialize() {
		return {id: this.id, color: this.color, wild: this.wild};
	}
	
	get idName() {
		return ((this.id > 9) ? ({10: "Skip", 11: "Reverse", 12: "+2", 13: "Color", 14: "+4"}[this.id]) : this.id);
    }
	
	get colorName() {
        return {0: "Wild", 1: "Red", 2: "Yellow", 3: "Green", 4: "Blue"}[this.color];
    }
	
	get emojiIcon() {
		return {0: "⚪", 1: "🔴", 2: "🟡", 3: "🟢", 4: "🔵"}[this.color];
	}
	
	get icon() {
		let color_folder = "";
		switch (this.color) {
			case 1: { color_folder = "red"; break; }
			case 2: { color_folder = "yellow"; break; }
			case 3: { color_folder = "green"; break; }
			case 4: { color_folder = "blue"; break; }
		}
		
		let id_file = this.id;
		switch (this.id) {
			case 10: { id_file = "skip"; break; }
			case 11: { id_file = "reverse"; break; }
			case 12: { id_file = "+2"; break; }
			case 13: { id_file = "color"; break; }
			case 14: { id_file = "+4"; break; }
		}
		
		let target_file = process.cwd() + "/assets/images/uno/" + color_folder + "_cards/" + id_file + ".png";
		if (this.wild) { return process.cwd() + "/assets/images/uno/wild_cards/" + id_file + ".png"; }
		if (fs.existsSync(target_file)) { return target_file; }
		return process.cwd() + "/assets/images/uno/unknown_card.png";
	}
	
	get value() {
		let value = 0;
		switch (this.color) {
			case 1: { value += 100; break; }
			case 2: { value += 200; break; }
			case 3: { value += 300; break; }
			case 4: { value += 400; break; }
		}
		
		switch (this.id) {
			case 10: { value += 10; break; }
			case 11: { value += 20; break; }
			case 12: { value += 30; break; }
			case 13: { value += 40; break; }
			case 14: { value += 50; break; }
			default: { value = this.id; break; }
		}
		return value;
	}

	toString() {
		if (this.wild) { return "Wild " + this.idName + (this.color ? (" " + this.colorName) : ""); }
		return this.colorName + " " + this.idName;
	}
}

const Player = class {
	constructor(member, game) {
		this.member = member;
		this.game = game;
		this.id = member.user.id;
		this.hand = [];
		this.called = false;
		this.finished = false;
		this.cardsPlayed = 0;
	}
	
	static async deserialize(obj, game) {
		let member = game.channel.guild;
	}
	
	sortHand() { this.hand.sort((a, b) => { return (a.value > b.value); }); }
	outputFormat() { return {id: this.id, cardsPlayed: this.cardsPlayed, name: this.member.user.tag}; }
	cardsChanged() { this.sortHand(); }
	
	async getCard(card, value, extra) {
		let find_card = new Card(Number(value), Number(card)); //StringToCard(card, value);
		if (!find_card) { return undefined; }
		
		if (find_card.wild) {
			if (!extra) { return -1; }
			
			let color = Number(extra);
			if (!color) { return undefined; }
			
			let get_card = this.hand.find(c => c.id === find_card.id);
			if (!get_card) { return undefined; }
			get_card.color = color;
			return get_card;
		}
		return this.hand.find(c => (c.id === find_card.id) && (c.color === find_card.color));
	}
}

const Game = class {
	constructor(client, channel) {
		this.client = client;
		this.channel = channel;
		this.players = {};
		this.queue = [];
		this.deck = [];
		this.discard = [];
        this.finished = [];
        this.dropped = [];
        this.started = false;
        this.confirm = false;
        this.lastChange = Date.now();
        this.drawn = 0;
        this.timeStarted = null;
        this.rules = {
			start_cards: 7, // initial player's cards
			decks: 4, // game decks
			callouts: true, // enabled callouts
			callout_amount: 4, // amount of cards of successfull callout
			pickup_skip: true, // skip a turn on pickup cards
			reverse_skip: false, // skip a turn on using reverse
			stackeable_two: true, // +2 stackeable
			stackeable_quad: true, // +4 stakeable
			one_winner: false // if the game ends if someone wins
		};
	}
	
	get player() { return this.queue[0]; }
    get flipped() { return this.discard[this.discard.length - 1]; }

    async next() {
        this.queue.push(this.queue.shift());
        this.queue = this.queue.filter(p => !p.finished);
        this.lastChange = Date.now();
    }
	
	addPlayer(member) {
        this.lastChange = Date.now();
        if (!this.players[member.user.id]) {
            let player = this.players[member.user.id] = new Player(member, this);
            this.queue.push(player);
            return player;
        }
        return undefined;
    }
	
	async start() {
        this.generateDeck();
        this.discard.push(this.deck.pop());
        await this.dealAll(this.rules.start_cards);
        this.started = true;
        this.timeStarted = Date.now();
    }
	
	async dealAll(number, players = this.queue) {
        let cards = {};
        for (let i = 0; i < number; i++) {
            let br = false;
            for (const player of players) {
                if (this.deck.length === 0) {
                    if (this.discard.length <= 1) { br = true; break; }
                    this.shuffleDeck();
                }
                let c = this.deck.pop();
                if (!c) { br = true; break; }
				if (!cards[player.id]) { cards[player.id] = []; }
                cards[player.id].push(c.toString());
                player.hand.push(c);
                this.drawn++;
            }
            if (br) { break; }
        }
        for (const player of players) {
            player.cardsChanged();
            player.called = false;
            if (cards[player.id].length > 0) { /* */ }
        }
    }

    async deal(player, number) {
        let cards = [];
        for (let i = 0; i < number; i++) {
            if (this.deck.length === 0) {
                if (this.discard.length <= 1) { break; }
                this.shuffleDeck();
            }
            let c = this.deck.pop();
            cards.push(c);
            player.hand.push(c);
            this.drawn++;
        }
        player.cardsChanged();
        player.called = false;
        return cards;
    }

    generateDeck() {
        for (let d = 0; d < this.rules.decks; d++) {
            for (const color of [1, 2, 3, 4]) {
                this.deck.push(new Card(0, color)); // 0
                for (let i = 1; i < 10; i++) { for (let ii = 0; ii < 2; ii++) { this.deck.push(new Card(i, color)); } } // 1 - 9
                for (let i = 0; i < 2; i++) { this.deck.push(new Card(10, color)); } // Skip
                for (let i = 0; i < 2; i++) { this.deck.push(new Card(11, color)); } // Reverse
                for (let i = 0; i < 2; i++) { this.deck.push(new Card(12, color)); } // +2
            }
            for (let i = 0; i < 4; i++) {
                this.deck.push(new Card(13, 0)); // Change Color
                this.deck.push(new Card(14, 0)); // +4
            }
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        let top = this.discard.pop();
        var j, x, i, a = [].concat(this.deck, this.discard);
        this.discard = [];
        if (a.length > 0) {
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
		}
        this.deck = a;
        if (top) { this.discard.push(top); }
    }
}

function StringToCard(card, value) {
	let id = -1;
	let color = -1;
	switch (card.toLowerCase()) {
		case "wild": { color = 0; break; }
		case "red": { color = 1; break; }
		case "yellow": { color = 2; break; }
		case "green": { color = 3; break; }
		case "blue": { color = 4; break; }
	}
	
	switch (value.toLowerCase()) {
		case "skip": { id = 10; break; }
		case "reverse": { id = 11; break; }
		case "+2": { id = 12; break; }
		case "color": { id = 13; break; }
		case "+4": { id = 14; break; }
		default: { id = Number(value); }
	}
	
	if (Number.isNaN(id) || (color < 0)) { return undefined; }
	return new Card(id, color);
}

async function deleteGame(client, id) { delete client.uno_games[id]; };

async function removePlayerFromGame(client, interaction, game, user) {
	let leave_embed = new Discord.MessageEmbed();
	leave_embed.setColor([47, 49, 54]);
	leave_embed.setDescription("**" + interaction.user.tag + "** left the game.");
	
    game.dropped.push(game.players[user.id]);
    if (game.started && game.queue.length <= 2) {
        game.queue = game.queue.filter(player => player.id !== user.id);
        game.finished.push(game.queue[0]);
        deleteGame(client, game.channel.id);
		
		let embed = new Discord.MessageEmbed();
		embed.setColor([47, 49, 54]);
		embed.setDescription("The game ended.")
		return interaction.reply({embeds: [leave_embed, embed]});
    }
	
    if (game.started && (game.player.member.id === user.id)) {
        game.next();
		
		let card_image = new Discord.MessageAttachment(game.flipped.icon, game.flipped.value + ".png");
		let card_embed = new Discord.MessageEmbed();
		card_embed.setColor([47, 49, 54]);
		card_embed.setDescription("The actual card is: **" + game.flipped.toString() + "**");
		card_embed.setImage("attachment://" + game.flipped.value + ".png");
		
		let turn_embed = new Discord.MessageEmbed();
		turn_embed.setColor([47, 49, 54]);
		turn_embed.setDescription("It's **" + game.player.member.user.tag + "**'s turn.");
		interaction.reply({attachments: [card_image], embeds: [leave_embed, card_embed, turn_embed]});
    }
	
    delete game.players[user.id];
    game.queue = game.queue.filter(p => p.id !== user.id);
    if (!game.started && !game.queue.length) {
        deleteGame(client, game.channel.id);
		
		let embed = new Discord.MessageEmbed();
		embed.setColor([47, 49, 54]);
		embed.setDescription("The game was cancelled since all players leaved.")
		return interaction.reply({embeds: [leave_embed, embed]});
    }
}

module.exports = {
    id: "uno",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "uno",
				description: "uno.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "join",
						description: "uno.join.description",
					},
					{
						type: "SUB_COMMAND",
						name: "quit",
						description: "uno.quit.description",
					},
					{
						type: "SUB_COMMAND",
						name: "start",
						description: "uno.start.description",
					},
					{
						type: "SUB_COMMAND",
						name: "hand",
						description: "uno.hand.description",
					},
					{
						type: "SUB_COMMAND",
						name: "draw",
						description: "uno.draw.description",
					},
					{
						type: "SUB_COMMAND",
						name: "callout",
						description: "uno.callout.description",
					},
					{
						type: "SUB_COMMAND",
						name: "uno",
						description: "uno.uno.description",
					},
					{
						type: "SUB_COMMAND",
						name: "table",
						description: "uno.table.description",
					},
					{
						type: "SUB_COMMAND",
						name: "play",
						description: "uno.play.description",
						options: [
							{
								type: "STRING",
								name: "card",
								description: "uno.play.card.description",
								choices: [
									{ name: "wild", value: "0" },
									{ name: "red", value: "1" },
									{ name: "yellow", value: "2" },
									{ name: "green", value: "3" },
									{ name: "blue", value: "4" }
									
								],
								required: true
							},
							{
								type: "STRING",
								name: "value",
								description: "uno.play.value.description",
								choices: [
									{ name: "0", value: "0" },
									{ name: "1", value: "1" },
									{ name: "2", value: "2" },
									{ name: "3", value: "3" },
									{ name: "4", value: "4" },
									{ name: "5", value: "5" },
									{ name: "6", value: "6" },
									{ name: "7", value: "7" },
									{ name: "8", value: "8" },
									{ name: "9", value: "9" },
									{ name: "skip", value: "10" },
									{ name: "reverse", value: "11" },
									{ name: "+2", value: "12" },
									{ name: "color", value: "13" },
									{ name: "+4", value: "14" }
								],
								required: true
							},
							{
								type: "STRING",
								name: "extra",
								description: "uno.play.extra.description",
								choices: [
									{ name: "red", value: "1" },
									{ name: "yellow", value: "2" },
									{ name: "green", value: "3" },
									{ name: "blue", value: "4" }
								],
								required: false
							}
						]
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				switch (interaction.options.getSubcommand()) {
					case "join": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { game = client.uno_games[interaction.channel.id] = new Game(client, interaction.channel); }
						
						if (game.started) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("The game already started.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						let player = game.addPlayer(interaction.member);
						if (!player) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You already joined to the game.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						else {
							if (game.queue.length === 1) {
								let embed = new Discord.MessageEmbed();
								embed.setColor([47, 49, 54]);
								embed.setDescription("**" + interaction.user.tag + "** created a game, use `/uno join` to join the game.");
								return interaction.reply({embeds: [embed]});
							}
							
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("**" + interaction.user.tag + "** joined the game, now there are " + game.queue.length + " players awaiting.");
							return interaction.reply({embeds: [embed]});
						}
						break;
					}
					
					case "quit": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { return interaction.reply({content: "There's not a currently game in progress.", ephemeral: true}); }
						if (!game.players.hasOwnProperty(interaction.user.id)) { return interaction.reply({content: "You didn't joined the game.", ephemeral: true}); }
						
						await removePlayerFromGame(client, interaction, game, interaction.user);
						break;
					}
					
					case "start": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("There's not a currently game in progress.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (!game.players[interaction.user.id]) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You didn't joined to the game.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (game.player.id !== interaction.user.id) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You're not the host to start the game.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
					
						if (game.started) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("The game already started.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (game.queue.length < 2) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("Not enough players to begin.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						await interaction.deferReply();
						await game.start();
						
						let players_embed = new Discord.MessageEmbed();
						players_embed.setColor([47, 49, 54]);
						players_embed.setTitle("The game started with " + game.queue.length + " players");
						players_embed.setDescription(game.queue.map(player => (player.member.user.tag + " | " + player.hand.length + " cards")).join("\n"));
					
						let card_image = new Discord.MessageAttachment(game.flipped.icon, game.flipped.value + ".png");
						let card_embed = new Discord.MessageEmbed();
						card_embed.setColor([47, 49, 54]);
						card_embed.setDescription("The actual card is: **" + game.flipped.toString() + "**");
						card_embed.setImage("attachment://" + game.flipped.value + ".png");
						
						let turn_embed = new Discord.MessageEmbed();
						turn_embed.setColor([47, 49, 54]);
						turn_embed.setDescription("It's **" + game.player.member.user.tag + "**'s turn.");
						
						let suggestion_embed = new Discord.MessageEmbed();
						suggestion_embed.setColor([47, 49, 54]);
						suggestion_embed.setDescription("Use `/uno hand` in order to view your current cards.");
						return interaction.editReply({files: [card_image], embeds: [players_embed, card_embed, turn_embed, suggestion_embed]});
						break;
					}
					
					case "hand": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { return interaction.reply({content: "There's not a currently game in progress.", ephemeral: true}); }
						if (!game.started) { return interaction.reply({content: "The game didn't started.", ephemeral: true}); }
						
						let player = game.players[interaction.user.id];
						if (!player) { return interaction.reply({content: "You're not joined to this game.", ephemeral: true}); }
						await interaction.deferReply({ephemeral: true});
						
						/*let cards = "";
						for (let index = 0; index < player.hand.length; index++) {
							cards += "**" + player.hand[index].toString() + "** \ ";
						}*/
						
						let embed = new Discord.MessageEmbed();
						embed.setColor([47, 49, 54]);
						embed.setAuthor("Your current cards", interaction.user.displayAvatarURL({format: "png", dynamic: true, size: 64}));
						embed.setDescription(player.hand.join(" / "));
						return interaction.editReply({embeds: [embed], ephemeral: true});
						break;
					}
					
					case "play": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("There's not a currently game in progress.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (!game.players[interaction.user.id]) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You didn't joined to the game.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (!game.started) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("The game didn't started.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (game.player.id !== interaction.user.id) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You can't do that because it's **" + game.player.member.user.tag + "** turn.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						let get_card = await game.player.getCard(interaction.options.getString("card"), interaction.options.getString("value"), interaction.options.getString("extra"));
						if (!get_card) {
							switch (get_card) {
								case -1: {
									let embed = new Discord.MessageEmbed();
									embed.setColor([47, 49, 54]);
									embed.setDescription("Specify the color in order to use that card.");
									return interaction.reply({embeds: [embed], ephemeral: true});
									break;
								}
								default: {
									let embed = new Discord.MessageEmbed();
									embed.setColor([47, 49, 54]);
									embed.setDescription("You don't have that card, use `/uno hand` if you're confused.");
									return interaction.reply({embeds: [embed], ephemeral: true});;
									break;
								}
							}
						}
						
						if (get_card.wild || (get_card.id === game.flipped.id) || (get_card.color === game.flipped.color)) {
							await interaction.deferReply();
							game.discard.push(get_card);
							game.player.hand.splice(game.player.hand.indexOf(get_card), 1);
							game.player.cardsChanged();
							
							let special_description;
							let special_embed = new Discord.MessageEmbed();
							special_embed.setColor([47, 49, 54]);
							if (!game.player.hand.length) {
								game.finished.push(game.player);
								game.player.finished = true;
								
								special_description = "**" + interaction.user.tag + "** has no more cards, and ended at Rank #" + game.finished.length + ".";
								if (game.rules.one_winner) { special_description = "**" + interaction.user.tag + "** has no more cards."; }
								
								if ((game.queue.length === 2) || game.rules.one_winner) {
									game.finished.push(game.queue[1]);
									deleteGame(client, game.channel.id);
									special_description += "\n" + "The game ended.";
									special_embed.setDescription(special_description);
									return interaction.editReply({embeds: [special_embed]});;
								}
								special_embed.setDescription(special_description);
							}
							
							// special cards
							let special_card = false;
							let play_embed = new Discord.MessageEmbed();
							play_embed.setColor([47, 49, 54]);
							switch (get_card.id) {
								case 10: { // skip
									let skipped = game.queue.shift();
									game.queue.push(skipped);
									
									play_embed.setDescription("**" + interaction.user.tag + "** played a **" + get_card.toString() + "**, now **" + skipped.member.user.tag + "** skips a turn.");
									special_card = true;
									break;
								}
								
								case 11: { // reverse
									let embed_description = "**" + interaction.user.tag + "** played a **" + get_card.toString() + "**.";
									if (game.queue.length > 2) {
										let player = game.queue.shift();
										game.queue.reverse();
										game.queue.unshift(player);
										embed_description += "\n" + "And now the turns are in reverse.";
									}
									else if (game.rules.reverse_skip) {
										let skipped = game.queue.shift();
										game.queue.push(skipped);
										embed_description += "\n" + "Now it's his turn again.";
									}
									
									play_embed.setDescription(embed_description);
									special_card = true;
									break;
								}
								
								case 12: { // +2
									let embed_description = "**" + interaction.user.tag + "** played a **" + get_card.toString() + "**.";
									if (game.rules.stackeable_two) {
										let amount = 0;
										for (let index = game.discard.length - 1; index >= 0; index--) {
											if (game.discard[index].id !== 12) { break; }
											amount += 2;
										}
										game.deal(game.queue[1], amount);
										embed_description += "\n" + "**" + game.queue[1].member.user.tag + "** pick up +" + amount + " cards.";
									}
									else {
										game.deal(game.queue[1], 2);
										embed_description += "\n" + "**" + game.queue[1].member.user.tag + "** pick up +2 cards.";
									}
									
									if (game.rules.pickup_skip) {
										game.queue.push(game.queue.shift());
										embed_description += "\n" + "And skips a turn.";
									}
									
									play_embed.setDescription(embed_description);
									special_card = true;
									break;
								}
								
								case 13: { // color
									play_embed.setDescription("**" + interaction.user.tag + "** played a **" + get_card.toString() + "**, and the color changed to **" + get_card.colorName + "**.");
									special_card = true;
									break;
								}
								
								case 14: { // +4
									let embed_description = "**" + interaction.user.tag + "** played a **" + get_card.toString() + "**.";
									if (game.rules.stackeable_quad) {
										let amount = 0;
										for (let index = game.discard.length - 1; index >= 0; index--) {
											if (game.discard[index].id !== 14) { break; }
											amount += 4;
										}
										game.deal(game.queue[1], amount);
										embed_description += "\n" + "**" + game.queue[1].member.user.tag + "** pick up +" + amount + " cards.";
									}
									else {
										game.deal(game.queue[1], 4);
										embed_description += "\n" + "**" + game.queue[1].member.user.tag + "** pick up +4 cards.";
									}
									
									if (game.rules.pickup_skip) {
										game.queue.push(game.queue.shift());
										embed_description += "\n" + "And skips a turn.";
									}
									
									embed_description += "\n" + "And the color changed to **" + get_card.colorName + "**.";
									play_embed.setDescription(embed_description);
									special_card = true;
									break;
								}
							}
							
							await game.next();
							
							if (!special_card) { play_embed.setDescription("**" + interaction.user.tag + "** played a **" + get_card.toString() + "**."); }
							
							let card_image = new Discord.MessageAttachment(game.flipped.icon, game.flipped.value + ".png");
							let card_embed = new Discord.MessageEmbed();
							card_embed.setColor([47, 49, 54]);
							card_embed.setDescription("The actual card is: **" + game.flipped.toString() + "**");
							card_embed.setImage("attachment://" + game.flipped.value + ".png");
							
							let turn_embed = new Discord.MessageEmbed();
							turn_embed.setColor([47, 49, 54]);
							turn_embed.setDescription("It's **" + game.player.member.user.tag + "**'s turn.");
							return special_description ? interaction.editReply({files: [card_image], embeds: [special_embed, play_embed, card_embed, turn_embed]}) : interaction.editReply({files: [card_image], embeds: [play_embed, card_embed, turn_embed]});
						}
						else {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You can't use that card here");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						break;
					}
					
					case "draw": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("There's not a currently game in progress.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (!game.players[interaction.user.id]) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You didn't joined to the game.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (!game.started) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("The game didn't started.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						if (game.player.id !== interaction.user.id) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription("You can't do that because it's **" + game.player.member.user.tag + "** turn.");
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						await interaction.deferReply();
						
						let card = game.deal(game.player, 1);
						let player = game.player;
						
						let draw_embed = new Discord.MessageEmbed();
						draw_embed.setColor([47, 49, 54]);
						draw_embed.setDescription("**" + game.player.member.user.tag + "**'s pick up a card.");
						
						await game.next();
						
						let card_image = new Discord.MessageAttachment(game.flipped.icon, game.flipped.value + ".png");
						let card_embed = new Discord.MessageEmbed();
						card_embed.setColor([47, 49, 54]);
						card_embed.setDescription("The actual card is: **" + game.flipped.toString() + "**");
						card_embed.setImage("attachment://" + game.flipped.value + ".png");

						let turn_embed = new Discord.MessageEmbed();
						turn_embed.setColor([47, 49, 54]);
						turn_embed.setDescription("It's **" + game.player.member.user.tag + "**'s turn.");
						return interaction.editReply({files: [card_image], embeds: [draw_embed, card_embed, turn_embed]});
						break;
					}
					
					case "table": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { return interaction.reply({content: "There's not a currently game in progress.", ephemeral: true}); }
						await interaction.deferReply();
						
						let players_embed = new Discord.MessageEmbed();
						players_embed.setColor([47, 49, 54]);
						players_embed.setTitle("There are " + game.queue.length + " players");
						players_embed.setDescription(game.queue.map(player => player.member.user.tag).join("\n"));
						if (!game.started) { return interaction.editReply({embeds: [players_embed]}); }
						
						players_embed.setDescription(game.queue.map(player => (player.member.user.tag + " | " + player.hand.length + " cards")).join("\n"));
					
						let card_image = new Discord.MessageAttachment(game.flipped.icon, game.flipped.value + ".png");
						let card_embed = new Discord.MessageEmbed();
						card_embed.setColor([47, 49, 54]);
						card_embed.setDescription("The actual card is: **" + game.flipped.toString() + "**");
						card_embed.setImage("attachment://" + game.flipped.value + ".png");
						
						let turn_embed = new Discord.MessageEmbed();
						turn_embed.setColor([47, 49, 54]);
						turn_embed.setDescription("It's **" + game.player.member.user.tag + "**'s turn");
						return interaction.editReply({files: [card_image], embeds: [players_embed, card_embed, turn_embed]});
						break;
					}
					
					case "callout": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { return interaction.reply({content: "There's not a currently game in progress.", ephemeral: true}); }
						if (!game.players.hasOwnProperty(interaction.user.id) || game.players[interaction.user.id].finished) { return interaction.reply({content: "You didn't joined the game.", ephemeral: true}); }
						if (!game.rules.callouts) { return interaction.reply({content: "Callouts aren't enabled for this game.", ephemeral: true}); }
						
						let warneds = [];
						for (const player of game.queue) {
							if ((player.hand.length === 1) && !player.called) {
								warneds.push(player);
								player.called = true;
							}
						}
						
						if (warneds.length > 0) {
							await interaction.deferReply();
							game.dealAll(Math.max(1, game.rules.callout_amount), warneds);
							return interaction.editReply({content: warneds.map(player => player.member.user.tag).join(", ") + ", forgot to say UNO!\nPick up " + Math.max(1, game.rules.callout_amount)});
						}
						return interaction.reply({content: "There's nobody to call out.", ephemeral: true});
						break;
					}
					
					case "uno": {
						let game = client.uno_games[interaction.channel.id];
						if (!game) { return interaction.reply({content: "There's not a currently game in progress.", ephemeral: true}); }
						if (!game.players.hasOwnProperty(interaction.user.id)) { return interaction.reply({content: "You didn't joined the game.", ephemeral: true}); }
						if (game.players[interaction.user.id].hand.length > 1) { return interaction.reply({content: "You don't have one card.", ephemeral: true}); }
						
						let player = game.players[interaction.user.id];
						if (!player.called) {
							player.called = true;
							return interaction.reply({content: "UNO! One card left!"});
						}
						return interaction.reply({content: "You already said UNO!", ephemeral: true});
						break;
					}
				}
			}
		}
	]
};
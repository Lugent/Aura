# LugentBot
## The Discord bot

It's just another multi-propuse bot.

## Invites
- Stable version: [Link](https://discord.com/api/oauth2/authorize?client_id=610988333618823188&permissions=8&scope=bot%20applications.commands)
- Canary version: [Link](https://discord.com/api/oauth2/authorize?client_id=836360465180917765&permissions=8&scope=bot%20applications.commands)

## Installation
- Clone this repository in a folder.
- Inside that folder, open tne command prompt.
- Type `npm install` to install all the needed dependencies.
- Once done, create a **.env** file.
- Add a key called **DISCORD_TOKEN** to place your Discord's bot application token.
- (Optional) Add a key called **GOOGLE_API_KEY** to your Google's API key, it's needed for commands using Google's API like `image`, `youtube` and `google`.
- (Optional) Add a key called **GOOGLE_CSE_ID** to your Google's Programmable Search ID, you need to create your own CSE to make the `image` and `google` command to work.
- Save the **.env** file.
- And finally, in the command prompt type `node main.js` and it should work fine.
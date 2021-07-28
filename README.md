# LugentBot
## The Discord bot

It's just another multi-propuse bot.

## Invites
- Stable version: [Link](https://discord.com/api/oauth2/authorize?client_id=610988333618823188&permissions=8&scope=bot%20applications.commands)
- Canary version: [Link](https://discord.com/api/oauth2/authorize?client_id=836360465180917765&permissions=8&scope=bot%20applications.commands)

## Installation
- Clone this repository in a folder.
- Inside that folder, open tne command prompt and type `npm install` to install all the needed dependencies.
- Once done, create a **.env** file.
- Inside that file, add a key called **DISCORD_TOKEN**, **DEFAULT_PREFIX**, **DEFAULT_LANGUAGE** and **OWNER_ID** to place your Discord's bot application token, default bot's prefix, default bot's panguage and bot's owner id. (REQUIRED).
- Then, add a key called **GOOGLE_API_KEY** and **GOOGLE_CSE_ID** to your Google's API key and Google's Programmable Search ID, it's needed for commands using Google's API like `image`, `youtube` and `google`.
- Save the **.env** file and in the command prompt, type `node main.js` and it should work fine.

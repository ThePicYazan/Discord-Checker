const { WebhookClient, EmbedBuilder } = require('discord.js');
const { webhook, speed } = require('./config');
const axios = require("axios");
const fs = require("fs");

const Done = new WebhookClient({ url: webhook });

const users = fs.readFileSync('users.txt', 'utf-8')?.replace(/\r|\x22/gi, '').split('\n');
const tokens = fs.readFileSync('tokens.txt', 'utf-8')?.replace(/\r|\x22/gi, '').split('\n');

let userIndex = 0;
let tokenyIndex = 0;

async function discord() {
    const user = users[userIndex];
    const token = tokens[tokenyIndex];
    try {
        let response = await axios({
            method: "POST",
            url: 'https://discord.com/api/v9/users/@me/pomelo-attempt',
            data: { username: user },
            headers: { Authorization: `${token}` },
        });

        const { data } = response;

        if (data.taken === false) {

            const embed = new EmbedBuilder();

            embed.setDescription(`> User Activate ${user}`);
            embed.setColor('Red');

            await Done.send({ content: '@everyone', embeds: [embed] });
            console.log(`User Activate ${user}`);
        } else {
            console.log(`Not Activate ${user}`);
        }
    } catch (error) {
        console.log(error?.response?.data?.message);
    }
    userIndex = (userIndex + 1) % users?.length;
    tokenyIndex = (tokenyIndex + 1) % tokens?.length;
}

setInterval(async () => {
    discord();
}, speed);
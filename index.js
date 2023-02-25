const Discord = require("discord.js");
const client = new Discord.Client();

const voiceChannelID = "ID"; // Reemplazar con la ID del canal de voz
const textChannelID = "ID"; // Reemplazar con la ID del canal de texto

let timer;
let timeInCall = 0;
let inCall = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", async(oldState, newState) => {
    const voiceChannel = client.channels.cache.get(voiceChannelID);

    if (voiceChannel.members.size > 0) {
        // Si hay alguien en el canal de voz
        if (!inCall) {
            // Si no se estaba contando
            inCall = true;
            timeInCall = 0;
            const startEmbed = new Discord.MessageEmbed()
                .setColor("#00FF00")
                .setTitle("Contador de tiempo en llamada")
                .setDescription(
                    `Hay ${voiceChannel.members.size} persona(s) en la llamada`
                )
                .addField("Tiempo en llamada", `${formatTime(timeInCall)}`);

            const textChannel = client.channels.cache.get(textChannelID);
            const message = await textChannel.send(startEmbed);

            timer = setInterval(() => {
                timeInCall += 5;
                const endEmbed = new Discord.MessageEmbed()
                    .setColor("#00FF00")
                    .setTitle("Contador de tiempo en llamada")
                    .setDescription(
                        `Hay ${voiceChannel.members.size} persona(s) en la llamada`
                    )
                    .addField("Tiempo en llamada", `${formatTime(timeInCall)}`);
                if (!message.deleted) {
                    message.edit(endEmbed);
                }
            }, 5000);
        }
    } else {
        // Si no hay nadie en el canal de voz
        inCall = false;
        clearInterval(timer);
        const endEmbed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Contador de tiempo en llamada")
            .setDescription("No hay nadie en la llamada")
            .addField("Tiempo en llamada", `${formatTime(timeInCall)}`);
        const textChannel = client.channels.cache.get(textChannelID);
        const message = await textChannel.send(endEmbed);
    }
});

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

client.login('TOKEN_BOT');
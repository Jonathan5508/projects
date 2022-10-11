const { Client, Guild, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "guildCreate",

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {

        const { name, members, channels } = guild

        let channelToSend

        channels.cache.forEach(channel => {

            if (channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(members.me).has("SendMessages")) channelToSend = channel
        })

        if (!channelToSend) return 

        if (guild.memberCount <= 10) {

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Server too Small")
                .setDescription(`This guild is too small for this bot. Please try again when the server is bigger.`)
                .setFooter({ text: "Developed by Zariel#6428" })
                .setTimestamp()

            await channelToSend.send({embeds: [Embed]})

            await guild.leave().catch(err => {

                if (err.code !== 50001) return console.log(err)

            })
        }


        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({name: name, iconURL: guild.iconURL()})
            .setDescription("Hey! This is **Starcade**! Thank you for inviting me to your server!")
            .setFooter({ text: "Developed by Zariel#6428"})
            .setTimestamp()

        const Row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://lightning-bot.xyz")
                .setLabel("Invite Me"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://lightning-bot.xyz")
                .setLabel("Dashboard"),
        )

        channelToSend.send({ embeds: [Embed], components: [Row]})
    }
}
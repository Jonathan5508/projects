const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {

        const { author, guild, content } = message
        const { user } = client

        if(!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({

            embeds: [

                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription(`Hey, you called me? I am Starcade! Nice to meet you! Type \`/\` and click on my logo to see my commands! \n\n*This message will be deleted in \`30 seconds\`.*`)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "Introduction to Starcade" })
                    .setTimestamp()
            ], 

            components: [

                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://lightning-bot.xyz")
                        .setLabel("Invite Me"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://lightning-bot.xyz")
                        .setLabel("Dashboard"),

                )
            ]
        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(err => {

                    if(err.code !== 10008) return console.log(err)
                })
            }, ms("30s"))
        })
    }
}
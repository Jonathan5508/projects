const { Client, GuildEmoji, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "emojiCreate", 

    /**
     * @param {GuildEmoji} emoji
     * @param {Client} client 
     */
    async execute(emoji, client) {
        const { guild, id } = emoji

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.EmojiStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Emoji Created")
                    .setDescription(`An emoji has been added to the server: ${emoji}. \nID: \`${id}\``)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Starcade"})
                    .setTimestamp()
            ]
        })
    }
}
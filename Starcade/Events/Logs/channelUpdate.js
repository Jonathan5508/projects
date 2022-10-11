const { Client, TextChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "channelUpdate", 

    /**
     * @param {TextChannel} oldChannel
     * @param {TextChannel} newChannel
     * @param {Client} client 
     */
    async execute(oldChannel, newChannel, client) {
        const { guild } = newChannel

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        if (oldChannel.topic !== newChannel.topic) {

            return Channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle("Channel Topic Updated")
                        .setDescription(`${newChannel}'s topic has been changed from \`${oldChannel.topic}\` to \`${newChannel.topic}\``)
                        .setThumbnail(guild.iconURL())
                        .setFooter({ text: "Logged by Starcade"})
                        .setTimestamp()
                ]
            })
        }
    }
}
const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "guildMemberAdd", 

    /**
     * @param {GuildMember} member
     * @param {Client} client 
     */
    async execute(member, client) {
        const { guild, user } = member

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.MemberJoin === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setThumbnail(guild.iconURL())
                    .setTitle("Member Joined")
                    .setDescription(`${member} has joined the server.`)
                    .setFooter({ text: "Logged by Starcade"})
                    .setTimestamp()
            ]
        })
    }
}
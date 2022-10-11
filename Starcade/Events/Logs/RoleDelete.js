const { Client, Role, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "roleDelete", 

    /**
     * @param {Role} role
     * @param {Client} client 
     */
    async execute(role, client) {
        const { guild, name } = role

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.RoleStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setThumbnail(guild.iconURL())
                    .setTitle("Role Created")
                    .setDescription(`A role has been deleted. \nName: \`${name}\``)
                    .setFooter({ text: "Logged by Starcade"})
                    .setTimestamp()
            ]
        })
    }
}
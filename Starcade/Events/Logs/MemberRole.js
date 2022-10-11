const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")


module.exports = {
    name: "guildMemberUpdate", 

    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client 
     */
    async execute(oldMember, newMember, client) {
        const { guild, user } = newMember

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) return
        if (Data.MemberRole === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await client.channels.cache.get(logsChannel)
        if(!Channel) return

        const oldRoles = oldMember.roles.cache.map(r => r.id)
        const newRoles = newMember.roles.cache.map(r => r.id)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setFooter({ text: "Logged by Starcade"})
            .setTimestamp()

        if (oldRoles.length > newRoles.length) {

            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle("Role Update")
                        .setDescription(`**${user.tag}** has lost the role. <@&${Role.id}>`)
                ]
            })
        } else if (oldRoles.length < newRoles.length) {

            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle("Role Update")
                        .setDescription(`**${user.tag}** now has the role. <@&${Role.id}>`)
                ]
            })
        } else return
    }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 */

function Unique(arr1, arr2) {

    let unique1 = arr1.filter(o => arr2.indexOf(o) === -1) 
    let unique2 = arr2.filter(o => arr1.indexOf(o) === -1)

    const unique = unique1.concat(unique2)

    return unique
}
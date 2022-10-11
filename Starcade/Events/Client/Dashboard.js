const { Client, ChannelType } = require("discord.js")
const DarkDashboard = require("dbd-dark-dashboard")
const DBD = require("discord-dashboard")
const WelcomeDB = require("../../Structures/Schemas/Welcome")
const LeaveDB = require("../../Structures/Schemas/Leave")
const GeneralLogsDB = require("../../Structures/Schemas/LogsChannel")
const LogsSwitchDB = require("../../Structures/Schemas/GeneralLogs")
const InviteChannelDB = require("../../Structures/Schemas/InviteLogChannel")


module.exports = {
    name: "ready", 

    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {

        const { user } = client

        let Information = []
        let Moderation = []

        const info = client.commands.filter(x => x.category === "Information")
        const mod = client.commands.filter(x => x.category === "Moderation")

        CommandPush(info, Information)
        CommandPush(mod, Moderation)

        await DBD.useLicense(process.env.DBD)
        DBD.Dashboard = DBD.UpdatedClass()

        const Dashboard = new DBD.Dashboard({

            port: 8000,
            client: {
                id: process.env.CLIENT_ID,
                secret: process.env.CLIENT_SECRET
            },
            redirectUri: "http://localhost:8000/discord/callback",
            domain: "http://localhost",
            bot: client,
            supportServer: {
                slash: "/support", 
                inviteUrl: "https://discord.gg/YKuQtWcTC5"
            },
            acceptPrivacyPolicy: true,
            minimalizedConsoleLogs: true,
            guildAfterAuthorization: {
                use: true,
                guildId: "959239060898078740"
            }, 
            invite: {
                clientId: client.user.id,
                scopes: ["bot", "applications.commands", "guilds", "identify"],
                permissions: "8",
                redirectUri: "http://localhost:8000/discord/callback"
            },
            theme: DarkDashboard({
                information: {
                    createdBy: "iMidnight",
                    websiteTitle: "iMidnight",
                    websiteName: "iMidnight",
                    websiteUrl: "https:/www.imidnight.ml/",
                    dashboardUrl: "http://localhost:3000/",
                    supporteMail: "support@imidnight.ml",
                    supportServer: "https://discord.gg/yYq4UgRRzz",
                    imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
                    iconURL: "https://www.imidnight.ml/assets/img/logo-circular.png",
                    loggedIn: "Successfully signed in.",
                    mainColor: "#2CA8FF",
                    subColor: "#ebdbdb",
                    preloader: "Loading..."
                },
            
                index: {
                    card: {
                        category: "iMidnight's Panel - The center of everything",
                        title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
                        image: "https://i.imgur.com/axnP93g.png",
                        footer: "Footer",
                    },
                    
                    information: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },
                    
                    feeds: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },
                },
        
                commands: [
                    {
                        category: `Information`,
                        subTitle: `Information Commands`,
                        aliasDisabled: false,
                        list: Information
                    },
                    {
                        category: `Moderation`,
                        subTitle: `Moderation Commands`,
                        aliasDisabled: false,
                        list: Moderation
                    },
                ],
            }),
            settings: [

                //Welcome System
                {
        
                    categoryId: "welcome",
                    categoryName: "Welcome System",
                    categoryDescription: "Setup the Welcome Channel",
                    categoryOptionsList: [
                        {
                            optionId: "welch", 
                            optionName: "Welcome Channel", 
                            optionDescription: "Set or reset the Welcome Channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({

                                        Guild: guild.id, 
                                        Channel: newData,
                                        DM: false, 
                                        DMMessage: null, 
                                        Content: false, 
                                        Embed: false
                                    })

                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldm", 
                            optionName: "Welcome DM", 
                            optionDescription: "Enable or Disable welcome (in DM)",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DM
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({

                                        Guild: guild.id, 
                                        Channel: null,
                                        DM: newData, 
                                        DMMessage: null, 
                                        Content: false, 
                                        Embed: false
                                    })

                                    await data.save()
                                } else {
                                    data.DM = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmopt", 
                            optionName: "Welcome DM Options", 
                            optionDescription: "Send Content",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Content
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({

                                        Guild: guild.id, 
                                        Channel: null,
                                        DM: false, 
                                        DMMessage: null, 
                                        Content: newData, 
                                        Embed: false
                                    })

                                    await data.save()
                                } else {
                                    data.Content = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmembed", 
                            optionName: "", 
                            optionDescription: "Send Embed",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Embed
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({

                                        Guild: guild.id, 
                                        Channel: null,
                                        DM: false, 
                                        DMMessage: null, 
                                        Content: false, 
                                        Embed: newData
                                    })

                                    await data.save()
                                } else {
                                    data.Embed = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmmsg", 
                            optionName: "Welcome Message (in DM)", 
                            optionDescription: "Send the Message to a newly joined Member",
                            optionType: DBD.formTypes.embedBuilder({
                                username: user.username,
                                avatarURL: user.avatarURL(),
                                defaultJson: {
                                    content: "Welcome", 
                                    embed: {
                                        description: "Welcome"
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DMMessage
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({

                                        Guild: guild.id, 
                                        Channel: null,
                                        DM: false, 
                                        DMMessage: newData, 
                                        Content: false, 
                                        Embed: false
                                    })

                                    await data.save()
                                } else {
                                    data.DMMessage = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                    ]
                },
                // Leave System
                {
                    categoryId: "leave",
                    categoryName: "Leeave System",
                    categoryDescription: "Setup channel for Leave System",
                    categoryOptionsList: [
                        {
                            optionId: "leavech", 
                            optionName: "Leave Channel", 
                            optionDescription: "Set or reset the leave Channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await LeaveDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LeaveDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new LeaveDB({

                                        Guild: guild.id, 
                                        Channel: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                    ]
                },
                // Logging System
                {
        
                    categoryId: "logs",
                    categoryName: "Logging System",
                    categoryDescription: "Setup channel for General & Invite Logger",
                    categoryOptionsList: [
                        {
                            optionId: "gench", 
                            optionName: "Logging Channel", 
                            optionDescription: "Set or reset the logger Channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new GeneralLogsDB({

                                        Guild: guild.id, 
                                        Channel: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memrole", 
                            optionName: "Configure Logger System", 
                            optionDescription: "Member Role",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberRole
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        MemberRole: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.MemberRole = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memnick", 
                            optionName: "", 
                            optionDescription: "Member Nickname",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberNick
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        MemberNick: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.MemberNick = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "chantopic", 
                            optionName: "", 
                            optionDescription: "Channel Topic",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelTopic
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        ChannelTopic: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.ChannelTopic = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memjoin", 
                            optionName: "", 
                            optionDescription: "Member Join",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberJoin
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        MemberJoin: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.MemberJoin = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memleave", 
                            optionName: "", 
                            optionDescription: "Member Leave",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberLeave
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        MemberLeave: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.MemberLeave = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memboost", 
                            optionName: "", 
                            optionDescription: "Member Boost",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBoost
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        MemberBoost: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.MemberBoost = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "rolestatus", 
                            optionName: "", 
                            optionDescription: "Role Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.RoleStatus
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        RoleStatus: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.RoleStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "chanstatus", 
                            optionName: "", 
                            optionDescription: "Channel Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelStatus
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        ChannelStatus: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.ChannelStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "emojistatus", 
                            optionName: "", 
                            optionDescription: "Emoji Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.EmojiStatus
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({

                                        Guild: guild.id, 
                                        EmojiStatus: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.EmojiStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "invch", 
                            optionName: "Invite Logging Channel", 
                            optionDescription: "Set or reset the invite logger Channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await InviteChannelDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await InviteChannelDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null

                                if (!data) {

                                    data = new InviteChannelDB({

                                        Guild: guild.id, 
                                        Channel: newData,
                                    })

                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                    ]
                },

            ]
        })

        Dashboard.init()
    }
}

function CommandPush(filteredArray, CommandArray) {

    filteredArray.forEach(obj => {

        let cmdObject = {
            commandName: obj.name,
            commandUsage: "/" + obj.name,
            commandDescription: obj.description,
            commandAlias: "None"
        } 

        CommandArray.push(cmdObject)
    })
}
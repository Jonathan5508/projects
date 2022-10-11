const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "activity",
    description: "Creates a Discord Together Activity",
    category: "Utility",
    options: [
        {
            name: "type",
            description: "Choose a Discord Activity",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Youtube",
                    value: "1",
                },
                {
                    name: "Chess",
                    value: "2",
                },
                {
                    name: "Betrayal",
                    value: "3",
                },
                {
                    name: "Poker",
                    value: "4",
                },
                {
                    name: "Fish",
                    value: "5",
                },
                {
                    name: "Letter Tile",
                    value: "6",
                },
                {
                    name: "Word Snack",
                    value: "7",
                },
                {
                    name: "Doodle Crew",
                    value: "8",
                },
                {
                    name: "Spell Cast",
                    value: "9",
                },
                {
                    name: "AwkWord",
                    value: "10",
                },
                {
                    name: "Putt Party",
                    value: "11",
                },
                {
                    name: "Checkers",
                    value: "12",
                },
                {
                    name: "Ocho",
                    value: "13"
                }
            ]
        }
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, member } = interaction
        const choices = options.getString("type")

        const App = client.discordTogether

        const VC = member.voice.channel
        if (!VC) return Reply(interaction, "❌", "You need to be in a Voice Channel to execute this command!", true)

        await interaction.deferReply()

        switch (choices) {

            case "1": {

                App.createTogetherCode(VC.id, "youtube").then(invite => EditReply(interaction, "👀", `Click here to join the **[Youtube Together Activity](${invite.code})**!`))

            }
                break;
            case "2": {

                App.createTogetherCode(VC.id, "chess").then(invite => EditReply(interaction, "👀", `Click here to join the **[Chess Together Activity](${invite.code})**!`))

            }
                break;
            case "3": {

                App.createTogetherCode(VC.id, "betrayal").then(invite => EditReply(interaction, "👀", `Click here to join the **[Betrayal Together Activity](${invite.code})**!`))

            }
                break;
            case "4": {

                App.createTogetherCode(VC.id, "poker").then(invite => EditReply(interaction, "👀", `Click here to join the **[Poker Together Activity](${invite.code})**!`))

            }
                break;
            case "5": {

                App.createTogetherCode(VC.id, "fish").then(invite => EditReply(interaction, "👀", `Click here to join the **[Fish Together Activity](${invite.code})**!`))

            }
                break;
            case "6": {

                App.createTogetherCode(VC.id, "lettertile").then(invite => EditReply(interaction, "👀", `Click here to join the **[Letter Tile Together Activity](${invite.code})**!`))

            }
                break;
            case "7": {

                App.createTogetherCode(VC.id, "wordsnack").then(invite => EditReply(interaction, "👀", `Click here to join the **[Words Snack Together Activity](${invite.code})**!`))

            }
                break;
            case "8": {

                App.createTogetherCode(VC.id, "doodlecrew").then(invite => EditReply(interaction, "👀", `Click here to join the **[Doodle Crew Together Activity](${invite.code})**!`))

            }
                break;
            case "9": {

                App.createTogetherCode(VC.id, "spellcast").then(invite => EditReply(interaction, "👀", `Click here to join the **[Spell Cast Together Activity](${invite.code})**!`))

            }
                break;
            case "10": {

                App.createTogetherCode(VC.id, "awkword").then(invite => EditReply(interaction, "👀", `Click here to join the **[AwkWord Together Activity](${invite.code})**!`))

            }
                break;
            case "11": {

                App.createTogetherCode(VC.id, "puttparty").then(invite => EditReply(interaction, "👀", `Click here to join the **[Putt Party Together Activity](${invite.code})**!`))

            }
                break;
            case "12": {

                App.createTogetherCode(VC.id, "checkers").then(invite => EditReply(interaction, "👀", `Click here to join the **[Checkers in the Park Together Activity](${invite.code})**!`))

            }
                break;
            case "13": {

                App.createTogetherCode(VC.id, "ocho").then(invite => EditReply(interaction, "👀", `Click here to join the **[Ocho Together Activity](${invite.code})**!`))

            }
                break;

        }
    }
}
const { model, Schema } = require("mongoose")

module.exports = model("generallogs", new Schema({
    Guild: String, 
    MemberRole: Boolean,
    MemberNick: Boolean,
    ChannelTopic: Boolean,
    MemberBoost: Boolean,
    MemberLeave: Boolean,
    MemberJoin: Boolean,
    RoleStatus: Boolean,
    ChannelStatus: Boolean,
    EmojiStatus: Boolean,
    Invite: Boolean,
}))
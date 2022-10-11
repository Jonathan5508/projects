const { model, Schema } = require("mongoose")

module.exports = new model("verification", new Schema({

    Guild: String, 
    Role: String
}))
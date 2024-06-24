const mongoose = require('mongoose')

const Team = mongoose.model("Team",
    new mongoose.Schema({
        name: String,
        tag: String,
        level: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        ownerAvatar: String,
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        pendingPlayers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    })
)

module.exports = Team
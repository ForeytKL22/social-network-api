const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: 'Please enter some text',
        minLength: 1,
        maxLength: 280
    },
    username: {
        type: String,
        required: 'Please enter your username'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAt => dateFormat(createdAt)
    }
},
{
    toJSON: {
        getters: true
    }
});


const ThoughtSchema = new Schema({
    username: {
        type: String,
        required: 'Please enter your username',
        trim: true
    },
    thoughtText: {
        type: String,
        required: 'Please enter some text',
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAt => dateFormat(createdAt)
    },
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
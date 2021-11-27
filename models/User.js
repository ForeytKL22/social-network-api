const { Schema, model } = requir('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'This is not a valid username',
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: 'This is not a valid email address',
        match: [/.+\@.+\..+/]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);


// not sure about this?
UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce((total, friend) => total + friend.length + 1, 0);
});


const User = model('User', UserSchema);

module.exports = User;
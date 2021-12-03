const { Thoughts, User } = require('../models');

const thoughtController = {

// GET all thoughts
    getAllThoughts(req, res) {
        Thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

// GET a single thought by its _id
    getThoughtById({ params }, res) {
        Thoughts.findOne({ _id: params.thoughtId })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(400).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch (err => {
                console.log(err);
                res.status(400).json(err);
            });
    },


// POST to create a new thought (push the created thought's _id to the associated user's thoughts array field)
// example data
// {
//     "thoughtText": "Here's a cool thought...",
//     "username": "lernantino",
//     "userId": "5edff358a0fcb779aa7b118b"
// }
    addThought({ body }, res) {
        Thoughts.create(body)
            .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },


// PUT to update a thought by its _id
    updateThought({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },


// DELETE to remove a thought by its _id
    removeThought({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought found with this id' });
                }
                return User.findOneAndUpdate(
                    { _id: params.id },
                    { $pull: { thoughts: { thoughtId: params.thoughtId } } },
                    { new: true },
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },


// /api/thoughts/:thoughtId/reactions
// POST to create a reaction stored in a single thought's reactions array field

    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId},
            { $addToSet: { reactions: body } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },



// DELETE to pull and remove a reaction by the reaction's reactionId value
    removeReaction({ params }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(deletedReaction => {
            if (!deletedReaction) {
                return res.status(404).json({ message: 'No reaction found with this id' });
            }
            res.json(deletedReaction);
        })
        .catch(err => res.status(500).json(err));
    }
};


module.exports = thoughtController;


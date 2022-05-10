const { Thought, User } = require("../models");


const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        res.status(400).json(err);
      });
  },


  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "THOUGHT ID NOT FOUND!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },


  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        console.log(_id);
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "USER ID NOT FOUND!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },


  updateThought({ params, body }, res) {
    console.log(params.thoughtId);
    console.log(body);
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "THOUGHT ID NOT FOUND!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },


  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
           res.status(404).json({ message: "THOUGHT ID NOT FOUND!" });
           return;
        }
        console.log(deletedThought);
        User.findOneAndUpdate(
          { username: deletedThought.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        ).then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "USER ID NOT FOUND!" });
            return;
          }
          res.json(dbUserData);
        });
      })
      .catch((err) => res.json(err));
  },


  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "USER ID NOT FOUND!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },


  removeReaction({params}, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'THOUGHT ID NOT FOUND!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};



module.exports = thoughtController;

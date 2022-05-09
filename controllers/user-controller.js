const { User } = require("../models");

const userController = {
  
  getAllUsers(req, res) {
    User.find({})
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .select("-__v")
      .populate({
        path: "friends",
      })
      .populate({
        path: "thoughts",
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "USER ID NOT FOUND!!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
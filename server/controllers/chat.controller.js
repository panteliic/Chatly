const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const asyncHandler = require("express-async-handler");

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserID param not send with request ");
    return res.status(400);
  }
  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.user",
    select: "username email image",
  });
  if (isChat != 0) {
    return res.send(isChat[0]);
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: "user",
        isGroup: false,
        users: [req.user._id, userId],
      });

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).json(fullChat);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
});
const getChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name image email",
    });

    let authUser = await User.findOne({ _id: req.user._id }).select(
      "username email image _id"
    );
    res.status(200).json({ chats, authUser });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = { createChat, getChats };
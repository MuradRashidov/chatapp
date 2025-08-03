import cloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.log(`Error in getUsers controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userWithChatId = req.params.id;
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userWithChatId },
        { senderId: userWithChatId, receiverId: loggedInUserId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in getMessages controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    console.log(senderId);
    console.log(receiverId);

    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const upladResponse = await cloudinary.uploader.upload(image);
      imageUrl = upladResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      image: imageUrl,
      text,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`Error in sendMessage controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

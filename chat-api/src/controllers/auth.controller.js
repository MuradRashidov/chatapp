import cloudinary from "../libs/cloudinary.js";
import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (password.length < 6)
      return new Error("Minlength of password must be at least 6 char");
    const user = await User.findOne({ email });
    if (user) throw new Error("User allready exist");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });
    if (newUser) {
      await generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullName,
        password: newUser.password,
        profileImage: newUser.profileImage,
      });
    } else {
      res.status(400).send({ message: "Invalid credential" });
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "Invalid credentials" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).send({ message: "Invalid credentials" });
    await generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullname: user.fullName,
      password: user.password,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({ message: "Logaut is successfully" });
  } catch (error) {
    console.log(`Error in logaut controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log(111);
    
    const { profileImage } = req.body;
    if (!profileImage)
      return res.status(401).send({ message: "Profile image is required" });
    const {
      user,
    } = req;
    console.log(user);
    
    const upladResponse = await cloudinary.uploader.upload(profileImage);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        profileImage: upladResponse.secure_url,
      },
      { new: true }
    );
     res.status(200).json(updatedUser);
  } catch (error) {}
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(`Error in Check Auth controller: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};

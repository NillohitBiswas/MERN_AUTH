import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import {errorHandler} from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
     const { username, email, password } =req.body;
     const hashedPassword = bcryptjs.hashSync(password,10);
     const newUser = new User({
         username,
         email,
         password: hashedPassword
     });
     try {
        await newUser.save();
        res.status(201).json({ message: 'Success'});
     } catch (error) {
        next(error);
     }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const validuser = await User.findOne({ email });
      if (!validuser) {
        return next(errorHandler(404, "Invalid Credentials" ));
      }
      const validpasword = bcryptjs.compareSync(password, validuser.password);
      if (!validpasword) {
        return next(errorHandler(401, "Invalid User" ));
      }
      const token = jwt.sign({id: validuser._id},process.env.JWT_SECRET_KEY);
      const { password: hashedPassword, ...rest} = validuser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
      .cookie('access_token', token,{ httpOnly: true, expires: expiryDate})
      .status(200)
      .json( rest )
    } catch (error) {
      next(error);
    }
}
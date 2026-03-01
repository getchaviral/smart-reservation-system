import express from "express";
import User from "../Modals/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const accessKey = process.env.ACCESS;
const refreshKey = process.env.REFRESH;


//Created Routes

const LoginHandler = express();

const authenticateToken = (req, res, next) => {
  const  authHeader= req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, accessKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};
 
LoginHandler.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const safeEmail = email?.trim().toLowerCase();

  if (!safeEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const Userdata = await User.findOne({ email: safeEmail });

    if (Userdata) {
      let isValid = false;

      // Prefer bcrypt. Fallback supports older plaintext users and migrates them.
      if (Userdata.password?.startsWith("$2")) {
        isValid = await bcrypt.compare(password, Userdata.password);
      } else {
        isValid = Userdata.password === password;
        if (isValid) {
          Userdata.password = await bcrypt.hash(password, 10);
          await Userdata.save();
        }
      }

      if (!isValid) {
        return res.status(200).json("not valid");
      }

      const accessToken = jwt.sign({Userdata}, accessKey, { expiresIn: "15m" });
      const refreshToken = jwt.sign({Userdata}, refreshKey);

      res.json({ access: accessToken, refresh: refreshToken  , UserInfo:Userdata , valid:"success"});

    } else {
      console.log("password not valid");
      res.status(200).json("not valid");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login failed" });
  }
});

LoginHandler.get("/Token",authenticateToken ,(req, res) => {
   const TokenData = req.user;
  res.status(200).json(TokenData);
});

LoginHandler.post("/logout", (req, res) => {
  res.status(200).cookie("Jwttoken", "").json("Sign Out");
});

export default LoginHandler;

import jwt from "jsonwebtoken"

// This is a middleware which we have built to get the loggedin user id so that we can get all the information through that id.

const isAuth = async (req, res, next) => {
  let {token} = req.cookies;
  if (!token) {
    return res.status(400).json({ message: "User doesn't have  token" });
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);  // ye verify() method hume ek object return karega or usi object k andar humari id bhi hai
   if(!decoded){
    return res.status(400).json({ message: "User doesn't have valid token" });
   }

    req.userId = decoded.userId;  // request k andar bohot sari chije hoti hai to humne apne ap se ek variable banaya userId nam se or usme us logged in user ki id store kara li
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Invalid token" });
  }
};

export default isAuth;

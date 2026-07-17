import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req,res)=>{
try {
    let {firstName,lastName,userName,email,password} = req.body
    let existEmail = await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"Email already exist!"})
    }
    let existUsername = await User.findOne({userName})
    if(existUsername){
        return res.status(400).json({message:"UserName already exist!"})
    }
    if(password.length<8){
        return res.status(400).json({message:"Password must be atleast 8 characters"})
        
    }
    let hassedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        firstName:firstName,
        lastName:lastName,
        userName:userName,
        email:email,
        password:hassedPassword
    })

    let token = await genToken(user._id) // mongodb by default generates an id fo each user which is written as _id
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"None",
      secure:process.env.NODE_ENVIRONMENT==="production"
    })
   return res.status(201).json({user})

} catch (error) {
    console.log(error)
    return res.status(500).json({message:"Signup error"})
}
}

export const logIn = async (req,res)=>{
    try {
        let {email,password} = req.body
    let user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"User does not exist!"})
    }
   
const isMatch =await bcrypt.compare(password,user.password)   

   if(!isMatch){
    return res.status(400).json({message:"Incorrect Password"})
   }

    let token = await genToken(user._id) // mongodb by default generates an id fo each user which is written as _id
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"None",
      secure:process.env.NODE_ENVIRONMENT==="production"
    })
    return res.status(200).json({user})

    } catch (error) {
      console.log(error)
    return res.status(500).json({message:"login error"})   
    }
}

export const logOut = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"LogOut successfull"})
    } catch (error) {
         console.log(error)
    return res.status(500).json({message:"logOut error"})   
    }
}
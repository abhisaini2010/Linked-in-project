import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Db connected")
    } catch (error) {
        console.log("Db error")
    }
}
export default connectDB
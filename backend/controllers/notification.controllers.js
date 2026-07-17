import Notification from "../models/notification.js"

export const getNotification = async (req,res)=>{
    try {
        let notification = await Notification.find({receiver:req.userId}).populate("relatedUser","firstName lastName profileImage").populate("relatedPost","images description")  // yaha par receiver hum khud hai yani ki jo jo logged in hai 
    return res.status(200).json(notification)
    } catch (error) {
        return res.status(500).json({message:`get notification error ${error}`})
    }
}
export const deleteNotification = async (req,res)=>{
    try {
        let{id} = req.params
        let notification = await Notification.findOneAndDelete({
            _id : id,
            receiver: req.userId
        })
          if (!notification) {
            return res.status(404).json({
                message: "Notification not found."
            });
        }
    return res.status(200).json({message:"Notification deleted succesfully"})
    } catch (error) {
        return res.status(500).json({message:`delete notification error ${error}`})
    }
}

export const clearAllNotification = async (req,res)=>{
    try {
         await Notification.deleteMany({
            receiver: req.userId
        })
    return res.status(200).json({message:"Notification deleted succesfully"})
    } catch (error) {
        return res.status(500).json({message:`delete all notification error ${error}`})
    }
}
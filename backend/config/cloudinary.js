import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filepath) => {

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

  try {
    if (!filepath) {
        return null;
    }
    console.log("Uploading file:", filepath);
    const uploadResult = await cloudinary.uploader.upload(filepath)
    console.log(uploadResult);
    fs.unlinkSync(filepath)
    return uploadResult.secure_url
}
catch(error){
    fs.unlinkSync(filepath)
    console.error("Error uploading to Cloudinary:", error);
}
}

export default uploadOnCloudinary;
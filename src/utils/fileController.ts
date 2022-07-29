import fs from 'fs';
import { v4 as uuidv4 } from "uuid"

export const uploadFile = (image: any) => {
    var base64Data = image.thumbUrl.replace(/^data:image\/[a-z]+;base64,/, "");
    const location = "images/" + uuidv4();
    
    try {
        fs.writeFileSync("public/" + location, base64Data, 'base64');
        return location
    } catch (error) {
        return false
    }
    
}
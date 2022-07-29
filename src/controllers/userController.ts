import { Request, Response } from "express";
import db from "../models"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieOptions from "../utils/cookies";
import domain from "../utils/domainVerify"

export const updateProfile = async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const value = req.body;
    
    const userUpdated = await db.user.update(value,{
        where: {
            id: userId
        }
    })
    

    if(!userUpdated) {
        return res.status(400).json({
            success: false,
            message: "Failed to update the user profile, please try again"
        })
    }

    res.status(200).json({
        success: true,
        message: "User profile updated successfully"
    })
}

export const updatePassword = async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const { currentPassword, password } = req.body;

    const user = await db.user.findOne({
        where: {
            id: userId
        }
    })

    if(!user) {
        return res.status(400).json({
            success: false,
            message: "Failed to update the user password, please try again"
        })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if(!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Failed to update the user password, please try again"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const userUpdated = await db.user.update({
        password: hashedPassword
    },{
        where: {
            id: userId
        }
    })

    if(!userUpdated) {
        return res.status(400).json({
            success: false,
            message: "Failed to update the user password, please try again"
        })
    }

    res.status(200).json({
        success: true,
        message: "User password updated successfully"
    })
}


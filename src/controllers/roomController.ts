import { Request, Response } from "express";
import db from "../models"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieOptions from "../utils/cookies";
import domain from "../utils/domainVerify"

export const createRoom = async (req: Request, res: Response) => {
    const { userId } = res.locals;

    const room = await db.room.create({
        ...req.body,
        owner: userId
    })

    if(!room) {
        return res.status(400).json({
            success: false,
            message: "Failed to create the room, please try again"
        })
    }

    res.status(200).json({
        success: true,
        message: "Room created successfully"
    })
}

export const fetchRoomList = async (req: Request, res: Response) => {
    const { location } = req.query;
    
    const rooms = await db.room.findAll({
        include: [{
            model: db.user,
            attributes: ['username', "phoneNumber"]
        }],
        where: {
            location: {
                [db.Sequelize.Op.like]: `%${location}%`
            }
        }
    })

    if(!rooms) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch the room list, please try again"
        })
    }

    res.status(200).json({
        success: true,
        message: "Room list fetched successfully",
        data: rooms
    })
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../models"
import "dotenv/config"
import domain from "./domainVerify"
import cookieOptions from "./cookies";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[process.env.AUTHTOKEN as string];
    
    if(token === null || token === undefined){
        return res.status(401).json({
            ok: false,
            message: 'You are not authorized to access following resource or perform following action.',
        });
    }
    let decryptedUser
    try {
        decryptedUser = jwt.verify(token, process.env.TOKEN_SECRET as string) as any
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Invalid Token, please clear the cookies and login again."
        })
    }
        
    const user = await db.user.findOne({
        raw: true,
        where: {
            id: decryptedUser.id 
        }
    })
    if(!user){
        return res.status(401).json({
            ok: false,
            message: 'You are not authorized to access following resource or perform following action.',
        });
    }

    if(!user.active) {
        return res.clearCookie(process.env.AUTH_TOKEN as string, {domain}).status(401).json({
            ok: false,
            message: 'Seems like your account was being deactivated.',
        });
    }

    res.locals.branchId = user.branchId;
    res.locals.roleId = user.roleId;
    res.locals.userId = user.id;
    res.cookie(process.env.AUTHTOKEN as string, token, cookieOptions);
    next();
}


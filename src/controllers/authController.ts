import { Request, Response } from "express";
import db from "../models"
import { uploadFile } from "../utils/fileController"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieOptions from "../utils/cookies";
import domain from "../utils/domainVerify"

export const verifyUser = async (req: Request, res: Response) => {
    try {
        let { token } = req.body
        
        // If token is unknown
        if (token === undefined || token === null || token === "") {
            return res.status(401).json({
                success: false,
                message: 'Please login first before you can access this page or this action.',
            });
        }

        var decoded
        // If the token cannot be verify
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as any
            
        } catch (error) {
            return res.clearCookie(process.env.AUTH_TOKEN as string, {domain}).status(400).json({
                success: false,
                message: "Invalid Token, you are logged out."
            })
        }

        // Get the user details
        var response = await db.user.findOne({
            where: {
                id: decoded.id
            },
            attributes: {exclude: ["password", "token", "tokenExpiredAt"]}
        })
        
        // If user is not exist or the user is deleted
        if (!response) {
            return res.clearCookie(process.env.AUTH_TOKEN as string, {domain}).status(401).json({
                success: false,
                message: 'No user found',
            });
        }

        // If the user is not verify
        if (!response.dataValues.isVerified) {
            return res.clearCookie(process.env.AUTH_TOKEN as string, {domain}).status(401).json({
                success: false,
                message: 'Your account has not activated yet, please check your email.',
            });
        }

        // If the user is not active
        if (!response.dataValues.active) {
            return res.clearCookie(process.env.AUTH_TOKEN as string, {domain}).status(401).json({
                success: false,
                message: 'Seems like your account was being deactivated.',
            });
        }

        res.status(200).json({
            success: true,
            message: "Token is valid",
            user: response.dataValues
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error
        })
    }
}

export const userRegister = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const [user, created] = await db.user.findOrCreate({
        where: {
            email
        },
        defaults: {
            username,
            email,
            password: hashedPassword
        }
    })

    if(!created) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    res.status(200).json({
        success: true,
        message: "User registered successfully"
    })
}

export const userLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
    
        const user = await db.user.findOne({
            raw: true,
            where: {
                email
            }
        })
    
        if(!user) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        if(!user.isVerified) {
            return res.status(400).json({
                message: "Your account has not activated yet, please check your email."
            })
        }

        if(!user.active) {
            return res.status(400).json({
                message: "Seems like your account was being deactivated."
            })
        }
    
        const isMatch = bcrypt.compareSync(password, user.password);
    
        if(!isMatch) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            process.env.TOKEN_SECRET as string
        );
            
        res.cookie(process.env.AUTHTOKEN as string, token, cookieOptions).status(200).json({
            success: true,
            message: 'User logged in successfully',
        });
}

export const userLogout = async (req: Request, res: Response) => {
    res.clearCookie(process.env.AUTHTOKEN as string, {domain}).status(200).json({
        success: true,
        message: 'Logout successful.'
    })
}
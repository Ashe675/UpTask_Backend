import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // verifying that the user does not exist
            const userExists = await User.findOne({ email })

            if (userExists) {
                const error = new Error('The user is already registered')
                return res.status(409).json({ error: error.message })
            }

            // 
            const user = new User(req.body)

            // Hash Password
            user.password = await hashPassword(password)

            // generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //* sending email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Account created, check your email to confirm your account')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Account confirmed successfully')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }

    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User not found')
                return res.status(404).json({ error: error.message })
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                //* sending email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('The account has not been confirmed, we have sent a confirmation email')
                return res.status(401).json({ error: error.message })
            }

            //* Verify Password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Incorrect Password')
                return res.status(401).json({ error: error.message })
            }

            const jwtoken = generateJWT({id : user.id})

            res.send(jwtoken)
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static requestComfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // verifying that the user exist
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('The user is not registered')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('The user is already confirmed')
                return res.status(403).json({ error: error.message })
            }

            // if a token exists, remove it
            const tokenExists = Token.find({ user: user.id })
            if (tokenExists) {
                await tokenExists.deleteOne()
            }

            // generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //* sending email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save()

            res.send('A new token was sent to your email')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // verifying that the user exist
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('The user is not registered')
                return res.status(404).json({ error: error.message })
            }


            // if a token exists, remove it
            const tokenExists = Token.find({ user: user.id })
            if (tokenExists) {
                await tokenExists.deleteOne()
            }

            // generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //* sending email
            AuthEmail.sendPasswordResendToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save()

            res.send('Check your email for instructions')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(404).json({ error: error.message })
            }

            res.send('Valid token, define your new password')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }

    }


    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)

            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('The password was changed correctly')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }

    }

    static user = async (req: Request, res: Response) => {
       return res.json(req.user)
    }

    //** Profile */
    static updateProfile = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body
            const userExists = await User.findOne({email})
            if(userExists && userExists.id.toString() !== req.user.id.toString()){
                const error = new Error('The email is already registered')
                return res.status(409).json({ error: error.message })
            }

            req.user.name = name
            req.user.email = email
            await req.user.save()
            res.send('Profile updated correctly')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        try {
            const { current_password, password } = req.body
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(current_password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('The current password is incorrect')
                return res.status(401).json({ error: error.message })
            }

            user.password = await hashPassword(password)
            await user.save()

            res.send('Password changed correctly')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        try {
            const { password } = req.body
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('The password is incorrect')
                return res.status(401).json({ error: error.message })
            }

            res.send('Correct Password')
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }
}
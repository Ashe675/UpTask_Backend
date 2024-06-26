import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirm your account',
            text: 'UpTask - Confirm your account',
            html: `<p>Hi: ${user.name}, you have created your account in UpTask, everything is almost ready, you just need to confirm your account</p>
            
            <p>Visit the following link:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm Account</a>
            <p>And enter the code: <b>${user.token}</b></p>
            <p>This token expires in 10 minutes</p>
            `
        })
 
        console.log('Message send', info.messageId)
    }

    static sendPasswordResendToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reset your password',
            text: 'UpTask - Reset your password',
            html: `<p>Hi: ${user.name}, you have requested to reset your password</p>
            
            <p>Visit the following link:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>
            <p>And enter the code: <b>${user.token}</b></p>
            <p>This token expires in 10 minutes</p>
            `
        })
 
        console.log('Message send', info.messageId)
    }
}
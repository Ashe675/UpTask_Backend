import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { Request, Response, NextFunction } from 'express'

export const validatorCreateAccount = [
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('The password is short, minimum 8 characters.'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same ')
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('Invalid Email'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorConfirmAccount = [
    body('token')
        .notEmpty().withMessage('Token is required')
        .isLength({ min: 6 }).withMessage('Invalid Length Token'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorLogin = [
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorRequestCode = [
    body('email')
        .notEmpty().withMessage('Email is required'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorValidateToken = [
    body('token')
        .notEmpty().withMessage('Token is required')
        .isLength({ min: 6 }).withMessage('Invalid Length Token'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorUptdatePassword = [
    body('password')
        .isLength({ min: 8 }).withMessage('The password is short, minimum 8 characters.'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same ')
            }
            return true
        }),
    param('token')
        .notEmpty().withMessage('Token is required')
        .isNumeric().withMessage('Invalid Token')
        .isLength({ min: 6 }).withMessage('Invalid Length Token'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorUpdateProfile = [
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    handleInputErrors
]

export const validatorUpdateCurrentPassword = [
    body('current_password')
        .notEmpty().withMessage('Current password is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('The password is short, minimum 8 characters.'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same ')
            }
            return true
        }),
    handleInputErrors
]

export const validatorCheckPassword = [
    body('password')
        .notEmpty().withMessage('Password is required'), handleInputErrors
]

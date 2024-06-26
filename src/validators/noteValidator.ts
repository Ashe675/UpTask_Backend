import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

export const validatorCreateNote = [
    body('content')
    .notEmpty().withMessage('Content is required'),handleInputErrors
]

export const validatorGetNote = [
    param('noteId')
    .isMongoId().withMessage('Invalid Id'),handleInputErrors
]
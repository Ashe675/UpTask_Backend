import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { Request, Response, NextFunction} from 'express'

export const validatorCreateProject = [
    body('projectName')
        .notEmpty().withMessage('Project Name is required'),
    body('clientName')
        .notEmpty().withMessage('Client Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorGetProjectById = [
    param('id').isMongoId().withMessage('Invalid ID'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorUpdateProject = [
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('projectName')
        .notEmpty().withMessage('Project Name is required'),
    body('clientName')
        .notEmpty().withMessage('Client Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorDeleteProject = [
    param('projectId').isMongoId().withMessage('Invalid ID'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorFindMember = [
    body('email')
    .isEmail().withMessage('Invalid Email'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorAddTeam = [
    body('id')
    .isMongoId().withMessage('Invalid Id'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]

export const validatorRemoveFromTeam = [
    param('userId')
    .isMongoId().withMessage('Invalid Id'),
    (req : Request, res :Response, next :NextFunction) => handleInputErrors(req, res, next)
]
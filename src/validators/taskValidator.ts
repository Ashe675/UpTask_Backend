import { body, param } from "express-validator"
import { Request, Response, NextFunction } from "express"
import { handleInputErrors } from "../middleware/validation"

export const validatorCreateTask = [
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    body('name')
        .notEmpty().withMessage('Name task is required'),
    body('description')
        .notEmpty().withMessage('Description task is required'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorGetTasks = [
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorGetTaskById = [
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorUpdateTask = [
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    body('name')
        .notEmpty().withMessage('Name task is required'),
    body('description')
        .notEmpty().withMessage('Description task is required'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorDeleteTask = [
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]

export const validatorUpdateStatusTask =[
    param('projectId').isMongoId().withMessage('Invalid Project ID'),
    param('taskId').isMongoId().withMessage('Invalid Task ID'),
    body('status').notEmpty().withMessage('Status is required'),
    (req: Request, res: Response, next: NextFunction) => handleInputErrors(req, res, next)
]


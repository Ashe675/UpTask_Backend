import type {Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) =>{
        try {
            const project = new Project(req.body)

            // asignando un manager
            project.manager = req.user.id

            await project.save()
            res.status(201).send('Project Created Successfully')
        } catch (error) {
            res.status(500).json({error : 'An error occurred'})
        }
    }

    static getAllProjects = async (req: Request, res: Response) =>{
        try {
            const projects = await Project.find({
                $or : [
                    {manager : {$in : req.user.id}},
                    {team : {$in : req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            res.status(500).json({error : 'An error occurred'})
        }
    }

    static getProjectById = async (req: Request, res: Response) =>{
        try {
            const project = await Project.findById(req.params.id).populate('tasks')
            if(!project){
                const error = new Error('Project Not Found')
                return res.status(404).json({error : error.message})
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                const error = new Error('Invalid Action')
                return res.status(404).json({error : error.message})
            }

            return res.json(project)
        } catch (error) {
            res.status(500).json({error : 'An error occurred'})
        }
    }

    static updateProject = async (req: Request, res: Response) =>{
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.clientName

            await req.project.save()
            return res.send('Project Updated Successfully')
        } catch (error) {
            res.status(500).json({error : 'An error occurred'})
        }
    }

    static deleteProject = async (req: Request, res: Response) =>{
        try {
            await req.project.deleteOne()
            return res.send('Project Deleted Successfully')
        } catch (error) {
            res.status(500).json({error : 'An error occurred'})
        }
    }
}
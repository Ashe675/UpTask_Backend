import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // find User
            const user = await User.findOne({email}).select('id email name')
            if(!user){
                const error = new Error('User Not Found')
                return res.status(404).json({error : error.message})
            }

            res.json(user)
        
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = await (await Project.findById(req.project.id)).populate({
                path : 'team',
                select : 'id email name'
            })

            res.json(project.team)
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }


    static addMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.body

            // find User
            const user = await User.findById(id).select('id')
            if(!user){
                const error = new Error('User Not Found')
                return res.status(404).json({error : error.message})
            }

            if(req.project.team.some(member => member.toString() === user.id.toString())){
                const error = new Error('The user already exists in the project')
                return res.status(409).json({error : error.message})
            }

            if(req.project.manager.toString() === user.id.toString()){
                const error = new Error('The user is the project manager')
                return res.status(409).json({error : error.message})
            }

            req.project.team.push(user.id)
            await req.project.save()

            res.send('User added to team successfully')
        
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params

            if(!req.project.team.some(member => member.toString() === userId)){
                const error = new Error('The user does not exist in the project')
                return res.status(409).json({error : error.message})
            }

            req.project.team = req.project.team.filter(member => member.toString() !== userId)

            await req.project.save()

            res.send('User successfully removed from the team')
        
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' })
        }
    }
}
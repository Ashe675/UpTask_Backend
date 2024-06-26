import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { validatorAddTeam, validatorCreateProject, validatorDeleteProject, validatorFindMember, validatorGetProjectById, validatorRemoveFromTeam, validatorUpdateProject } from '../validators/projectValidator'
import { TaskController } from "../controllers/TaskController";
import { validatorCreateTask, validatorDeleteTask, validatorGetTaskById, validatorGetTasks, validatorUpdateStatusTask, validatorUpdateTask } from "../validators/taskValidator";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";
import { validatorCreateNote, validatorGetNote } from "../validators/noteValidator";

const router = Router()

router.use('/', authenticate)

router.post('/',validatorCreateProject, ProjectController.createProject)

router.get('/',ProjectController.getAllProjects)

router.get('/:id', validatorGetProjectById, ProjectController.getProjectById)

// verify project
router.param('projectId', projectExists)

router.put('/:projectId', 
    validatorUpdateProject,
    hasAuthorization, 
    ProjectController.updateProject)

router.delete('/:projectId', 
    validatorDeleteProject,
    hasAuthorization,  
    ProjectController.deleteProject)

//* Routes for Tasks:

router.post('/:projectId/tasks', 
    hasAuthorization,
    validatorCreateTask,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    validatorGetTasks,
    TaskController.getTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongProject)

router.get('/:projectId/tasks/:taskId', 
    validatorGetTaskById, 
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId', 
    hasAuthorization,
    validatorUpdateTask, 
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization, 
    validatorDeleteTask, 
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status', 
    validatorUpdateStatusTask, 
    TaskController.updateStatus
)

//** Routes for teams */
router.post('/:projectId/team/find',
    validatorFindMember,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team/',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    validatorAddTeam,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    validatorRemoveFromTeam,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    validatorCreateNote,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    validatorGetNote,
    NoteController.deleteNote
)

export default router
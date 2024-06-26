import { Router } from "express";
import { AuthController } from '../controllers/AuthController';
import { validatorCheckPassword, validatorConfirmAccount, validatorCreateAccount, validatorLogin, validatorRequestCode, validatorUpdateCurrentPassword, validatorUpdateProfile, validatorUptdatePassword, validatorValidateToken } from "../validators/authValidators";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account', validatorCreateAccount, AuthController.createAccount)

router.post('/confirm-account', validatorConfirmAccount, AuthController.confirmAccount)

router.post('/login', validatorLogin, AuthController.login)

router.post('/request-code', validatorRequestCode, AuthController.requestComfirmationCode)

router.post('/forgot-password', validatorRequestCode, AuthController.forgotPassword)

router.post('/validate-token', validatorValidateToken, AuthController.validateToken)

router.post('/update-password/:token', validatorUptdatePassword, AuthController.updatePasswordWithToken)

router.get('/user',
    authenticate,
    AuthController.user
)

//** Profile */
router.put('/profile', 
    authenticate, 
    validatorUpdateProfile,
    AuthController.updateProfile)

router.post('/update-password',
    authenticate,
    validatorUpdateCurrentPassword,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    validatorCheckPassword,
    AuthController.checkPassword
)

export default router
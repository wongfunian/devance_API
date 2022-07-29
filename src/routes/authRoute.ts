import { Router } from "express"
const router = Router()

// Controllers
import { verifyUser, userRegister, userLogin, userLogout } from "../controllers/authController";

router.route('/verifyUser').post(verifyUser);
router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);

export default router;
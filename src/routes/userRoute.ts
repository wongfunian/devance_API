import { Router } from "express"
import { isAuthenticated } from "../utils/auth"
const router = Router()

// Controllers
import { updateProfile, updatePassword } from "../controllers/userController";

router.route('/user/profile').put(isAuthenticated, updateProfile);
router.route('/user/password').put(isAuthenticated, updatePassword);

export default router;
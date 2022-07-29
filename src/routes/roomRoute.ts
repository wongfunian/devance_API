import { Router } from "express"
const router = Router()
import { isAuthenticated } from "../utils/auth"

// Controllers
import { createRoom, fetchRoomList } from "../controllers/roomController";

router.route('/room').post(isAuthenticated, createRoom).get(isAuthenticated, fetchRoomList);

export default router;
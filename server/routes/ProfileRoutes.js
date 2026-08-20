import {Router} from "express";
import { protect } from "../middleware/Auth.js";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";

const profileRouter = Router();

profileRouter.get('/', protect, getProfile);
profileRouter.post('/', protect, updateProfile);

export default profileRouter;
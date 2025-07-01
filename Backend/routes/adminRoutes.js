import express from "express";
import { protect } from "../middleware/auth.js";
import { addBike, changeRoleToAdmin, deleteBike, getDashboardData, getAdminBikes, toggleBikeAvailability, updateUserImage } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

adminRouter.post("/change-role", protect, changeRoleToAdmin)
adminRouter.post("/add-bike", upload.single("image"), protect, addBike)
adminRouter.get("/bikes", protect, getAdminBikes)
adminRouter.post("/toggle-bike", protect, toggleBikeAvailability)
adminRouter.post("/delete-bike", protect, deleteBike)

adminRouter.get('/dashboard', protect, getDashboardData)
adminRouter.post('/update-image', upload.single("image"), protect, updateUserImage)

export default adminRouter;

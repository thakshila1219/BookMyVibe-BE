import {Router} from "express";
import {deleteEvent, getAllEvents, getEvent, saveEvent, updateEvent} from "../controllers/event.controller";
import {authorizeRoles} from "../middleware/auth.middleware";

const eventRouter: Router = Router()

eventRouter.get("/all", getAllEvents)
eventRouter.get("/:id", getEvent)
eventRouter.post("/save", authorizeRoles('admin'), saveEvent)
eventRouter.put("/update/:id", authorizeRoles('admin'), updateEvent)
eventRouter.delete("/delete/:id", authorizeRoles('admin'), deleteEvent)


export default eventRouter
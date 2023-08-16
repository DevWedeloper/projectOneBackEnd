import { Router } from "express";
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacterNameById,
  updateCharacterTypeById,
  updateCharacterHealthById,
  updateCharacterStrengthById,
  updateCharacterAgilityById,
  updateCharacterIntelligenceById,
  updateCharacterArmorById,
  updateCharacterCritChanceById,
  joinGuildById,
  leaveGuildById,
  deleteCharacterById,
  deleteAllCharacters,
} from "../controllers/characterController";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";
import { checkCharacterExistence } from "../middlewares/checkCharacterExistence";
import { isValidCharacterType } from "../middlewares/isValidCharacterTypeMiddleware";
import { isValidGuild } from "../middlewares/isValidGuildMiddleware";

const router: Router = Router();

router.post(
  "/",
  isAdminMiddleware,
  isValidCharacterType,
  createCharacter
);
router.get("/", getAllCharacters);
router.get("/:id", getCharacterById);
router.put(
  "/name/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterNameById
);
router.put(
  "/characterType/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  isValidCharacterType,
  updateCharacterTypeById
);
router.put(
  "/health/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterHealthById
);
router.put(
  "/strength/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterStrengthById
);
router.put(
  "/agility/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterAgilityById
);
router.put(
  "/intelligence/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterIntelligenceById
);
router.put(
  "/armor/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterArmorById
);
router.put(
  "/critChance/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  updateCharacterCritChanceById
);
router.put(
  "/join/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  isValidGuild,
  joinGuildById
);
router.put(
  "/leave/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  leaveGuildById
);
router.delete(
  "/:id",
  isAdminMiddleware,
  checkCharacterExistence,
  deleteCharacterById
);
router.delete(
  "/",
  isAdminMiddleware,
  deleteAllCharacters
);

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const hasPermission_1 = require("../middleware/hasPermission");
const requireUser_1 = require("../middleware/requireUser");
const router = express_1.default.Router();
router.use(deserializeUser_1.deserializeUser, requireUser_1.requireUser);
// Get currently logged in user
router.get('/me', (0, hasPermission_1.hasPermission)('see-profile'), user_controller_1.getMeHandler);
exports.default = router;

import { removePermission } from './../controllers/role.controller';
import express from 'express';
import { addRole, getAllRoles, addPermission, deleteRole } from '../controllers/role.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { hasPermission } from '../middleware/hasPermission';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

router.post('/', hasPermission('role:add'), addRole);
router.get('/', hasPermission('role:read'), getAllRoles)
router.delete('/:id',hasPermission('role:delete'),  deleteRole)

// Add new Permission to role
router.patch('/permission/:id', hasPermission('permissions:add'), addPermission)

// Remove permission from role
router.delete('/permission/:id', hasPermission('permissions:remove'), removePermission)



export default router;

import { Router } from 'express';
import {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
    getPendingRequests,
    searchUsers,
    removeFriend
} from '../controllers/friend.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.post('/request', sendFriendRequest);
router.post('/respond', respondToFriendRequest);
router.get('/', getFriends);
router.get('/pending', getPendingRequests);
router.get('/search', searchUsers);
router.delete('/:friendId', removeFriend);

export default router;

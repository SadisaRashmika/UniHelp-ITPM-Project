const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const feedbackController = require('../controllers/feedbackController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ticketController = require('../controllers/ticketController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/tickets'; 
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `ticket-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });



router.get('/users', userController.getAllUsers);


router.put('/users/:id', userController.updateUser);



router.post('/feedback', feedbackController.submitFeedback);


router.get('/feedback', feedbackController.getAllFeedback);


router.get('/feedback/lecturer/:lecturer_id', feedbackController.getLecturerFeedback);


router.get('/feedback/student/:student_id', feedbackController.getStudentFeedback);


router.put('/feedback/:id', feedbackController.updateFeedback);


router.delete('/feedback/:id', feedbackController.deleteFeedback);
router.get('/modules/:lecturer_id', feedbackController.getLecturerModules);



router.post('/tickets', upload.single('screenshot'), ticketController.submitTicket);


router.get('/tickets/student/:student_id', ticketController.getStudentTickets);
router.get('/tickets/lecturer/:lecturer_id', ticketController.getLecturerTickets);


router.get('/tickets', ticketController.getAllTickets);


router.patch('/tickets/:id', ticketController.updateTicketStatus);

// --- CHAT ROUTES ---
router.get('/tickets/:id/chats', ticketController.getTicketChats);
router.post('/tickets/:id/chats', ticketController.addChatMessage);

module.exports = router;

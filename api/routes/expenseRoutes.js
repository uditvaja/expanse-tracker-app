const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense ,fetchExpense} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const { bulkUploadExpenses } = require('../controllers/expenseController');
const upload = multer({ storage: multer.memoryStorage() });
router.post('/bulk', protect, upload.single('file'), bulkUploadExpenses);
router.route('/')
  .post(protect, addExpense)
  .get(protect, getExpenses);

router.route('/:id').get(protect, fetchExpense)
  .patch(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;

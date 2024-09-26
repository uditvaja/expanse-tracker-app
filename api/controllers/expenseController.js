const Expense = require('../models/Expense');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.addExpense = async (req, res) => {
  const { amount, description, date, category, paymentMethod } = req.body;

  const expense = await Expense.create({
    amount,
    description,
    date,
    category,
    paymentMethod,
    user: req.user._id,
  });

  res.status(201).json(expense);
};
exports.bulkUploadExpenses = async (req, res) => {
    const expenses = [];
  
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    // Create a readable stream from the buffer
    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null); // Signal the end of the stream
  
    // Process CSV data
    readable
      .pipe(csv())
      .on('data', (row) => {
        // Validate and push each expense to the array
        const { amount, description, date, category, paymentMethod } = row;
  
        // Basic validation (you can expand this)
        if (!amount || isNaN(amount) || !description || !date || !category || !['cash', 'credit'].includes(paymentMethod)) {
          return res.status(400).json({ message: 'Invalid data in CSV' });
        }
  
        expenses.push({
          amount: Number(amount), // Ensure amount is a number
          description,
          date: new Date(date),
          category,
          paymentMethod,
          user: req.user._id,
        });
      })
      .on('end', async () => {
        try {
          // Save all expenses in bulk
          await Expense.insertMany(expenses);
          res.status(201).json({ message: 'Expenses added successfully', expenses });
        } catch (error) {
          res.status(500).json({ message: 'Error saving expenses', error });
        }
      })
      .on('error', (error) => {
        // Handle errors that occur during the CSV parsing
        res.status(500).json({ message: 'Error processing CSV', error });
      });
  };
exports.getExpenses = async (req, res) => {
  const { category, startDate, endDate, paymentMethod } = req.query;

  let query = { user: req.user._id };

  if (category) {
    query.category = category;
  }

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });

  res.json(expenses);
};

exports.updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  Object.assign(expense, req.body);
  await expense.save();

  res.json(expense);
};

 exports.fetchExpense = async (req,res) => {
    const expense = await Expense.findById(req.params.id);
  
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
  
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  
    res.json(expense);
  };
exports.deleteExpense = async (req, res) => {
    // Find and delete the expense in one step
    const expense = await Expense.findById(req.params.id);
  
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
  
    // Check if the logged-in user is authorized to delete the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  
    // Use findByIdAndDelete to remove the expense
    await Expense.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Expense removed' });
  };
  
  

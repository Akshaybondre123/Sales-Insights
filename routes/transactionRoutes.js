const express = require('express');
const { getTransactions, getStatistics, getBarChartData, getPieChartData } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction'); 
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    
    const validTransactions = transactions.filter(transaction => {
      return transaction.dateOfSale && !isNaN(new Date(transaction.dateOfSale).getTime());
    });

    res.status(200).json(validTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});


router.get('/statistics', getStatistics);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);

module.exports = router;

const Transaction = require('../models/Transaction');


exports.getTransactions = async (req, res) => {
  const { search, page = 1, perPage = 10, month } = req.query;
  const searchRegex = search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] } : {};
  
  const monthQuery = { dateOfSale: { $gte: new Date(2022, month - 1, 1), $lte: new Date(2022, month, 0) } };

  try {
    const transactions = await Transaction.find({ ...searchRegex, ...monthQuery })
      .skip((page - 1) * perPage)
      .limit(perPage);
    const total = await Transaction.countDocuments({ ...searchRegex, ...monthQuery });
    
    res.status(200).json({ transactions, total, page, perPage });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

// Get transaction statistics
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const monthQuery = { dateOfSale: { $gte: new Date(2022, month - 1, 1), $lte: new Date(2022, month, 0) } };

  try {
    const totalSale = await Transaction.aggregate([
      { $match: monthQuery },
      { $group: { _id: null, totalSale: { $sum: "$price" }, soldItems: { $sum: { $cond: ["$sold", 1, 0] } } } }
    ]);

    const notSoldItems = await Transaction.countDocuments({ ...monthQuery, sold: false });

    res.status(200).json({
      totalSale: totalSale[0].totalSale,
      soldItems: totalSale[0].soldItems,
      notSoldItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

// Get price range distribution for bar chart
exports.getBarChartData = async (req, res) => {
  const { month } = req.query;
  const monthQuery = { dateOfSale: { $gte: new Date(2022, month - 1, 1), $lte: new Date(2022, month, 0) } };

  try {
    const priceRanges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901-above", count: 0 }
    ];

    const transactions = await Transaction.find(monthQuery);

    transactions.forEach(transaction => {
      const price = transaction.price;
      if (price <= 100) priceRanges[0].count++;
      else if (price <= 200) priceRanges[1].count++;
      else if (price <= 300) priceRanges[2].count++;
      else if (price <= 400) priceRanges[3].count++;
      else if (price <= 500) priceRanges[4].count++;
      else if (price <= 600) priceRanges[5].count++;
      else if (price <= 700) priceRanges[6].count++;
      else if (price <= 800) priceRanges[7].count++;
      else if (price <= 900) priceRanges[8].count++;
      else priceRanges[9].count++;
    });

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bar chart data', error });
  }
};


exports.getPieChartData = async (req, res) => {
  const { month } = req.query;
  const monthQuery = { dateOfSale: { $gte: new Date(2022, month - 1, 1), $lte: new Date(2022, month, 0) } };

  try {
    const categories = await Transaction.aggregate([
      { $match: monthQuery },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pie chart data', error });
  }
};

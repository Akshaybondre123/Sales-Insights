const axios = require('axios');
const Transaction = require('../models/Transaction');

const seedData = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        
        await Transaction.deleteMany();  // Clear previous data
        await Transaction.insertMany(transactions);  // Insert new data
        console.log('Database seeded');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedData;

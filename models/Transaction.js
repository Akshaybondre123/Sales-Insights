const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: {
    type: Date,
    required: true, 
    validate: {
      validator: function(value) {
        return !isNaN(Date.parse(value)); 
      },
      message: props => `${props.value} is not a valid date!`
    }
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);

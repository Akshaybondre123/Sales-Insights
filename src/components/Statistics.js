
import React from 'react';

const Statistics = ({ month, data }) => {
   
    const totalTransactions = data.length;
    const totalSales = data.reduce((acc, transaction) => acc + transaction.price, 0);
    const averageSaleValue = totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : 0;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Statistics for {month}</h3>
            <p>Total Transactions: {totalTransactions}</p>
            <p>Total Sales: ${totalSales.toFixed(2)}</p>
            {totalTransactions > 0 && (
                <p>Average Sale Value: ${averageSaleValue}</p>
            )}
        </div>
    );
};

export default Statistics;

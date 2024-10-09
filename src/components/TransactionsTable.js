
import React, { useEffect, useState } from 'react';
import transactionService from '../services/transactionService';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const perPage = 10;

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
            setError(null); 
            try {
                const data = await transactionService.getTransactions(month, page, perPage, search);
                setTransactions(data.transactions || []); 
                setTotal(data.total || 0); 
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Failed to fetch transactions."); 
                setTransactions([]); 
                setTotal(0); 
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [month, page, search]);

    return (
        <div>
            <h2>Transactions for {month}</h2>
            <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); 
                }}
                aria-label="Search transactions" 
            />
            {loading && <p>Loading transactions...</p>} {}
            {error && <p style={{ color: 'red' }}>{error}</p>} {}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td> {}
                                <td>{transaction.category}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {Math.ceil(total / perPage)} </span>
                <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(total / perPage) || transactions.length === 0}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionsTable;

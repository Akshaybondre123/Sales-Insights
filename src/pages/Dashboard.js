
import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js'; 
import TransactionsTable from '../components/TransactionsTable';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import Statistics from '../components/Statistics';
import transactionService from '../services/transactionService';


Chart.register(...registerables);

const Dashboard = () => {
    const [month, setMonth] = useState('March');
    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchTransactionData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await transactionService.getTransactions(month); 
                console.log("Fetched Data:", data);
                setTransactionData(data.transactions || []); // Ensure it's an array
            } catch (error) {
                console.error("Error fetching transaction data:", error);
                setError(`Failed to fetch transaction data for ${month}. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionData();
    }, [month]);

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Transaction Dashboard</h2>
            <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                style={{ margin: '10px 0', padding: '8px', fontSize: '16px' }} 
            >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>

            {loading ? (
                <p>Loading transaction data...</p> 
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p> 
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TransactionsTable month={month} data={transactionData} />
                    <Statistics month={month} data={transactionData} />
                    <BarChart month={month} data={transactionData} />
                    <PieChart month={month} data={transactionData} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;

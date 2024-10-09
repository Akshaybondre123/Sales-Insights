import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL + '/api/transactions';

if (!API_URL) {
    console.error('REACT_APP_API_URL is not defined. Please check your .env file.');
}


const getTransactions = async (month, page = 1, perPage = 10, search = '') => {
    try {
       
        console.log('Fetching transactions with params:', { month, page, perPage, search });

        
        const response = await axios.get(API_URL, {
            params: { month, page, perPage, search }
        });

        console.log('API Response:', response.data); 

       
        if (!response.data || !response.data.transactions || response.data.transactions.length === 0) {
            console.warn('No transactions found for the given parameters.');
            return { transactions: [], total: 0 }; 
        }

        return response.data; 
    } catch (error) {
        
        console.error('Error fetching transactions:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        throw new Error('Failed to fetch transactions. Please try again later.');
    }
};


const getStatistics = async (month) => {
    try {
        const response = await axios.get(`${API_URL}/statistics`, {
            params: { month }
        });

        console.log('Statistics API Response:', response.data); 

        
        if (!response.data || response.data.totalTransactions === undefined || response.data.totalSales === undefined) {
            console.warn('No statistics data found for the given month.');
            return { totalTransactions: 0, totalSales: 0 };
        }

        return response.data; 
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Failed to fetch statistics. Please try again later.');
    }
};


const getBarChartData = async (month) => {
    try {
        const response = await axios.get(`${API_URL}/bar-chart`, {
            params: { month }
        });

        if (!response.data) {
            console.warn('No bar chart data found for the given month.');
            return []; 
        }

        return response.data; 
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        throw new Error('Failed to fetch bar chart data. Please try again later.');
    }
};


const getPieChartData = async (month) => {
    try {
        const response = await axios.get(`${API_URL}/pie-chart`, {
            params: { month }
        });

        if (!response.data) {
            console.warn('No pie chart data found for the given month.');
            return []; 
        }

        return response.data; 
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        throw new Error('Failed to fetch pie chart data. Please try again later.');
    }
};


export default {
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData
};

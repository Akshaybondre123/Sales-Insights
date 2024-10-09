
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ month, soldData }) => {
    
    const data = {
        labels: ['Sold', 'Unsold'],
        datasets: [
            {
                label: 'Transaction Distribution',
                data: soldData || [0, 0], 
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true, 
        plugins: {
            legend: {
                position: 'top', 
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Transaction Distribution for {month}</h2>
            <Pie data={data} options={options} aria-label={`Transaction distribution for ${month}`} role="img" />
        </div>
    );
};

export default PieChart;

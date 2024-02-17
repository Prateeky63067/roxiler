import React from 'react';
import {ResponsiveContainer,BarChart,Bar, XAxis, YAxis} from "recharts"

const TransactionsBarChart = ({ barChartData }) => {
    return (
        <div className="bar-chart-container">
        <h2 className="bar-chart-heading">Transactions Bar Chart</h2>
        <ResponsiveContainer width="100%" aspect={3}>
            <BarChart data={barChartData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Bar dataKey="numberofItem" fill='red' />
            </BarChart>
        </ResponsiveContainer>
    </div>
    );
};

export default TransactionsBarChart;

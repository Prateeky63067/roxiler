import React from 'react';

const TransactionsStatistics = ({ totalSale, totalSoldItems, totalNotSoldItems }) => {
    return (
        <div className="statistics-container">
            <h2 className="statistics-heading">Transactions Statistics</h2>
            <div className="statistics-info">
                <div className="statistics-item">
                    <span className="statistics-label">Total Sale:</span>
                    <span className="statistics-value">{totalSale}</span>
                </div>
                <div className="statistics-item">
                    <span className="statistics-label">Total Sold Items:</span>
                    <span className="statistics-value">{totalSoldItems}</span>
                </div>
                <div className="statistics-item">
                    <span className="statistics-label">Total Not Sold Items:</span>
                    <span className="statistics-value">{totalNotSoldItems}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionsStatistics;

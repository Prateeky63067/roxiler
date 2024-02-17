import React from 'react';

const TransactionsTable = ({ transactions }) => {
    return (
        <div className="transactions-table-container">
            <h2 className="table-heading">Transactions Table</h2>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.price}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td><img src={transaction.image} alt="Product" className="product-image" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;

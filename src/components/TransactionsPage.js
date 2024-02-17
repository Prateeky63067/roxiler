import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./TransactionsTable";
import TransactionsStatistics from "./TransactionsStatistics";
import TransactionsBarChart from "./TransactionsBarChart";

const TransactionsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("2022-03");
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);
  const [barChartData, setBarChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStatistics();
    fetchBarChartData();
  }, [selectedMonth, searchText, currentPage]); 

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products`, {
        params: {
          keyword: selectedMonth,
          search: searchText,
          page: currentPage, 
          limit: itemsPerPage, 
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchTransactionStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/salesMonth`, {
        params: {
          keyword: selectedMonth,
        },
      });
      setTotalSale(response.data.totalSale);
      setTotalSoldItems(response.data.totalSoldItems);
      setTotalNotSoldItems(response.data.totalNotSoldItems);
    } catch (error) {
      console.error("Error fetching transaction statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/barChart`, {
        params: {
          keyword: selectedMonth,
        },
      });
      setBarChartData(response.data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); 
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1); 
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="transactions-container">
      <div className="transactions-head">
        <h1 className="transactions-heading">Transactions Dashboard</h1>
      </div>
      <div className="filters-container">
        <div>
          <select
            className="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="2022-01">January</option>
            <option value="2022-02">February</option>
            <option value="2022-03">March</option>
            <option value="2021-04">April</option>
            <option value="2021-05">May</option>
            <option value="2022-06">June</option>
            <option value="2022-07">July</option>
            <option value="2021-08">August</option>
            <option value="2021-09">September</option>
            <option value="2021-10">October</option>
            <option value="2021-11">November</option>
            <option value="2021-12">December</option>
          </select>
        </div>
        <div>
          <input
            className="search-input"
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search Transactions"
          />
        </div>
      </div>

      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <TransactionsTable transactions={transactions} />
      <TransactionsStatistics
        totalSale={totalSale}
        totalSoldItems={totalSoldItems}
        totalNotSoldItems={totalNotSoldItems}
      />
      <TransactionsBarChart barChartData={barChartData} />
    </div>
  );
};

export default TransactionsPage;

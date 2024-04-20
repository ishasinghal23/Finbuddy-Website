import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './Dashboard.css'; // Import external CSS file

function Dashboard({ commonId }) {
  const [chartData, setChartData] = useState({});
  const [positiveTableData, setPositiveTableData] = useState([]);
  const [negativeTableData, setNegativeTableData] = useState([]);
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [savingsTransaction, setSavingsTransaction] = useState(null);


  useEffect(() => {
    if (commonId) {
      fetch(`http://localhost:5000/api/getform/${commonId}`)
        .then((response) => response.json())
        .then((data) => {
          let totalIncome = data.income;
          console.log('Fetched data:', data);
          // Check if the planning type is 'Family'
          if (data.planningType === 'Family' && data.familyMembers && data.familyMembers.length > 0) {
            totalIncome = data.familyMembers.reduce((total, member) => total + member.income, 0);
          }

          const totalExpense = calculateTotal(data.expenses, 'expenseAmount');
          const totalAssets = calculateTotal(data.assets, 'assetAmount');
          const totalDebt = calculateTotal(data.debts, 'debtAmount');
          const emergencyFund = data.emergencyFund;

          setChartData({
            labels: ['Total Income', 'Total Expense', 'Total Assets'],
            datasets: [
              {
                data: [totalIncome, totalExpense, totalAssets],
                backgroundColor: ['#662549', '#9B5D73', '#A78295', '#C38B8B', '#EF9595'],
                hoverBackgroundColor: ['#8d3a6f', '#c0829c', '#d3a3b7', '#e1b1ae', '#f2cdc9'],
              },
            ],
          });

          
          // Prepare data for positive and negative tables
          const positiveTable = [
            { heading: 'Income', details: formatIncomeDetails(data) },
            { heading: 'Assets', details: formatAssetDetails(data.assets) },
            { heading: 'Emergency Fund', value: emergencyFund },
          ];

          const negativeTable = [
            { heading: 'Expenses', details: formatExpenseDetails(data.expenses) },
            { heading: 'Debts', details: formatDebtDetails(data.debts) },
          ];

          setIncome(totalIncome);
          setPositiveTableData(positiveTable);
          setNegativeTableData(negativeTable);
          fetchTransactions();
        })
        .catch((error) => console.error('Error fetching data:', error));
        
    } else {
      console.error('commonId is undefined');
    }
  }, [commonId]);

 
  // Fetch transactions function
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getTransactions/${commonId}`);
      const transactionsFromServer = response.data.transactions; // Access transactions property
      setTransactions(transactionsFromServer);
      // Calculate savings transaction
      const totalTransactionAmount = transactionsFromServer.reduce((total, transaction) => total + transaction.amount, 0);
      const savingsAmount = income - totalTransactionAmount;
      setSavingsTransaction({ name: 'Savings', amount: savingsAmount });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateTotal = (array, field) => {
    if (Array.isArray(array) && array.length > 0) {
      return array.reduce((total, item) => total + (item[field] || 0), 0);
    }
    return 0;
  };

  const formatIncomeDetails = (data) => {
    if (data.planningType === 'Family' && data.familyMembers && data.familyMembers.length > 0) {
      return data.familyMembers.map((member, index) => ({
        name: `Member${index + 1}`,
        amount: member.income,
      }));
    } else {
      return [{ name: 'Individual', amount: data.income }];
    }
  };

  const formatAssetDetails = (assets) => {
    return assets.map((asset) => ({
      name: asset.assetType,
      amount: asset.assetAmount,
      interest: asset.assetInterest || 0,
    }));
  };

  const formatExpenseDetails = (expenses) => {
    return expenses.map((expense) => ({
      name: expense.expenseType,
      amount: expense.expenseAmount,
      type: expense.expenseType,
    }));
  };

  const formatDebtDetails = (debts) => {
    return debts.map((debt, index) => ({
      name: `Member${index + 1}`,
      amount: debt.debtAmount,
      interest: debt.debtInterest || 0,
      time: debt.debtTime || 0,
    }));
  };

  

  return (
    <div className="dashboard-container">
      <div className="space-above">
        <h2 className="dashboard-title">Dashboard</h2>
      </div>

      <div className="top-container">
      <div className="comparison-container"> {/* New container for the comparison table */}
      <h3>Budget</h3>
      <table className="comparison-table">
  <thead>
    <tr>
      <th>Expense Name</th>
      <th>Amount</th> {/* New column for displaying budget */}
    </tr>
  </thead>
  <tbody>
    {/* Iterate through transactions */}
    {transactions.map((transaction, index) => {
      // Find corresponding negative table item for the current transaction
      const correspondingExpense = negativeTableData[0]?.details.find(
        (expense) => expense.name === transaction.name
      );
      // Calculate budget based on the corresponding expense
      const budget = correspondingExpense
        ? (transaction.amount + correspondingExpense.amount) / 2
        : transaction.amount;

      return (
        <tr key={index}>
          <td>{transaction.name}</td>
          <td>₹{budget}</td>
        </tr>
      );
    })}

    {/* Display remaining negative table elements */}
    {negativeTableData[0]?.details.map((expense, index) => {
      // Check if the corresponding transaction exists
      const correspondingTransaction = transactions.find(
        (transaction) => transaction.name === expense.name
      );
      // If there is no corresponding transaction, display the negative table element with its amount
      if (!correspondingTransaction) {
        return (
          <tr key={`negative-${index}`}>
            <td>{expense.name}</td>
            <td>₹{expense.amount}</td> {/* Use the amount from the negative table */}
          </tr>
        );
      }
      return null; // Otherwise, skip this negative table element
    })}
  </tbody>
</table>

</div>
      <div className="chart-container">
        <Doughnut key={Math.random()} data={chartData} />
      </div>
      </div>
      <div className="tables-container">
        <table className="positive-table">
          <thead>
            <tr>
              <th colSpan="2">Positive</th>
            </tr>
          </thead>
          <tbody>
            {positiveTableData.map((item, index) => (
              <tr key={index}>
                <td>{item.heading}</td>
                <td>
                  {Array.isArray(item.details) ? (
                    <table>
                      <thead>
                        <tr>
                          {item.heading === 'Income' ? (
                            <>
                              <th>Member</th>
                              <th>Amount</th>
                            </>
                          ) : (
                            <>
                              <th>Type</th>
                              <th>Amount</th>
                            </>
                          )}
                          {item.heading === 'Assets' && <th>Interest</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {item.details.map((detail, detailIndex) => (
                          <tr key={detailIndex}>
                            <td>{detail.name}</td>
                            <td>{detail.amount}</td>
                            {item.heading === 'Assets' && <td>{detail.interest}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    item.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="negative-table">
          <thead>
            <tr>
              <th colSpan="2">Negative</th>
            </tr>
          </thead>
          <tbody>
            {negativeTableData.map((item, index) => (
              <tr key={index}>
                <td>{item.heading}</td>
                <td>
                  {Array.isArray(item.details) ? (
                    <table>
                      <thead>
                        <tr>
                          {item.heading === 'Debts' ? (
                            <>
                              <th>Amount</th>
                              <th>Interest</th>
                              <th>Time</th>
                            </>
                          ) : (
                            <>
                              <th>Name</th>
                              <th>Amount</th>
                              {item.heading === 'Assets' && <th>Type</th>}
                              {item.heading === 'Assets' && <th>Interest</th>}
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {item.details.map((detail, detailIndex) => (
                          <tr key={detailIndex}>
                            {item.heading === 'Debts' ? (
                              <>
                                <td>{detail.amount}</td>
                                <td>{detail.interest}</td>
                                <td>{detail.time}</td>
                              </>
                            ) : (
                              <>
                                <td>{detail.name}</td>
                                <td>{detail.amount}</td>
                                {item.heading === 'Assets' && <td>{detail.type}</td>}
                                {item.heading === 'Assets' && <td>{detail.interest}</td>}
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    item.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     
      </div>
  

    </div>
  );
}

export default Dashboard;

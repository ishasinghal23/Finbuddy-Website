import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './Budgeting.css';

function Budgeting({ commonId }) {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0); // Initialize income with a default value
  const [transactionName, setTransactionName] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [formData, setFormData] = useState({});
  useEffect(() => {
    // Fetch income and transactions when the component mounts or when commonId changes
    fetchIncome();
    fetchTransactions();
  }, [commonId]);

  const componentStyle = {
    paddingTop: '140px',
    backgroundColor: '#F5EBEB',
  };

  const fetchIncome = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getform/${commonId}`);
      const data = response.data;
  
      // Initialize totalIncome with the income from data
      let totalIncome = data.income;
      
      console.log('Fetched data:', data);
  
      // Check if the planning type is 'Family'
      if (data.planningType === 'Family' && data.familyMembers && data.familyMembers.length > 0) {
        totalIncome = data.familyMembers.reduce((total, member) => total + member.income, 0);
      }
  
      // Set the total income directly (if needed)
      setIncome(totalIncome);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };
  
  
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getTransactions/${commonId}`);
      const transactionsFromServer = response.data.transactions; // Access transactions property
      setTransactions(transactionsFromServer);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  const handleAddTransaction = async () => {
    // Ensure commonId is provided and not null
    if (commonId) {
      const newTransaction = {
        name: transactionName,
        type: transactionType,
        amount: parseFloat(transactionAmount) || 0,
      };
  
      try {
        // Send a POST request to the server to update the transactions in the database
        await axios.post('http://localhost:5000/api/addTransaction', {
          commonId,
          name: newTransaction.name,
          type: newTransaction.type,
          amount: newTransaction.amount,
        });
  
        console.log('New Transaction sent to the server:', newTransaction);
  
        // Fetch updated transactions after adding a new one
        fetchTransactions();
      } catch (error) {
        console.error('Error sending transaction to the server:', error);
      }
  
      // Update state locally (this can be done optimistically before the request)
      setTransactions([...transactions, newTransaction]);
      setTransactionName('');
      setTransactionType('expense');
      setTransactionAmount('');
    } else {
      console.error('Invalid commonId:', commonId);
    }
  };
  
  const handleDeleteTransaction = async (index) => {
  try {
    const deletedTransaction = transactions[index];

    // Send a DELETE request to the server to remove the transaction from the database
    await axios.delete(`http://localhost:5000/api/deleteTransaction/${commonId}/${deletedTransaction._id}`);

    // Update state locally
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);

    console.log('Transaction deleted:', deletedTransaction);
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};


const data = {
  labels: ['Income', ...transactions.map((transaction) => transaction.name)],
  datasets: [
    {
      data: [income, ...transactions.map((transaction) => (transaction.type === 'expense' ? -transaction.amount : transaction.amount))],
      backgroundColor: ['#662549', '#9B5D73', '#A78295', '#C38B8B', '#EF9595', '#734D61', '#AD7A89', '#BDA2A9', '#D1A596', '#F0AAAF'],
      hoverBackgroundColor: ['#8d3a6f', '#c0829c', '#d3a3b7', '#e1b1ae', '#f2cdc9', '#925875', '#c792a2', '#d7b1bd', '#e5c0ad', '#f9c6c5']
   
     
    },
  ],
};




  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalSavings = transactions
    .filter((transaction) => transaction.type === 'savings')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalInvestment = transactions
    .filter((transaction) => transaction.type === 'investment')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const total = -totalExpense + totalSavings + totalInvestment + income;

  

  const percentageExpense = ((totalExpense / total) * 100).toFixed(2) || 0;
  const percentageSavings = ((totalSavings / total) * 100).toFixed(2) || 0;
  const percentageInvestment = ((totalInvestment / total) * 100).toFixed(2) || 0;



  return (
    <div>
      <div style={componentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '70%', position: 'relative' }}>
  <Doughnut data={data} />
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'black', fontWeight: 'bold',marginTop: '15px' }}>
  ₹{total}
  </div>
</div>

        <div style={{ width: '60%' }}>
          <h2>Transaction Input</h2>
          <div class="transaction-container">
          <label>
            Transaction Name:
            <input
              type="text"
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
            />
          </label>
          <label>
            Transaction Type:
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
            </select>
          </label>
          <label>
            Transaction Amount:
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
          </label>
          <button className="add-transaction-button" onClick={handleAddTransaction}>
      Add Transaction
    </button>
        </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '50px'}}>
      <div style={{ flex: 1, marginLeft: '150px', marginTop: '40px' }}>
        <h2 style={{ marginBottom: '10px', marginLeft: '20px', fontWeight: 'normal', fontSize: '1.15rem' }}>Total Expense: ₹{totalExpense}</h2>
        <h2 style={{ marginBottom: '10px', marginLeft: '20px', fontWeight: 'normal', fontSize: '1.15rem' }}>Total Savings: ₹{totalSavings}</h2>
        <h2 style={{ marginBottom: '10px', marginLeft: '20px', fontWeight: 'normal', fontSize: '1.15rem' }}>Total Investment: ₹{totalInvestment}</h2>
      </div>

      <div style={{ flex: 1, marginLeft: '-60px' }}>
        <h2 style={{ marginBottom: '0px' }}>Transaction History</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginLeft: '0' }}>
          {transactions.map((transaction, index) => (
            <li key={index} style={{ paddingBottom: '5px' }}>
              <span style={{ marginRight: '10px' }}>{transaction.name}</span>
              <span style={{ color: transaction.amount < 0 ? 'red' : '#944E63' }}>₹{transaction.amount}</span>
              <button style={{ marginLeft: '10px', padding: '5px', backgroundColor: '#E78895', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteTransaction(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

</div>

    </div>

    </div>
  );
}



export default Budgeting;

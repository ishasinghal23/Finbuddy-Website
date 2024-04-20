const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Common ID Schema
const commonIdSchema = new mongoose.Schema({
  customId: { type: String, unique: true, required: true },
});

const CommonId = mongoose.model('CommonId', commonIdSchema);

// User Schema
const userSchema = new mongoose.Schema({
  commonId: { type: String, unique: true, required: true },
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const expenseSchema = new mongoose.Schema({
  expenseType: String,
  expenseAmount: Number,
});

const assetSchema = new mongoose.Schema({
  assetType: String,
  assetAmount: Number,
  assetInterest: Number,
});

const debtSchema = new mongoose.Schema({
  debtAmount: Number,
  debtInterest: Number,
  debtTime: Number,
});

const familyMemberSchema = new mongoose.Schema({
  income: Number,
  avgMonthlyTax: Number,
  taxRegime: String,
});

// MongoDB schema for transactions
const transactionSchema = new mongoose.Schema({
  commonId: String,
  name: String,
  type: String,
  amount: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);


// FormSchema modification
const FormSchema = new mongoose.Schema({
  commonId: String,
  name: String,
  age: Number,
  occupation: String,
  maritalStatus: String,
  gender: String,
  planningType: String,
  income: Number,
  avgMonthlyTax: Number,
  taxRegime: String,
  familyMembers: [familyMemberSchema],
  NoOfMembers: Number,
  expenses: [expenseSchema],
  assets: [assetSchema],
  goalType: String,
  debts: [debtSchema],
  budgetPreference: String,
  emergencyFund: Number,
  transactions: [transactionSchema],
});

const Form = mongoose.model('Form', FormSchema);


// API routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const commonId = generateCommonId();

    const user = new User({ commonId, username, email, password });
    await user.save();

    res.status(200).json({ message: 'User registered successfully', commonId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', commonId: user.commonId });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

// submitForm endpoint modification
app.post('/api/submitForm', async (req, res) => {
  try {
    console.log('Received form data from client:', req.body);
    const {
      commonId,
      name,
      age,
      occupation,
      maritalStatus,
      gender,
      planningType,
      income,
      avgMonthlyTax,
      taxRegime,
      familyMembers,
      expenses,
      assets,
      goalType,
      debts,
      budgetPreference,
      emergencyFund,
    } = req.body;

    const NoOfMembers = planningType === 'Family' ? familyMembers.length : 0;

    const adjustedFamilyMembers =
    planningType === 'Yourself'
      ? [] // Empty array if planningType is Personal
      : familyMembers.map((member, index) => ({
          income: parseFloat(member[`familyMemberIncome${index}`]), // Ensure conversion to number
          avgMonthlyTax: parseFloat(member[`familyMemberAvgMonthlyTax${index}`]), // Ensure conversion to number
          taxRegime: member[`familyMemberTaxRegime${index}`],
        }));
  
    const form = new Form({
      commonId,
      name,
      age,
      occupation,
      maritalStatus,
      gender,
      planningType,
      income,
      avgMonthlyTax,
      taxRegime,
      familyMembers: adjustedFamilyMembers,
      NoOfMembers,
      expenses: expenses.map((expense, index) => ({
        expenseType: expense[`expenseType${index}`],
        expenseAmount: expense[`expenseAmount${index}`]
      })),
      assets: assets.map((asset, index) => ({
        assetType: asset[`assetType${index}`],
        assetAmount: asset[`assetAmount${index}`],
        assetInterest: asset[`assetInterest${index}`]
      })),
      goalType,
      debts: debts.map((debt, index) => ({
        debtAmount: debt[`debtAmount${index}`],
        debtInterest: debt[`debtInterest${index}`],
        debtTime: debt[`debtTime${index}`]
      })),
      budgetPreference,
      emergencyFund,
    });

    await form.save();

    res.status(200).send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Error submitting form' });
  }
});

app.get('/api/getform/:commonId', async (req, res) => {
  try {
    const commonId = req.params.commonId;

    const formData = await Form.findOne({ commonId });

    if (!formData) {
      return res.status(404).json({ error: 'Form data not found for the given common ID' });
    }

    res.status(200).json(formData);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Error fetching form data' });
  }
});


// Helper function to generate common ID
function generateCommonId() {
  const timestamp = new Date().getTime().toString();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return timestamp + random;
}



// API endpoint to add a new transaction
app.post('/api/addTransaction', async (req, res) => {
  const { commonId, name, type, amount } = req.body;
  const newTransaction = new Transaction({ commonId, name, type, amount }); // Use correct field names

  try {
    await newTransaction.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Error adding transaction' });
  }
});


// API endpoint to add a new transaction
app.post('/api/addTransaction', async (req, res) => {
  const { commonId, name, type, amount } = req.body;
  const newTransaction = new Transaction({ commonId, name, type, amount });

  try {
    await newTransaction.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Error adding transaction' });
  }
});


// API endpoint to get transactions for a specific commonId
app.get('/api/getTransactions/:commonId', async (req, res) => {
  const { commonId } = req.params;
  try {
    const transactions = await Transaction.find({ commonId });
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});


app.delete('/api/deleteTransaction/:commonId/:id', async (req, res) => {
  try {
    const commonId = req.params.commonId;
    const id = req.params.id;

    await Transaction.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

app.get('/api/getform/:commonId', async (req, res) => {
  const { commonId } = req.params;
  try {
    console.log('Received commonId:', commonId);

    // Use find() to get an array of matching documents
    const formDataArray = await Form.find({ commonId });

    if (!formDataArray || formDataArray.length === 0) {
      return res.status(404).json({ error: 'Form data not found for the given common ID' });
    }

    // Assuming you want to calculate total income for all family members in all forms
    const totalIncome = formDataArray.reduce((total, formData) => {
      if (formData.familyMembers && formData.familyMembers.length > 0) {
        const familyIncome = formData.familyMembers.reduce((familyTotal, member) => {
          return familyTotal + member.income;
        }, 0);
        return total + familyIncome;
      }
      return total;
    }, 0);

    // Add the totalIncome to the response
    const responseData = {
      ...formDataArray[0]._doc, // Assuming you want to include other fields as well
      totalIncome: totalIncome,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Error fetching form data' });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

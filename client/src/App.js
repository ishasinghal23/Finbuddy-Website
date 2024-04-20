import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Form from './Form';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Navbar from './Navbar';
import Budgetting from './Budgetting';
import Dashboard from './Dashboard'; 
import Investment from './Investment';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    budgetType: '',
    familyMembers: 0,
    personalGoal: '',
    commonId: '', // Add commonId to the initial state
  });
  const [step, setStep] = useState(1);


  const handleLogin = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      const { commonId } = response.data;
  
      setIsLoggedIn(true);
      // Reset form data and step when a new user logs in
      setFormData({
        budgetType: '',
        familyMembers: 0,
        personalGoal: '',
        commonId: commonId, // Set commonId from the response
      });
      setStep(1);
  
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials. Please try again.');
    }
  };
  
  
  const handleRegister = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      const { commonId } = response.data;
  
      // Reset form data and step when a new user registers
      setFormData({
        budgetType: '',
        familyMembers: 0,
        personalGoal: '',
        commonId: commonId, // Set commonId from the response
      });
      setStep(1);
  
      navigate('/form');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user. Please try again.');
    }
  };

  
  const handleFormSubmit = async () => {
    try {
      // Ensure commonId is set in the formData before submission
      const formDataWithCommonId = { ...formData, commonId: formData.commonId || generateCommonId() };
  
      // Send form data to the server
      await axios.post('http://localhost:5000/api/submitForm', formDataWithCommonId);
  
      // After successful submission, fetch updated form data
      fetchFormData();
  
      // Navigate to the dashboard or any other desired page
      navigate('/login');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };
  
  

  const handleChange = (e, index, arrayName, subField) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) => {
      if (arrayName && arrayName === 'familyMemberIncomes') {
        // Ensure familyMemberIncomes is an array in the initial state
        const familyMemberIncomes = prevFormData[arrayName] || [];
        
        // Update specific family member income in the array
        const updatedFamilyMemberIncomes = familyMemberIncomes.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        );
  
        return {
          ...prevFormData,
          [arrayName]: updatedFamilyMemberIncomes,
        };
      } else if (arrayName) {
        // Update other arrays (expenses, assets, debts)
        return {
          ...prevFormData,
          [arrayName]: prevFormData[arrayName].map((item, i) =>
            i === index ? { ...item, [name]: value } : item
          ),
        };
      } else {
        // Update regular form field
        return {
          ...prevFormData,
          [name]: value,
        };
      }
    });
  };
  


  
  const handleAdd = (arrayName) => {
    setFormData((prevFormData) => {
      const newArray = prevFormData[arrayName] || []; // Initialize as an empty array if undefined
      return {
        ...prevFormData,
        [arrayName]: [...newArray, {}],
      };
    });
  };
  
  

  const handleRemove = (index, arrayName) => {
    setFormData((prevFormData) => {
      const array = prevFormData[arrayName] || [];
      const updatedArray = array.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        [arrayName]: updatedArray,
      };
    });
  };
  
  const fetchFormData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getform/${formData.commonId}`);
      const formDataFromServer = response.data;
      setFormData(formDataFromServer);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };
  
  useEffect(() => {
    fetchFormData(); // Fetch form data when the component mounts
  }, [formData.commonId]); // Add formData.commonId as a dependency to the useEffect hook
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Redirect to the register page after logout
    navigate('/register');
  };

  function generateCommonId() {
    const timestamp = new Date().getTime().toString();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return timestamp + random;
  }
  

  return (
     <div>
    <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> {/* Include the Navbar component */}
    <div>
        {isLoggedIn ? (
          <>

    <Routes>
      <Route path="/home" element={<Home commonId={formData.commonId} />} />
      <Route path="/investment" element={<Investment commonId={formData.commonId} />} />
      <Route path="/budgeting" element={<Budgetting commonId={formData.commonId} />} />
      <Route path="/dashboard" element={<Dashboard commonId={formData.commonId}/>} />
    </Routes>
  
          </>
        ) : (
          <>
            <Routes>
            <Route
    path="/"
    element={<Navigate to="/register" />} // Redirect to /register when the root path is accessed
  />
              <Route
                path="/register"
                element={<RegistrationForm onRegister={(formData) => handleRegister(formData)} />}
              />
              <Route
                path="/form"
                element={
                  <Form
                    step={step}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={() => handleFormSubmit(formData)}
                    handleAdd={handleAdd}
                    handleRemove={handleRemove}
                    setStep={setStep}
                    labelStyle={labelStyle}
                    buttonStyle={buttonStyle}
                  />
                }
              />
              <Route
                path="/login"
                element={<LoginForm
                  onLogin={(formData) => handleLogin(formData)}
                  onRegisterRedirect={() => <Navigate to="/register" />}
                />}
              />


            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  // Define your label styles here
};

const buttonStyle = {
  backgroundColor: '#815B5B',
  color: 'white',
  padding: '10px 20px',
  margin: '10px 0',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default App;
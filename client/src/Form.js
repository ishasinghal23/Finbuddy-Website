import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import FamilyMemberDetails from './FamilyMemberDetails';
import './Formstyles.css';

const assetOptions = [
  { value: 'Stocks', label: 'Stocks' },
  { value: 'Bonds', label: 'Bonds' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'Cash', label: 'Cash' },
];

const loadOptions = (inputValue, callback) => {
  // Simulate an API call to fetch options based on user input
  const filteredOptions = assetOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Add the inputValue as an option if it doesn't match any existing options
  if (!filteredOptions.some(option => option.label.toLowerCase() === inputValue.toLowerCase())) {
    filteredOptions.push({ value: inputValue, label: inputValue });
  }

  callback(filteredOptions);
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : '#fff',
    color: state.isSelected ? '#fff' : '#000',
    ':hover': {
      backgroundColor: state.isSelected ? '#0056b3' : '#f0f0f0',
    },
  }),
};


const Form = ({ step, formData, handleChange,handleAdd, handleRemove, handleSubmit, setStep, labelStyle, buttonStyle }) => {
  switch (step) {
    case 1:
      return (
        
<div className="page-background">
        <div className='form-container'>
          <label className='form-label'>Name:</label>
          <br />
          <input
            className="input-container"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <br />

          <label className='form-label'>Age:</label>
          <br />
          <input
            className="input-container"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <br />

          <label className='form-label'>Occupation:</label>
          <br />
          <input
            className="input-container"
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
          <br />

          <label className='form-label'>Marital Status:</label>
          <br />
          <input
            className="radio-input"
            type="radio"
            name="maritalStatus"
            value="Single"
            onChange={handleChange}
            checked={formData.maritalStatus === 'Single'}
          />{' '}
          Single
          <br />
          <input
            className="radio-input"
            type="radio"
            name="maritalStatus"
            value="Married"
            onChange={handleChange}
            checked={formData.maritalStatus === 'Married'}
          />{' '}
          Married
          <br />

          <label className='form-label'>Gender:</label>
          <br />
          <input
            className="radio-input"
            type="radio"
            name="gender"
            value="Male"
            onChange={handleChange}
            checked={formData.gender === 'Male'}
          />{' '}
          Male
          <br />
          <input
            className="radio-input"
            type="radio"
            name="gender"
            value="Female"
            onChange={handleChange}
            checked={formData.gender === 'Female'}
          />{' '}
          Female
          <br />
          <input
            className="radio-input"
            type="radio"
            name="gender"
            value="Other"
            onChange={handleChange}
            checked={formData.gender === 'Other'}
          />{' '}
          Other
          <br />

          <label className='form-label'>Planning for yourself or family?</label>
          <br />
          <input
            className="radio-input"
            type="radio"
            name="planningType"
            value="Yourself"
            onChange={handleChange}
            checked={formData.planningType === 'Yourself'}
          />{' '}
          Yourself
          <br />
          <input
            className="radio-input"
            type="radio"
            name="planningType"
            value="Family"
            onChange={handleChange}
            checked={formData.planningType === 'Family'}
          />{' '}
          Family
          <br />

          <button
            style={{...buttonStyle, backgroundColor:'#815B5B'}}
            onClick={() => setStep(2)}
          >
            Next
          </button>
        </div>
        </div>
      );

    case 2:
      return (
        <div className="page-background">
        <div className='form-container'>
          {formData.planningType === 'Yourself' ? (
            <>
              {/* Page 2 for individual */}
              <label className='form-label'>Income:</label>
              <br />
              <input
                className="input-container"
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
              />
              <br />

              <label className='form-label'>Average Monthly Tax %:</label>
              <br />
              <input
                className="input-container"
                type="number"
                name="avgMonthlyTax"
                value={formData.avgMonthlyTax}
                onChange={handleChange}
              />
              <br />

              <label className='form-label'>Tax Regime:</label>
              <br />
              <input
                className="radio-input"
                type="radio"
                name="taxRegime"
                value="Option1"
                onChange={handleChange}
                checked={formData.taxRegime === 'Option1'}
              />{' '}
              New
              <br />
              <input
                className="radio-input"
                type="radio"
                name="taxRegime"
                value="Option2"
                onChange={handleChange}
                checked={formData.taxRegime === 'Option2'}
              />{' '}
              Old
              <br />
              {/* Add more dummy options as needed */}
            </>
          ) : (
            <>
           {/* Page 2 for family */}
           <label className='form-label'>Number of Family Members:</label>
              <br />
              <input
                className="input-container"
                type="number"
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleChange}
              />
              <br />

              {Array.isArray(formData.familyMembers) && formData.familyMembers.map((familyMember, index) => (
  <FamilyMemberDetails
    key={index}
    index={index}
    formData={formData}
    handleChange={handleChange}
    handleRemove={handleRemove}
    labelStyle={labelStyle}
  />
))}
<button onClick={() => handleAdd('familyMembers')}>Add Family Member</button>


              <br />
            </>
          )}
          <br />
          <button
            style={{...buttonStyle, marginRight: '10px', marginBottom: '8px'}}
            onClick={() => setStep(3)}
          >
            Next
          </button>
          <button style={buttonStyle} onClick={() => setStep(1)}>
            Previous
          </button>
        </div>
        </div>
      );

      
    case 3:
      return (
        <div className="page-background">
        <div className='form-container'>
          {/* Page 3 for both individual and family */}
          <label className='form-label'>Enter Your Expenses:</label>
          <br />
          {/* Add options for expenses with plus option */}
          {formData.expenses && formData.expenses.map((expense, index) => (
            <div key={index}>
              <input
                className="input-container"
                type="text"
                name={`expenseType${index}`}
                value={expense.type}
                onChange={(e) => handleChange(e, index, 'expenses')}
                placeholder="Expense Type"
              />
              <input
                className="input-container"
                type="number"
                name={`expenseAmount${index}`}
                value={expense.amount}
                onChange={(e) => handleChange(e, index, 'expenses')}
                placeholder="Amount"
              />
              {index > 0 && (
                <button onClick={() => handleRemove(index, 'expenses')}>Remove</button>
              )}
            </div>
          ))}
          <button onClick={() => handleAdd('expenses')}>Add Expense</button>
          <br />
          <button style={{...buttonStyle, marginRight: '10px', marginBottom: '8px'}} onClick={() => setStep(4)}>
            Next
          </button>
          <button style={buttonStyle} onClick={() => setStep(2)}>
            Previous
          </button>
        </div>
        </div>
      );

      case 4:
        return (
          <div className="page-background">
            <div className='form-container'>
              <label className='form-label'>Enter Your Assets:</label>
              <br />
              {formData.assets && formData.assets.map((asset, index) => (
                <div key={index}>
                  <AsyncCreatableSelect
                    className="input-container"
                    name={`assetType${index}`}
                    isClearable
                    loadOptions={(inputValue, callback) => loadOptions(inputValue, callback)}
                    defaultOptions={assetOptions}
                    value={assetOptions.find(option => option.value === asset.type)}
                    onChange={(selectedOption) => handleChange(
                      { target: { name: `assetType${index}`, value: selectedOption ? selectedOption.value : '' } },
                      index,
                      'assets'
                    )}
                    styles={customStyles}
                  />
                  <input
                    className="input-container"
                    type="number"
                    name={`assetAmount${index}`}
                    value={asset.amount}
                    onChange={(e) => handleChange(e, index, 'assets')}
                    placeholder="Amount"
                  />
                  <input
                    className="input-container"
                    type="number"
                    name={`assetInterest${index}`}
                    value={asset.interest}
                    onChange={(e) => handleChange(e, index, 'assets')}
                    placeholder="Interest Rate %"
                  />
                  {index > 0 && (
                    <button onClick={() => handleRemove(index, 'assets')}>Remove</button>
                  )}
                </div>
              ))}
              <button onClick={() => handleAdd('assets')}>Add Asset</button>
              <br />
              <button style={{ ...buttonStyle, marginRight: '10px', marginBottom: '8px' }} onClick={() => setStep(5)}>
                Next
              </button>
              <button style={buttonStyle} onClick={() => setStep(3)}>
                Previous
              </button>
            </div>
          </div>
        );
        case 5:
          return (
            <div className="page-background">
            <div className='form-container'>
              {/* Page 5 for both individual and family */}
              <label className='form-label'>Goal:</label>
              <br />
              <input
                className="radio-input"
                type="radio"
                name="goalType"
                value="ShortTerm"
                onChange={handleChange}
                checked={formData.goalType === 'ShortTerm'}
              />{' '}
              Short Term
              <br />
              <input
                className="radio-input"
                type="radio"
                name="goalType"
                value="LongTerm"
                onChange={handleChange}
                checked={formData.goalType === 'LongTerm'}
              />{' '}
              Long Term
              <br />
        
              <label className='form-label'>Debt Situation:</label>
              <br />
              {/* Add options for debts with plus option */}
              {formData.debts && formData.debts.map((debt, index) => (
                <div key={index}>
                  <input
                    className="input-container"
                    type="number"
                    name={`debtAmount${index}`}
                    value={debt.amount}
                    onChange={(e) => handleChange(e, index, 'debts')}
                    placeholder="Debt Amount"
                  />
                  <input
                    className="input-container"
                    type="number"
                    name={`debtInterest${index}`}
                    value={debt.interest}
                    onChange={(e) => handleChange(e, index, 'debts')}
                    placeholder="Interest Rate %"
                  />
                  <input
                    className="input-container"
                    type="number"
                    name={`debtTime${index}`}
                    value={debt.time}
                    onChange={(e) => handleChange(e, index, 'debts')}
                    placeholder="Time"
                  />
                  {index > 0 && (
                    <button onClick={() => handleRemove(index, 'debts')}>Remove</button>
                  )}
                </div>
              ))}
              <button onClick={() => handleAdd('debts')}>Add Debt</button>
              <br />
        
              <label className='form-label'>Budgeting Preference:</label>
              <br />
              <input
                className="radio-input"
                type="radio"
                name="budgetPreference"
                value="Detailed"
                onChange={handleChange}
                checked={formData.budgetPreference === 'Detailed'}
              />{' '}
              Detailed
              <br />
              <input
                className="radio-input"
                type="radio"
                name="budgetPreference"
                value="Flexible"
                onChange={handleChange}
                checked={formData.budgetPreference === 'Flexible'}
              />{' '}
              Flexible
              <br />
        
              <label style={labelStyle}>Emergency Fund:</label>
              <br />
              <input
                className="input-container"
                type="number"
                name="emergencyFund"
                value={formData.emergencyFund}
                onChange={handleChange}
              />
              <br />
        
              <br />
              <button style={{...buttonStyle, marginRight: '10px', marginBottom: '8px'}} onClick={handleSubmit}>
                Submit
              </button>
              <button style={buttonStyle} onClick={() => setStep(4)}>
                Previous
              </button>
            </div>
          </div>
          );
        
    default:
      return null;
  }
};

export default Form;

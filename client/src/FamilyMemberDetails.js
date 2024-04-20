import React from 'react';
import styled from 'styled-components';

const RadioLabel = styled.label`
  display: inline-block;
  margin-right: 10px;
`;

const RadioInput = styled.input`
  margin-right: 5px;
`;

const FamilyMemberDetails = ({ index, formData, handleChange, handleRemove, labelStyle }) => {
  if (formData.planningType === 'yourself') {
    // If planningType is 'yourself', don't render family-related questions
    return null;
  }

  return (
    <div key={index}>
      <label className='form-label'>Family Member {index + 1} Details:</label>
      <br />

      <label className='form-label'>Income:</label>
      <br />
      <input
        className="input-container"
        type="number"
        name={`familyMemberIncome${index}`}
        value={formData[`familyMemberIncome${index}`]}
        onChange={(e) => handleChange(e, index, 'familyMembers', 'income')}
      />
      <br />

      <label className='form-label'>Average Monthly Tax:</label>
      <br />
      <input
        className="input-container"
        type="number"
        name={`familyMemberAvgMonthlyTax${index}`}
        value={formData[`familyMemberAvgMonthlyTax${index}`]}
        onChange={(e) => handleChange(e, index, 'familyMembers', 'avgMonthlyTax')}
      />
      <br />

      <label className='form-label'>Tax Regime:</label>
      <br />
      <RadioLabel>
        <RadioInput
          className="radio-input"
          type="radio"
          name={`familyMemberTaxRegime${index}`}
          value="Option1"
          onChange={(e) => handleChange(e, index, 'familyMembers', 'taxRegime')}
          checked={formData[`familyMemberTaxRegime${index}`] === 'Option1'}
        />
        Old
      </RadioLabel>
      <RadioLabel>
        <RadioInput
          className="radio-input"
          type="radio"
          name={`familyMemberTaxRegime${index}`}
          value="Option2"
          onChange={(e) => handleChange(e, index, 'familyMembers', 'taxRegime')}
          checked={formData[`familyMemberTaxRegime${index}`] === 'Option2'}
        />
        New
      </RadioLabel>
      <br />

      {index > 0 && (
        <button onClick={() => handleRemove(index, 'familyMembers')}>Remove Family Member</button>
      )}
    </div>
  );
};

export default FamilyMemberDetails;

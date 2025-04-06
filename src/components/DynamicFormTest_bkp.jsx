import React, { useEffect, useState } from 'react';
import { useFormContext } from '../contexts/formContext';
import styled from "styled-components";
import { toast } from 'react-toastify';
import axios from 'axios';
import {config} from '../components/reactConfig'

// Function to validate fields based on their validation rules
const validateField = (field, value, validation) => {
  let error = '';
  if (validation.required && !value) {
    error = `${field} is required`;
  } else if (validation.minLength && value.length < validation.minLength) {
    error = `${field} must be at least ${validation.minLength} characters`;
  } else if (validation.maxLength && value.length > validation.maxLength) {
    error = `${field} must be less than ${validation.maxLength} characters`;
  } else if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
    error = `${field} is invalid`;
  }
  
  return error;
};

const DynamicFormTest = ({ formSchema }) => {
  const { state, setField, submtForm, initializeForm } = useFormContext();
  const { formId, fields } = formSchema;
  // console.log(state.forms)
  const { fields:formData } = state.forms.Transactions;

  // const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Initialize form when the component mounts
  useEffect(() => {
    if (!state.forms[formId]) {
      initializeForm(formId, fields);  // Initialize the form only once
    }
  }, [formId, fields, state.forms, initializeForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(state)
    setField(formId, name, value, null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const field = fields.find((f) => f.name === name);
    const error = validateField(field.label, value, field.validation || {});
    setField(formId, name, value, error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const errors = {};
    console.log(formData)
    fields.forEach((field) => {
      const value = fields[field.name] || '';
      const error = validateField(field.label, value, field.validation || {});
      if (error) {
        hasError = true;
        errors[field.name] = error;
      }
    });

    if (hasError) {
      setFormErrors(errors);
    } else {
      // submitForm(formId, fields);
      axios.post(`${config.restAPIserver}:${config.restAPIHost}/api/execProcDynamicJson`,formData)
      .then(({data,status}) => {
          if ( ( status && status !== 200 ) || data !== "OK" ) {
              // If order is not tracked thrown an error
              toast.error(data)
          }
          else {
            initializeForm(formId, fields);
              toast.success("Transaction has been recorded");
              // navigate("/admin",{state:{orderId:getAttrState1[0].ORDERID}});
          }
                  })
      .catch((e) => {
              // console.log(e);
              // productAction({type:"NO_CHANGE_2_STATE"});
              toast.error(`Transaction failed`); 
          })
    }
  };

  // Ensure safe access to form data
  const formFields = state.forms[formId]?.fields || {};

  return (
    <Container className="container">
      <div className="d-flex">
        <h1 className="login">{formId}</h1>
      </div>
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="d-flex flex-column" >
          <div className="form-group">
          <label className="label">{field.label}</label>
          <input
            className="form-control"
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            value={formFields[field.name] || ''}
            required={field.required}
          />
          </div>
          {formErrors[field.name] && <span>{formErrors[field.name]}</span>}
        </div>
      ))}
      <div className="d-flex justify-content-center my-3">
          <button className="btn btn-sm forward-btn" type="submit">
            Submit
          </button>
        </div>
    </form>
    </Container>
  );
};

export default DynamicFormTest;


const Container = styled.div`
width:30rem;
background-color:white;
border-radius:5%;
padding:2rem;
font-style:italic;
margin-top:6rem;
margin-bottom:10rem;
font-family: 'Courier New', monospace;
.navImage{
    height: 4rem;
    width:  4rem;
}
.btn  {width:10rem;}
.form-group {
    text-align:center;
}
.form-control{
    border:none;
    border-bottom:1px solid;
    border-radius:0;
    text-align:center;
    margin:auto;
}
.login{
    font-size:2rem;
    // font-family: 'Brush Script MT', cursive;
    color: var(--amzonChime);
    font-weight:bold;
    border-bottom: 3px solid var(--amzonChime); 
    margin:auto;
    margin-bottom:2rem;
}
.label{
    margin:0.75rem 0 0.5rem 0.5rem;
    color: var(--amxonChine); 
    font-weight:bold;
    text-transform:capitalize;
}
.btn{
    margin:0 0 1rem 0;
    // width:5rem;
}
.back-btn{
    background:var(--bsRed);
    color:white;
    text-align:center;
    margin-right:1rem;
}
.forward-btn{
        background:var(--amzonChime);
        color:white;
        text-align:center;
        margin-right:1rem;
    }
}
.icons{
    font-size:1.5rem;
    margin-left:1rem;
}
@media (max-width:798px){
    width:21rem;
    .form-control{
        width:11rem;
    } 
}
`;
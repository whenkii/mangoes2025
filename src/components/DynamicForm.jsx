import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
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

const DynamicForm = ({ formSchema }) => {
  const { formId, fields,added_by,failedMessage,successMessage,navigateTo } = formSchema;
  const navigate = useNavigate();
  const [formData, setFormData] = useState(fields);
  const [formErrors, setFormErrors] = useState({});
  const { proc, rec } = formSchema;

  // Set formLoaded state
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    setFormLoaded(true);
  }, []);

  useEffect(() => {
    // Simulate fetching or updating data
    const newFormData = [...fields]; // or update your fields here
    setFormData(newFormData);
  }, [fields]);  // Make sure this useEffect is triggered when the data changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevItems) =>
      prevItems.map((item) =>
        item.name === name ? { ...item, value:value } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const errors = {};
    formData.forEach((field) => {
      const value = field.value || '';
      const error = validateField(field.label, value, field.validation || {});
      if (error) {
        hasError = true;
        errors[field.name] = error;
      }
    });

    if (hasError) {
      setFormErrors(errors);
    } else {
      const dbData = formData.reduce((acc, field) => {
        acc[field.name.toUpperCase()] = field.value;
        return acc;
      }, {});
      dbData.ADDED_BY = added_by;
      const finalState = {
        scriptName: proc,
        recName: rec,
        binds: [{ p_in: dbData }],
      };
      // console.log(finalState)
      axios
        .post(`${config.restAPIserver}:${config.restAPIHost}/api/execProcDynamicNoOutRec`, finalState)
        .then(({ data, status }) => {
          if ((status && status !== 200) || data !== 'OK') {
            toast.error(data);
          } else {
            toast.success(successMessage);
            navigate(navigateTo);
          }
        })
        .catch(() => {
          toast.error(failedMessage);
        });
    }
  };

  return (
    <Container className="container">
      <div className="d-flex">
        <h1 className="login">{formId}</h1>
      </div>
      {/* {console.log(formData)} */}
      {formLoaded && (
        <form onSubmit={handleSubmit}>
          {formData.map((field, index) => {
            if (field.type === 'text') {
              return (
                <div key={index} className="d-flex flex-column">
                  <div className="form-group">
                    <label className="label" htmlFor={field.name}>
                      {field.label}:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.value || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              );
            } else if (field.type === 'listbox') {
              return (
                <div key={index} className="d-flex flex-column">
                  <div className="form-group">
                    <label className="label" htmlFor={field.name}>{field.label}:</label>
                    <select
                      className="form-control"
                      id={field.name}
                      name={field.name}
                      value={field.value || ''}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {field.options &&
                        field.options.map((option, i) => (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              );
            }
            return null;
          })}

          <div className="d-flex justify-content-center my-3">
            <button className="btn btn-sm forward-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      )}
    </Container>
  );
};

export default DynamicForm;


const Container = styled.div`
background:white;
margin-top: 6rem;
padding:2rem;
width:75%;
border-radius:20px;
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
    margin:1rem 0 0rem 0.5rem;
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
  width:90%;
    .form-control{
        width:10rem;
    } 
}
`;
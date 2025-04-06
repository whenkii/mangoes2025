import React, { useState } from "react";
import styled from "styled-components";
import { toast } from 'react-toastify';

export default function Dynamicform({ formFields, formName }) {
  // Step 2: Manage form data
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => {
      acc[field.name] = ""; // Initializing state for each field
      return acc;
    }, {})
  );

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  // Step 3: Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    toast.success(formName + " submitted successfully");
    // Handle form submission logic here
  };
  return (
    <Container className="container">
      <div className="d-flex">
        <h1 className="login">{formName}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {formFields.map((field, index) => {
          switch (field.type) {
            case "text":
            case "email":
            case "number":
              return (
                <div key={index} className="d-flex flex-column">
                  <div className="form-group">
                    <div className="label">{field.label}</div>
                    <input
                      className="form-control"
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                    />
                  </div>
                </div>
              );
            case "checkbox":
              return (
                <div className="d-flex flex-column">
                  <div key={index}>
                    <label>
                      <input
                        className="form-control"
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name]}
                        onChange={handleCheckboxChange}
                        required={field.required}
                      />
                      {field.label}
                    </label>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
        <div className="d-flex justify-content-center my-3">
          <button className="btn btn-sm forward-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </Container>
  );
}

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

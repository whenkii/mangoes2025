// import React, { useState, useContext } from "react";
// import styled from "styled-components";
import DynamicFormTest from "./DynamicFormTest";

export default function Transactions(props) {
  const formSchema = {
    formId:"Transactions",
    fields: [
        {
          type: "text",
          label: "First Name",
          name: "firstName",
          placeholder: "Enter your first name",
          required: true,
        },
        {
          type: "text",
          label: "Last Name",
          name: "lastName",
          placeholder: "Enter your last name",
          required: true,
        },
        {
          type: "email",
          label: "Email",
          name: "email",
          placeholder: "Enter your email",
          required: true,
        },
        {
          type: "number",
          label: "Age",
          name: "age",
          placeholder: "Enter your age",
          required: false,
        }
      ],
    "proc":"sp_log_transactions()"
  };

  // const { formId } = formSchema;
  // const { fields } = formSchema;

  return <DynamicFormTest formSchema={formSchema} />;
}

// const MainContainer = styled.div`
//   background-color: white;
//   font-style: italic;
//   margin-top: 10rem;
//   padding: 2rem;
//   text-align: center;
//   font-weight: bold;
//   border-radius: 50px;
//   .icons {
//     font-size: 6rem;
//     color: orange;
//     margin: 1rem;
//   }
//   .total {
//     font-size: 150;
//   }
//   .handshake-icon {
//     font-size: 6rem;
//     color: orange;
//     padding-bottom: 2rem;
//   }
//   .navImage {
//     height: 2rem;
//   }
//   .cartSummaryHeaders {
//     font-weight: bold;
//     margin-left: 1rem;
//   }
//   @media (max-width: 820px) {
//     align: center;
//   }
//   .align-self-start {
//     font-size: 0.6rem;
//   }
//   .details {
//     font-size: 0.5rem;
//   }
// `;

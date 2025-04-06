import React, { useState,useEffect,useContext} from "react";
import axios from 'axios';
import {config} from './reactConfig'
import DynamicForm from "./DynamicForm";
import {accountsContext} from '../contexts/accountsContext'

export default function Transactions(props) {
  const [accountInfo] = useContext(accountsContext);
  const [formLoaded, setFormLoaded] = useState(false);
  const formSchemaInit = {
    formId:"Transactions",
    fields: [
        {
          type: "listbox",
          label: "FROM",
          name: "src",
          options:[],
          required: true,
        },
        {
          type: "listbox",
          label: "TO",
          name: "tgt",
          options:[],
          required: true
        },
        {
          type: "text",
          label: "AMOUNT",
          name: "amount",
          required: true,
        },
        {
          type: "listbox",
          label: "CURRENCY",
          name: "currency",
          options:[{label:"SGD",vlue:"SGD"},{label:"INR",vlue:"INR"}],
          required: true,
        },
        {
          type: "listbox",
          label: "TYPE",
          name: "TRANSACTION_TYPE",
          options:[{label:"SHIPMENT",vlue:"SHIPMENT"},{label:"PERSONAL",vlue:"PERSONAL"}],
          required: true,
        }
        ,
        {
          type: "text",
          label: "SHIPMENT_ID",
          name: "REFERENCE_ID",
          required: false
        }
        ,
        {
          type: "text",
          label: "comments",
          name: "comments",
          required: false,
        }
      ],
    "proc":"sp_insert_transactions",
    "rec":"TRANSACTION_REC",
    "successMessage":"Transaction successfully logged",
    "failedMessage":"Transaction failed to log",
    "navigateTo":"/transactiondetails"
  };

  // const query = `select firstname||', '||lastname user_name from users where type like 'admin'` ;
  const [formSchema,setFormSchema]= useState(formSchemaInit);
  // const [usersList,setUiserslistUpdated]= useState(false);
  const query = `SELECT firstname || ', ' || lastname AS user_name,email FROM users WHERE type LIKE 'admin'`;
  //Mount - Get Users details
  useEffect(() => {
  
    axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
      .then((result) => {
        let { data } = result;
        let { rows: users } = data;
  
        // Get users into an array to pass into a LISTBOX
        let names = users.map(user => ({
          value: user.EMAIL, // Option value
          label: user.USER_NAME, // Option label (can be different if needed)
        }));

  
        let updatedFields = formSchema.fields.map(field => {
          if (['src', 'tgt'].includes(field.name)) {
            return { ...field, options: names }; // Set the options array dynamically
          }
          return field; // Keep other fields the same
        });
  
        setFormSchema(prevFormSchema => ({ ...prevFormSchema, fields: updatedFields,added_by: accountInfo.email}));
        // console.log(formSchema)
      })
      .catch((e) => {
        alert("Couldn't get users list from API\n" + e);
      });
  }, [query]);

  useEffect(() => {setFormLoaded(true)});

  if (!formLoaded) return <div>   </div>

  return <div>
        <DynamicForm 
          formSchema={formSchema} 
          />
          </div>;
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

import React,{useState,useEffect,useContext} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import axios from 'axios';
import DisplayTableData from './DisplayTableData'
import styled from 'styled-components'
import {accountsContext} from '../contexts/accountsContext'
// import {productContext} from '../contexts/mangoesContext'
import {config} from './reactConfig'
// import {AllSpinners} from './Spinners';


export default function TransactionDetails(props) {
    const navigate = useNavigate();
    const {id}= useParams()
    const [accountInfo] = useContext(accountsContext);
    console.log(accountInfo.email)
    const query = `select * from transactions where src='${accountInfo.email}' or tgt='${accountInfo.email}'`;
    const [orderDetails,setOrderDetails]= useState([]);

    //Mount - Get Orders details
    useEffect(() => {
        axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
        .then((result) => {
            let {data} = result;
            let {rows} = data;
    //Set state once data is returned from AXIOS
        setOrderDetails(rows);
                         })
        .catch((e) => {
                       alert( `Couldn't get transactions from API\n ` + e);
                        })
    }, [query])
    //Unmount
    useEffect(() => () => {}, []) 
    return (
        <OrdeDetailsContainer className="container">
            <DataHeader className="text-center p-1">TRANSACTION DETAILS</DataHeader>
            <DisplayTableData state={orderDetails} id={id} comp="TRANSACTIONDETAILS"/>
            <div className="d-flex justify-content-center">
                <div className="btn btn-warning btn-sized-md m-1" onClick={() => navigate(-1)}>Go Back</div>
                <div className="btn btn-success btn-sized-md m-1" onClick={() => navigate("/")}>Home</div>
            </div>
        </OrdeDetailsContainer>
    )
}

const OrdeDetailsContainer = styled.div`
margin-top:8rem;
`

const OrdersContainer = styled.div`
margin-top:8rem;
.cartTotHeaders{
    font-weight:bold;
    color:var(--bsRed);
}
`

const DataHeader = styled.h1`
background:white;
font-size:2rem;
// font-family: 'Brush Script MT', cursive;
font-family: 'Courier New', monospace;
font-weight:bold;
font-family: 'Courier New', monospace;
// color:var(--amazonChime);
border-radius:0.25rem;
box-shadow: 0 0 0.8rem 0.25rem rgba(0,0,0,1);
@media (max-width:390px)
{
    font-size:1.2rem;
    font-weight:bold;
}
`







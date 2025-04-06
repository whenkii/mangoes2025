import React,{useContext,useEffect,useState} from 'react'
import styled from 'styled-components'
import {RiShoppingBasketLine
    ,RiInformationLine
} from 'react-icons/ri'
import {productContext} from '../contexts/mangoesContext'
import GetImage from "./GetImage"
// import banginapalli_prod from '../images/banginapalli_prod.jpeg';
import {AllSpinners} from './Spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import * as fasIcons from 'react-icons/fa'
import { GetApiData } from '../components/ApiCalls';

// import { ToastContainer } from 'react-toastify';

export default function ProductList() {
const [productsState,productAction,,productCountReducer,,,,,,pageHome,setPageHome,,configState,currency] = useContext(productContext);
const productNames = {Alphonso:["ఆల్పాన్సా/ఖాదర్","अल्फांसो","அல்பான்சோ","ಅಲ್ಫ್ನಸೋ"],
                      AlphonsoJumbo:["ఆల్పాన్సా/ఖాదర్ Jmbo","अल्फांसो","அல்பான்சோ","ಅಲ್ಫ್ನಸೋ"],
                      Kesar:["Kesar","केसर","కేసర్","ಕೇಸರ್"],
                      Chandura:["Chandura","పుల్లూరా","चंदुरा"],
                      Mixed:["Banginapalli","Alphonso","Chandura"],
                      Banginapalli:["బంగినపల్లి/బేనీషా","बदामी","பங்கினப்பள்ளி","ಬಂಗಿನಾಂಪಲ್ಲಿ"],
                      Mallika:["మల్లికా","मल्लिका","மல்லிகா","ಮಲ್ಲಿಕಾ"],
                      Neelam:["నీలం","नीलम","நீலம்","ನೀಲಂ"],
                      Kalepadu:["కాలేపాడు","कालेपाडु","காலேபாடு"],
                      ImamPasand:["ఇమామ్ పసంద్","इमाम पसंद","இமாம் பஸ்சந்த்","ಇಮಾಮ ಪಸಂದ್"],
                      PeddaRasalu:["పెద్ద రసాలు","Juicy Mango"]};
const productColors = ["secondary","warning","info","dark"];
const [areaNames,setAreas]=useState({})
const [loaded,setLoaded]=useState(false)


const paymentDetails = configState[0].val ? JSON.parse(configState[0].val.filter( a => a.NAME === "PAYMENTINFO")[0].JSON_STRING).value:null;
const {whatsappNo} = paymentDetails ? paymentDetails :123;

const delDate = configState[0].val ? JSON.parse(configState[0].val.filter( a => a.NAME === "DEL_DATE")[0].JSON_STRING).value:null;

const isProductExistsInCart = (props) => productsState.filter(a => a.ID === props && a.QTY > 0);
const currencySymb = currency === "SGD" ? "$" : "";

useEffect( () => {
    setPageHome(true);
})
//Dont render on first load -- (I think so)
useEffect( () => {
 return () =>  setPageHome(false);
})

useEffect( () => {
    GetApiData("select * from react_config")
    .then((res) => {
        if (res[0] === "ERROR"){
            alert("Error while getting data from DB");    
        }
        else if ( res.length === 0 )  {
        alert("No Data found");
        }
        else if ( res.length > 0 ) {
        const getDBValue = (props) => {
                return JSON.parse(res.filter( a => a.NAME === props)[0].JSON_STRING).value
            }
        const initFormFields=getDBValue("SELF_LOCATIONS");
        var formNamePostalCode = initFormFields.map(a => a.name + ' - '+ a.details[3])
        setAreas([...formNamePostalCode])
        setLoaded(true)
            }
        }
    )
    .catch ( (e) => {
        alert(e)
    })
    },[loaded])

    return (
        <MainContainer className="container" 
        >
        <div className="heading text-center">Pick your Mangoes</div>
        { ((pageHome || !pageHome) && loaded) && 
        <div className="d-flex justify-content-center">
            {productsState[0].NAME !== "INIT" &&
                <div className="message-left">
                        <div className="text-center mt-1">
                            <FontAwesomeIcon icon={faTruck} className="truck"/>
                        </div>
                        <div className="deliveryMess-head text-center mt-2"> Next Delivery</div>
                        <div className="deliveryMess text-center mt-4 text-warning"> {delDate}</div>
                        <div className="mt-4 text-center"> 
                            <div className="whatsapptext text-success"> <fasIcons.FaWhatsapp className="whatsapp" /> WhatsApp </div>
                            <div className="whatsapptext text-white" > {whatsappNo} </div> 
                        </div>
                        <div className="deliveryMess-head text-center mt-4 mb-2"> Self-Collection Points</div>
                            <div className="d-flex justify-content-center">         
                        <div>
                            {areaNames.map ((item,i) =>
                                <div className="d-flex row text-white my-1" key={i}>
                                    <span className="locList">{item}</span>
                                </div>
                            )
                            }
                        </div>
                    </div>


                </div>
            }

            <div className="d-flex justify-content-center mt-2">
                <div className="d-flex align-items-center justify-content-center flex-wrap">
                    {productsState.length > 0 &&
                     productsState
                    //  .filter(a => ["Chandura","Banginapalli","Neelam","Mallika","Alphonso","AlphansoJumbo","Kesar","INIT","Mixed","ImamPasand","Kalepadu"].includes(a.NAME))
                     .map((item,i) => 
                        <div className="d-flex justify-content-center" key={i}>
                         {item.NAME === "INIT" ? 
                         <AllSpinners />
                         :
                         
                        <div className="d-flex flex-column text-center">
                            {item.ACTIVE === 'Y' &&
                            <ProdContainer className="d-flex flex-column bg-white mt-0">
                                {item.INSTOCK === "Y" ?
                                    <div className="price"> 
                                        <span className="priceValue" style={{color:"var(--bsRed)",textDecorationColor:"var(--amzonChime)",textDecoration:item.OFFERPRICE ? "line-through":"none"}}>{currencySymb}{item.PRICE}</span> 
                                        <div className="priceValue"> {currencySymb}{item.OFFERPRICE}</div>
                                    </div> 
                                    :
                                    <div className="price text-muted"> {currencySymb}{item.OFFERPRICE}</div> 
                                }
                                <div className="d-flex">
                                    <div className="d-flex card-image m-auto">
                                        <GetImage props={item.NAME}/> 
                                    </div>
                                {/* Prod Name */}
                                    <div className="mainProdName">{item.NAME}
                                    <p className="prodWeight">({item.UNITS})</p>
                                    </div>
                                <div className="d-flex flex-column justify-content-center border-left m-auto">
                                        {productNames[item.NAME].sort(() => (Math.random() > .5) ? 1 : -1).map((item,i) => 
                                        <div key={i} className={`prod-name-list ml-3 text-${productColors[i]}`}>{item}</div>
                                        )
                                        }
                                </div>

                                </div>
                                    <div className="mt-1">
                                    {item.INSTOCK === "Y" ?
                                        <div className="CartAddtions">
                                            <button className="btn text-success" onClick={() => productAction({type:"ADD",prodid:item.ID})}>+</button>
                                            <button className="btn text-danger"onClick={() => productAction({type:"REMOVE",prodid:item.ID})}>-</button>
                                        </div>
                                        :
                                        <div className="CartAddtions">
                                            <p className="text-danger">Out Of Stock</p>
                                        </div>
                                    }
                                        {isProductExistsInCart(item.ID).length > 0 &&
                                            <div className="cartValues" style={{backgroundColor:"var(--bsRed)",color:"white"}}>{productCountReducer(item.ID)}</div> }
                                            <div className="innerBasket">
                                                <div className="innerBasket1" style={{color:"var(--amazonChime)"}} >
                                                    <RiShoppingBasketLine className="basketSize" style={{transform: isProductExistsInCart(item.ID).length > 0 ? "rotate(0deg) scaleX(1)":null}}/>
                                                </div>
                                            </div>
                                    </div>
                            </ProdContainer>
                            }
                        </div>
                    }
                    </div>
                    )
                    }
            </div>
            </div>
            {productsState[0].NAME !== "INIT" &&
                <div className="message-right">
                    <div className="text-center">
                        <RiInformationLine className="about text-warning"/> 
                    </div>
                <div className="deliveryMess text-center mt-2 text-warning"> Why Chittoor Mangoes?</div>
                    <div className="mt-4 ml-2 ">
                            <li className="deliveryMess fw-bold">HWT (Hot Water Treated) </li>
                            <li className="deliveryMess fw-bold">Natural Sweet </li>
                            <li className="deliveryMess fw-bold"> Aroma</li>
                            <li className="deliveryMess fw-bold">Lowest price in SG</li>
                            <li className="deliveryMess fw-bold">Harvested from own farms</li>
                            <li className="deliveryMess fw-bold"> Premium quality Mangoes</li>
                    </div>
                </div>
            }
        </div>
        }
        </MainContainer>
    )
}
const MainContainer = styled.div` 
width: 100%;
height:100%;
padding-right: 15px;
padding-left: 15px;
margin-right: auto;
margin-left: auto;
margin-top:7rem;
margin-bottom:7rem;
.priceCartDetails{
    background:whitesmoke;
}
.price{
    position:absolute;
    right:2rem;
    top:0.5rem;
    color:var(--bsRed);
}
.prodWeight{
    font-size:0.6rem;
    color:var(--amzonChime);
}
.heading{
    font-size:3rem;
    font-family: 'Brush Script MT', cursive;
    color:white;
}
.mainProdName {
    position:absolute;
    top:5%;
    left:10%;
    color:var(--bsRed);
}
.prodName{
    font-weight:bold;
    font-style:italic;
    color:white;
    font-family: 'Open Sans', sans-serif;
    font-size:1rem;
    text-align:center;
}
.message-left{
    width:32rem;
    margin-left:0.5rem;
    background:white;
    background:-webkit-linear-gradient(top,white -100%,var(--amzonChime) 100%);
    height:20rem;
    border-radius:5px;
    color:var(--amzonChime);
    font-size:1.2rem;
}
.message-right{
    width:32rem;
    margin-left:0.5rem;
    margin-right:0.5rem;
    background:white;
    background:-webkit-linear-gradient(top,white -100%,var(--amzonChime) 100%);
    height:20rem;
    border-radius:5px;
    color:var(--amzonChime);
    font-size:1.2rem;
}
.deliveryMess-head {
    text-decoration:underline;
    font-size:0.9rem;
    color:white;
    font-weight:bold;
    margin-top:1rem;
    text-align:center;
    list-style-type: none;
}
.deliveryMess{
    font-size:0.9rem;
    color:white;
    font-weight:bold;
    margin-top:1rem;
    text-align:center;
    list-style-type: none;
}
.truck{
    font-size:3rem;
    color:var(--bsYellow);
    margin: 2rem 1rem;
}
.about {
    font-size:2.5rem;
    margin-top:1rem;
}
.whatsapp{
    color:var(--bsGreen);
    font-size:1.2rem;
}
.whatsapptext{
    font-size:0.8rem;
}

.locList{
    font-size:0.75rem;
}
// removing Container for small screens
@media (max-width: 798px) {
    padding:0;
    margin-top:6rem;
    .heading{
        font-size:2rem;
    }
    .mainProdName {
        font-size:0.7rem;
        left:7%;
    }
    .prodName{
        font-size:0.9rem;
    }
    .message-left, .message-right{
        margin:0;
    }
    .truck{
        font-size:1.5rem;
        margin: 1rem 0.5rem;
    }
    .deliveryMess-head{
        font-size:0.5rem;
        color:white;
        font-weight:bold;
    }
    .deliveryMess{
        font-size:0.5rem;
        color:white;
        font-weight:bold;
    }
    .whatsapptext{
        font-size:0.6rem;
    }
    .about {
        font-size:1.5rem;
        margin-top:1rem;
    }
    .locList{
        font-size:0.5rem;
    }
}
`
const ProdContainer = styled.div`
font-weight:bold;
border-radius:3rem;
display:flex;
position:relative;
justify-content:center;
overflow:hidden;
width:20rem;
height:20rem;
border:0.5px solid;
margin: 1rem 0.4rem;
.card-image {
    text-align:left;
    margin-left:1rem;
}
.prod-image{
    height: 10rem;
    width: 8rem;
}
.prod-name-list {
    font-size:1rem;
}
.innerBasket{
    position:absolute;
    bottom:1%;
    right:5%;
    font-size:3.2rem;
}
.basketSize{
    font-size:3rem;
    transition:all 0.5s;
    transform:rotate(180deg) scaleX(-1);
}
.cartValues {
    position:absolute;
    right:6%;
    bottom:15%;
    width:1.4rem;
    height:1.4rem;
    border-radius:50%;
    background:#5bccf6 ;
    color:white; 
    font-size:0.9rem;
    font-weight:bold;
    text-align:center;
    z-index:9;
}
.CartAddtions{
    position:absolute;
    bottom:1%;
    left:10%;
}
.btn{
    border-radius:1rem;
    font-size:1.8rem;
    width:3rem;
    font-weight:bold;
    margin:0 1rem 0 0;
    padding:0.25rem;
    :focus{
        box-shadow: none;
    }
}
.about{
    position:absolute;
    top:6%;
    right:5%;
    font-size:2rem;
    color:var(--amzonChime);
}
transition:0.7s all;
:hover{
    padding-bottom:0.25rem;
}
@media (max-width: 798px ) {
    width:12rem;
    height:12rem;
    border-radius:2rem;
    .priceValue{
        font-size:0.65rem;
    }
    .prod-image{
        height: 5rem;
        width: 4rem;
    }
    .prod-name-list {
        font-size:0.7rem;
    }
    .basketSize{
        font-size:2rem;
    }
    .CartAddtions{
        bottom:0;
        left:8%;
        font-size:2rem;
    }
    .innerBasket{
        bottom:0;
        right:5%;
        font-size:2.3rem;
    }
    .cartValues{
        bottom:12%;
        right:5%;
        width:1.1rem;
        height:1.1rem;
        font-size:0.7rem;
   }
  .btn{
    border-radius:1rem;
    font-size:1.5rem;
    width:2.5rem;
    font-weight:bold;
    margin:0 0 0.1rem 0;
   }
`
import React,{createContext,useReducer,useEffect,useState} from 'react'
import { GetApiData } from '../components/ApiCalls';
import { ToastContainer,toast } from 'react-toastify';


let products = []
let inItDelivery = {shipMode:"",address:"",location:""}

export const productContext = createContext();

const CartReducerFun = (state,action) => {
    var tempState     = [...state];
    var {type,prodid} = action;
    var idx           = tempState.findIndex( a => a.ID === prodid);
    switch (type) {
        case "INIT" :
            tempState = [...action.state];
            tempState = tempState.map( a => ({...a,QTY:0,inCart:false}))
            products = [...tempState];
            return [...tempState];
        case "GET_LATEST" :
            tempState = [...action.state];
            const existingStateValues = state.map(a => ({NAME:a.NAME,QTY:a.QTY,inCart:a.inCart}));
            tempState.forEach  ( a => {
                const idx = existingStateValues.findIndex( b => a.NAME === b.NAME);
                const {QTY,inCart} = existingStateValues[idx];
                tempState[idx] = {...tempState[idx],QTY:QTY,inCart:inCart}
            })
            return [...tempState];
        case "ADD" :
            if ( tempState[idx].QTY > 9 ) {
                toast.error("Max limit per product is 10")
            }
            else
            {
            tempState[idx] = {...tempState[idx],QTY:parseInt(tempState[idx].QTY ? tempState[idx].QTY : 0,10)+1,INCART:"Y"};
            }
            // toast.success("Item has been added to Cart")
            return [...tempState];
        case "REMOVE":
                var QTYVar =  parseInt(tempState[idx].QTY,10)
                if ( QTYVar > 0 )
                {
                QTYVar = parseInt(tempState[idx].QTY,10)-1;
                tempState[idx] = {...tempState[idx],QTY:QTYVar,INCART: QTYVar > 0 ? "Y":"N"};
                // toast.warning("Item removed from Cart")
                return [...tempState];
                }
                else if (QTYVar === 0) {
                    toast.warning(`This item is not in the Cart`)
                    return state;
                }
                break;
        case "DELETE":  
                tempState[idx] = {...tempState[idx],QTY:0,INCART:"N"};
                return [...tempState];
        case "BLANK_PAYEMENT_MODE":  
        toast.error("Choose Payment mode");
        return [...tempState];
        case "CLEAR":
            // toast.success("Cart has been cleared")
            return [...products];
        default :
            return state;
    }
} 

const deliveryReducer = (state,action) => {
    var tempState     = [...state];
    var {shipMode,location,address,del_locations,del_date} = action;

    if (action.type === "SHIPMENT_MODE") {
    tempState[0].shipMode = shipMode;
    }
    else if (action.type === "INIT") {
        tempState[0].locations = del_locations.locations;
        tempState[0].del_date = del_date;
    }
    else if (action.type === "ADDRESS") {
        tempState[0].location = location;
        tempState[0].address = address;
    }
    else if ( action.type === "CLEAR") {
        return [inItDelivery]
    }
    // console.log(tempState)
    return [...tempState]
   
} 

const configReducer = (state,action) => {
        const tempState = [...state]

        if (action.type === 'INIT') {

            tempState[0].state = 'VAL';
            tempState[0].val   = action.state;
        }
        return [...tempState]
} 

const orderStatusReducer = (state,action) => {
    return true;

}

// const delCharges = ({productCountAll,shipMode,location}) => {
    
// }

export function ProductsProvider(props) {
// const [accountInfo] = useContext(accountsContext);
const [configState,configAction] = useReducer(configReducer,[{state:"INIT"}]);
const [orderStatus,orderStatusAction] = useReducer(orderStatusReducer,[{}]);
const [productsState,productAction] = useReducer(CartReducerFun,[{ID:1,NAME:"INIT",PRICE:"34",OFFERPRICE:32,UNITS:"5Kg",INSTOCK:"Y",INCART:false,QTY:0}]);
const [deliveryState,deliveryAction] = useReducer(deliveryReducer,[inItDelivery]);
const cartReducer = 1;
const productCountReducer = (props) => productsState.filter(a => a.ID === props && a.QTY > 0).reduce((prev,curr) => prev + curr.QTY,0);
const productCountAll = productsState.reduce((prev,curr) => prev + curr.QTY,0);
const [orderCreated,setOrderCreated] = useState(false);
const [pageHome,setPageHome]  = useState();
const deliveryCharges = (productCountAll < 5 && deliveryState[0].shipMode === "delivery" && deliveryState[0].location ? parseInt(JSON.parse(configState[0].val.filter( a => a.NAME === "DEL_LOCATIONS")[0].JSON_STRING).value.filter(a => a.name === deliveryState[0].location)[0].delCharge,10) : 0);
const currency = configState[0].val ? JSON.parse(configState[0].val.filter( a => a.NAME === "CURRENCY")[0].JSON_STRING).value : "";

useEffect( () => {
    GetApiData("select a.NAME,a.ID,UNITS,PRICE,OFFERPRICE,CASE WHEN INSTOCK='Y' and STOCK - ORDERED <= 1 THEN 'N' ELSE  INSTOCK END INSTOCK,ACTIVE from products a left outer join stock b on (a.NAME=b.name) order by INSTOCK desc,stock desc")
    .then((res) => {
        // console.log(res)
        if (res[0] === "ERROR"){
            alert("Error while getting Products details");    
        }
        else if ( res.length === 0 )  {
        alert("No Data found");
        }
        else if ( res.length > 0 ) {
            // if ( productsState[0].NAME === "INIT") {
                productAction({type:"INIT",state:res})
            // }
            // else{
            // productAction({type:"GET_LATEST",state:res});
            // }

            }
        }
    )
    .catch ( (e) => {
        alert(e)
    })
    },[])

    useEffect( () => {
        GetApiData("select * from react_config")
        .then((res) => {
            // console.log((res));
            // console.log(res)
            if (res[0] === "ERROR"){
                alert("Error while getting data from DB");    
            }
            else if ( res.length === 0 )  {
            alert("No Data found");
            }
            else if ( res.length > 0 ) {
                // if ( productsState[0].NAME === "INIT") {
                    configAction({type:"INIT",state:res})
                // }
                // else{
                // productAction({type:"GET_LATEST",state:res});
                // }
                }
            }
        )
        .catch ( (e) => {
            alert(e)
        })
        },[])

    return (
        <>
        <ToastContainer position="top-center" autoClose="1000"/>
        {/* {configState[0].state !== "INIT" &&  */}
        <productContext.Provider value={[productsState,productAction,cartReducer,productCountReducer,productCountAll,deliveryState,deliveryAction,orderCreated,setOrderCreated,pageHome,setPageHome,deliveryCharges,configState,currency,orderStatus,orderStatusAction]}>
            {props.children}
        </productContext.Provider>
        </>
    )
}

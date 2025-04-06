//import logo from './logo.svg';
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import ProductList from "./components/ProductList";
import { ProductsProvider } from "./contexts/mangoesContext";
import { AccountsProvider } from "./contexts/accountsContext";
import Cart from "./components/Cart.jsx";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import NotFound from "./components/NotFound";
import OrderConfirmation from "./components/OrderConfirmation";
import ProductInfo from "./components/ProductInfo";
import { Orders, OrderDetails, Products, AllOrders } from "./components/Orders";
import Checkout from "./components/Checkout";
import AddComments from "./components/AddComments";
import AddstockComments from "./components/AddstockComments";
import Payment from "./components/Payment";
import Admin from "./components/Admin.js";
import AddProducts from "./components/AddProducts";
import UpdateProduct from "./components/UpdateProduct";
import ContactUs from "./components/ContactUs";
import Shipments from "./components/Shipments";
import Transactions from "./components/Transactions";
import TransactionDetails from "./components/TransactionDetails";
import { FormProvider } from './contexts/formContext';
// import IdleTimeCotainer from './components/IdleTimeCotainer'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <IdleTimeCotainer> */}
        <FormProvider>
          <AccountsProvider>
          <ProductsProvider>
            <Nav />
            <Routes>
              <Route
                exact
                path="/aboutProduct/:name"
                element={<ProductInfo />}
              />
              <Route exact path="/cart" element={<Cart />} />
              <Route
                exact
                path="/orderconfirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/allorders" element={<AllOrders />} />
              <Route path="/orderdetails/:id" element={<OrderDetails />} />
              <Route path="/addcomments/:id" element={<AddComments />} />
              <Route path="/stock/:id" element={<AddstockComments />} />
              <Route path="/products" element={<Products />} />
              <Route exact path="/products" element={<ProductList />} />
              <Route exact path="/account" element={<Login />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route exact path="/signin" element={<Login />} />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route exact path="/payment" element={<Payment />} />
              <Route exact path="/admin" element={<Admin />} />
              <Route exact path="/addProduct" element={<AddProducts />} />
              <Route exact path="/updateProduct" element={<UpdateProduct />} />
              <Route exact path="/contactus" element={<ContactUs />} />
              <Route exact path="/shipments" element={<Shipments />} />
              <Route exact path="/transactions" element={<Transactions />} />
              <Route exact path="/transactionDetails" element={<TransactionDetails />} />
              <Route exact path="/" element={<ProductList />} />
              <Route element={<NotFound />} />
            </Routes>
          </ProductsProvider>
        </AccountsProvider>
      </FormProvider>
        {/* </IdleTimeCotainer> */}
      </div>
    </BrowserRouter>
  );
}

export default App;

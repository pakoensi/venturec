import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Banner from "./components/AppComponents/Banner";
import Products from "./components/AppComponents/Products";
import {
  makeStyles,
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core";
import Footer from "./components/AppComponents/Footer";
import TopBar from "./components/AppComponents/TopBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from "./screens/Admins/index";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const prod = [
  { id: 1, name: "bags", price: 23.4, media: { source: "hrhrhrhhrhrhr" } },
  { id: 2, name: "bags", price: 23.4, media: { source: "hrhrhrhhrhrhr" } },
  { id: 3, name: "socks", price: 24.4, media: { source: "hrhrhrhhrhrhr" } },
  {
    id: 4,
    name: "pictures",
    price: 43.4,
    media: { source: "hrhrhrhhrhrhr" },
  },
  { id: 5, name: "mugs", price: 3.4, media: { source: "hrhrhrhhrhrhr" } },
  { id: 5, name: "mugs", price: 3.4, media: { source: "hrhrhrhhrhrhr" } },
];

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(prod);
  }, []);

  const addProducts = () => {
    setProducts([]);
  };
  return (
    <>
      <Router>
        <CssBaseline>
          {/* <Banner /> */}
          <Route exact path="/">
            <TopBar />
            <Products products={products} addProduct={addProducts} />
            <Footer />
          </Route>
          <Route exact path="/Admin">
            <Admin />
          </Route>
        </CssBaseline>
        >
      </Router>
      >
    </>
  );
}

export default App;

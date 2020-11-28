import { Login, Register } from "./components/login/index";
import { Navbar } from "./components/navbar/index";
import "./App.scss";

import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Drivers } from "./components/drivers";
import { Footer } from "./components/footer/index";
import { Vehicles } from "./components/vehicles/index";



class App extends React.Component {
    constructor(props){
      super(props);
    }

    render() {
      return <>
        <Switch>
        	<Route exact path="/">
            	<Login />
          	</Route>
          	<Route exact path="/register">
            	<Register />
          	</Route>
			<Route path={["/user", "/admin"]}>
				<Navbar />
				<Route path = "/admin/home">
					<>AADMIN</>
				</Route>
				<Route path = "/user/home">
					<></>
				</Route>
				<Route path = "/user/drivers">
					<Drivers />
				</Route>
				<Route path ="/user/devices">
					Urządzenia
				</Route>
				<Route path ="/user/vehicles">
					<Vehicles />
				</Route>
				<Footer />
			</Route>
        </Switch>
      </>
    }
}

export let rootUrl = "http://localhost:2999";
export default App;
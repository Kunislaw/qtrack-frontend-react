import { Login, Register } from "./components/login/index";
import { Navbar } from "./components/navbar/index";
import "./App.scss";

import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Drivers } from "./components/drivers";
import { Footer } from "./components/footer/index";
import { Vehicles } from "./components/vehicles/index";
import { Devices } from "./components/devices/index";
import { Clients } from "./components/clients/index";



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
			<Route path={["/user", "/admin/manage/:clientId"]}>
				<Navbar />
				<Route path = "/admin/manage/:clientId" component={Clients} />
				<Route path = "/user/home">
					<></>
				</Route>
				<Route path = "/user/drivers">
					<Drivers />
				</Route>
				<Route path ="/user/devices">
					<Devices />
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
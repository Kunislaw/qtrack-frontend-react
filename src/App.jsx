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
import { CheckAuth } from "./components/checkAuth/index";
import { Main } from "./components/main/index";



class App extends React.Component {
    constructor(props){
      super(props);
    }

    render() {
      return <>
        <Switch>
        	<Route exact path="/" component={Login} />
          	<Route exact path="/register" component={Register} />
			<Route path = "/user/home" component={CheckAuth} />
			<Route path = "/admin/home">
				<Navbar />
				<Clients />
				<Footer />
			</Route>
			<Route path={["/user/manage/:clientId", "/admin/manage/:clientId"]}>
				<Route path = {["/user/manage/:clientId", "/admin/manage/:clientId"]} component={Navbar} />				
				<Route path = {["/user/manage/:clientId/home", "/admin/manage/:clientId/home"]} component={Main} />
				<Route path = {["/user/manage/:clientId/drivers", "/admin/manage/:clientId/drivers"]} component={Drivers}/>
				<Route path = {["/user/manage/:clientId/vehicles", "/admin/manage/:clientId/vehicles"]} component={Vehicles}/>
				<Route path = {["/user/manage/:clientId/devices", "/admin/manage/:clientId/devices"]} component={Devices}/>
				<Footer />
			</Route>
        </Switch>
      </>
    }
}

export let rootUrl = "http://localhost:2999";
export default App;
import { Login, Register } from "./components/login/index";
import { Navbar } from "./components/navbar/index";
import "./App.scss";

import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";



class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        isLogginActive: true
      }
    }

    render() {
      return <>
	  		

      <BrowserRouter>
        <Switch>
        	<Route exact path="/">
            	<Login />
          	</Route>
          	<Route exact path="/register">
            	<Register />
          	</Route>
			<Route path={["/user", "/admin"]}>
				<Navbar />
			</Route>
			<Route path = "/user/home">
				<></>
			</Route>
			<Route path = "/admin/home">
				<></>
			</Route>
        </Switch>
      </BrowserRouter>
      </>
    }
}

export let rootUrl = "http://localhost:2999";
export default App;
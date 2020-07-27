import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import { AuthProvider } from "./utils/auth";
import PrivateRoute from "./PrivateRoute";
import Header from './Header'
import RoomPage from './RoomPage'
import ErrorPage from './ErrorPage'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header>
          <div>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/rooms/:roomName" component={RoomPage} />
              <Route component={ErrorPage} />
            </Switch>
          </div>
        </Header>
      </Router>
    </AuthProvider>
  );
};

export default App;
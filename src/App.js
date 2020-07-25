import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import { AuthProvider } from "./utils/auth";
import PrivateRoute from "./PrivateRoute";
import Header from './Header'
import RoomPage from './RoomPage'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header>
          <div>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/RoomPage" component={RoomPage} />
          </div>
        </Header>
      </Router>
    </AuthProvider>
  );
};

export default App;
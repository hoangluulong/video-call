import React from "react"
import Signup from "./LoginRegister/Signup"
import { AuthProvider } from "../contexts/AuthContext"
import '../App.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Dashboard from "./LoginRegister/Dashboard"
import Login from "./LoginRegister/Login"
import PrivateRoute from "./LoginRegister/PrivateRoute"
import ForgotPassword from "./LoginRegister/ForgotPassword"
import UpdateProfile from "./LoginRegister/UpdateProfile"
import HomePage from "./HomePage/HomePage";
import CallPage from "./CallPage/CallPage";
import NoMatch from "./NoMatch/NoMatch";
import Meet from "../Meet";

function App() {
  return  (
    
      <div>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/login/:id" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/:id"><Meet /></Route>
              <Route path="*">
          <NoMatch />
        </Route>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    
  )
}

export default App;

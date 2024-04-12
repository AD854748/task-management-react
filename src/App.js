import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import Home from './screens/home';
import About from './screens/about';
import Login from './screens/login';

function App() {

   


  return (
    <Router>
     <Switch>
        <Route exact path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;

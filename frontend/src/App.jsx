import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Navbar from './components/Navbar'
import Index from './pages/Index';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
 
export class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
        <Navbar />
          <Route exact path="/" component={Index}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/settings" component={Settings}/>
        </div>
      </Router>
    );
  }
}

export default App;

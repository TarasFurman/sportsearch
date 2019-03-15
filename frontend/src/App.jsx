import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Index from './pages/Index';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

import Signin from './pages/Signin';
import Signup from './pages/Signup';

import EventPage from './pages/EventPage'
import FeedbacksPage from './pages/FeedbacksPage'
 
export class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={Index}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/settings" component={Settings}/>
          <Route path="/signin" component={Signin}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/event/:eventId" component={EventPage}/>
          <Route path="/feedbacks/:userId" component={FeedbacksPage}/>
        </div>
      </Router>
    );
  }
}

export default App;

import React from 'react';
// import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/NavBar/Navbar';
import Main from './pages/Main';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AnotherUserProfile from './components/another-user-profile';

import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import CreateEvent from './pages/CreateEvent';

import EventsPage from './pages/EventsPage';

import EventPage from './pages/EventPage'
import FeedbacksPage from './pages/FeedbacksPage'

import SportSearchService from './service/sport-search-service';
import { SportSearchServiceProvider } from './components/sport-search-service-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const sportSearchService = new SportSearchService();

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: '',
        notifications: [],
      userId:'',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(user){
    this.setState({user:user})
    };

  componentWillMount(){
      fetch('http://localhost:5999/header',
          {
              headers:{
                  'Content-Type': 'application/json'
              },
              method: 'GET',
              mode: 'cors',
              credentials: 'include',
          }
          )
          .then(response => response.json())
          .then(response => {
              if (response['code'] === 200){
                  this.setState({user: response['message']})
              }
          }
          );

      fetch('http://localhost:5999/notification',
          {
              headers:{
                  'Content-Type': 'application/json'
              },
              method: 'GET',
              mode: 'cors',
              credentials: 'include',
          }
          )
          .then(response => response.json())
          .then(response => {
              if (response['code'] === 200){
                  this.setState({
                      notifications: response['notifications']
                  });
              }
          })
  }


  render() {
    return (
      <Provider store={store}>
        <SportSearchServiceProvider value={sportSearchService}>
          <Router>
            <div>
              <Navbar user={this.state.user}
                      notifications={this.state.notifications}
                      handleClick={this.handleClick}
              />
              <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/profile/" component={Profile} />
                <Route path="/settings" component={Settings}/>
                <Route path="/signin" render={() => <Signin handleClick={this.handleClick}/>} />
                <Route path="/signup" render={() => <Signup handleClick={this.handleClick}/>} />
                <Route path="/event/:eventId" component={EventPage}/>
                <Route path="/feedbacks/:userId" component={FeedbacksPage}/>
                <Route path="/createEvent" component={CreateEvent} />
                <Route path="/my-events" component={EventsPage} />
                <Route path="/another-user-profile/:anotherUserId" component={AnotherUserProfile}/>
                <Route component={Error} />
              </Switch>
            </div>
          </Router>
        </SportSearchServiceProvider>
      </Provider>
    );
  }
}

export default App;

import React from 'react';
import Navbar from './pages/NavBar/Navbar';
import Main from './pages/Main/Main';
import Settings from './pages/SettingsPage/Settings';
import Profile from './pages/ProfilePage/Profile';
import AnotherUserProfile from './pages/another-user-profile';
import Signin from './pages/SigninPage/SigninPage';
import Signup from './pages/SignupPage/SignupPage';
import CreateEvent from './pages/CreateEventPage/CreateEvent';
import EventsPage from './pages/EventsPage/EventsPage';
import EventPage from './pages/EventPage/EventPage';
import FeedbacksPage from './pages/FeedbacksPage/FeedbacksPage';
import SportSearchService from './service/sport-search-service';
import { SportSearchServiceProvider } from './pages/sport-search-service-context';
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

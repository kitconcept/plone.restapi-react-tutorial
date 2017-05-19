import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const API_URL = 'http://localhost:8080/Plone';
const API_HEADERS = {
  'Accept': 'application/json',
  'Authorization': 'Basic Zm9vYmFyOmZvb2Jhcgo='
};


class AppContainer extends Component {
  constructor(){
    super();
    this.state={
      page: {}
    };
  }

  componentDidMount(){
    fetch(API_URL + '/', {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({page: responseData});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render(){
    return (
      <App items={this.state.page.items} />
    );
  }
}


class ViewContainer extends Component {

  constructor(){
    super();
    this.state={
      page: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    fetch(API_URL + '/' + nextProps.match.params[0], {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({page: responseData});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render() {
    return (
      <View page={this.state.page} />
    )
  }
}

class View extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.page.title}</h1>
        <h3>{this.props.page.description}</h3>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>App</h2>
        </div>
        <Router>
          <div>
            <ul>
              {
                this.props.items && 
                this.props.items.map(
                  (key, item) => (
                    <li key={item}>
                      <Link to={`/${key['@id'].replace(/^.*\//, '')}`}>{key.title}</Link>
                    </li>
                  )
                )
              }
            </ul>

            <hr/>

            <Route path="/**" component={ViewContainer} />

          </div>
        </Router>
      </div>
    );
  }
}

export default AppContainer;
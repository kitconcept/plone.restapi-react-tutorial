plone.restapi-react-tutorial
============================

This is a minimal tutorial about how to get started with React and plone.restapi.

Prerequisits
------------

You need to have Node.js 6 and npm installed

https://nodejs.org

Install create-react-app globally:

  $ npm install create-react-app -g

Create new React app:

  $ create-react-app plone.restapi-react-tutorial

Build the React app:

  $ cd plone.restapi-react-tutorial/
  $ yarn install

Start the react app:

  $ yarn start

Run test with Jest:

  $ yarn test

App.js:

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
      fetch(API_URL + '/front-page', {headers: API_HEADERS})
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
        <App page={this.state.page} />
      );
    }
  }

src/index.js:

  import App->AppContainer from './App';
  <App /> -> <AppContainer />

App.test.js:

  import React from 'react';
  import ReactDOM from 'react-dom';
  import AppContainer from './App';

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AppContainer />, div);
  });

Visual Studio Code Configuration
--------------------------------

Install and download Visual Studio Code 

https://marketplace.visualstudio.com/items?itemName=joshpeng.sublime-babel-vscode


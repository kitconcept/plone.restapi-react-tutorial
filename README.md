plone.restapi-react-tutorial
============================

This is a minimal tutorial about how to get started with React and plone.restapi.

Prerequisits
------------

Before we can start, you need Node.js 6 and the Node package manager (npm) installed. Please check https://nodejs.org for install instructions.
To ease development with multiple Node versions, we recommend to use nvm.

We will also use the yarn package manager from Facebook which provides you with repeatable and stable builds, amongst other features. To install yarn globally run:

  $ npm install yarn -g

You also need a Plone instance with plone.restapi installed. Here is a minimal buildout configuration:

  [buildout]
  extends = http://dist.plone.org/release/5.0.7/versions.cfg
  parts = instance
          plonesite

  [instance]
  recipe = plone.recipe.zope2instance
  user = admin:admin
  http-address = 8080
  eggs =
      Plone
      plone.restapi

  zcml-additional =
    <configure xmlns="http://namespaces.zope.org/zope"
              xmlns:plone="http://namespaces.plone.org/plone">
    <plone:CORSPolicy
      allow_origin="http://localhost:4300,http://127.0.0.1:4300,http://localhost:3000,http://127.0.0.1:3000"
      allow_methods="DELETE,GET,OPTIONS,PATCH,POST,PUT"
      allow_credentials="true"
      expose_headers="Content-Length,X-My-Header"
      allow_headers="Accept,Authorization,Content-Type,X-Custom-Header"
      max_age="3600"
      />
    </configure>

  [plonesite]
  recipe = collective.recipe.plonesite
  site-id = Plone
  instance = instance
  profiles-initial = Products.CMFPlone:dependencies
  profiles =
      plonetheme.barceloneta:default
      plone.app.contenttypes:plone-content
      plone.restapi:default
  upgrade-portal = False
  upgrade-all-profiles = False
  site-replace = True

Note the zcml-additional configuration that defines a CORS policy that allows the React application that we are going to write to connection to our Plone backend.

For convenience, we also added a plonesite section that automatically creates a Plone instance during the buildout run.


Create React App
----------------

To create our first React project, we have to install the [Create React App](https://github.com/facebookincubator/create-react-app):

  $ yarn install create-react-app -g

We install create-react-app globally (by using the '-g' paramater of 'npm install') to make the 'create-react-app' command available on our command line.
We create a new React application with the name 'plone.restapi-react-tutorial':

  $ create-react-app plone.restapi-react-tutorial

This will create a new folder with the name of the app that we cd into:

  $ cd plone.restapi-react-tutorial/

Then we can build the React application by running:

  $ yarn install

The install command build the basic scaffolding for your react app. We won't go too much into detail and just briefly cover the main App.js file that you find in your src folder:

  import React, { Component } from 'react';
  import logo from './logo.svg';
  import './App.css';

  class App extends Component {
    render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      );
    }
  }

  export default App;

This is a very simple React component. The 'render' method is just basic HTML. Variables can be injected into the HTML by using curly braces '{}'. The logo that we import with:

  import logo from './logo.svg';

is injected into the 'src' attribute of the image tag:

  <img src={logo} className="App-logo" alt="logo" />

To start your application run:

  $ yarn start

Your browser will automatically open the react app on 'localhost:3000'. 
The app will automatically watch the files in the '/src' folder of your app and reload the application in your browser immediately.
Try, for instance, to change the headline in 'src/App.js' from:

  <h2>Welcome to React</h2>

to:

  <h2>Welcome to Plone</h2>

This works for HTML, JavaScript and any style changes in your app.

create-react-app also comes with a Jest-based test setup and an example test that you can run with:

  $ yarn test


Connecting to plone.restapi
---------------------------

With the basic application structure in place, we can now start to connect to plone.restapi. 


  constructor(){
    super();
    this.state={
      page: {}
    };
  }

First we create constants for the base API URL and the API headers that we need to send with each request to the Plone server to 

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


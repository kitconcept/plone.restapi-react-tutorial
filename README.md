plone.restapi-react-tutorial
============================

This tutorial explains how to build a React-based JavaScript front-end application that queries a Plone REST API back-end to display the front-page of the Plone site.

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
We are going to make a single call to the Plone backend to retrieve the front-page of our Plone site and display it within our React app.

One of the core principles of React is a uni-directional data flow of component state. We define a constructor method, that sets the state of our

  constructor(){
    super();
    this.state={
      page: {}
    };
  }

When our component has been instantiated properly, we want retrieve the Plone front-page via plone.restapi. A React component provides certain lifecycle events that can be used to do the back-end call.

Please note that this very basic example violates the single responsibility pattern that is considered best practice in the React community. A React component should only be responsible for one thing. Therefore in a real-world application, we would move the API call to a 'container component' that does the actual API call and use component props to pass it to the component that actually displays the content.

We use the componentDidMount lifecycle event that is fired after the succesful instantiation of the React component. We use the ES6 fetch API to do the call to the backend. 

Note that React does not make any assumptions about what libraries you use to query the backend. You could as well use RxJs or any other library to do the call.

  componentDidMount(){
    fetch(
      'http://localhost:8080/Plone/front-page', 
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({page: responseData});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

The URL that we query for the backend call is similar to the URL you would use in a browser to retrieve the front-page in your browser. plone.restapi uses content negotiation to tell Plone that it actually would like to get a JSON response. This is done by sending the HTTP header 'Accept' with the value 'application/json'.

Check your browser console and the network tab of your developer tools to make sure the API call was actually successful.
With the successful API call in place we can now use the data that has been successfully stored in our component state variable.
State variables that we defined in our constructor method and that has been filled with actual data in our componentsDidMount method can be accessed in the component render method now.

Replace the Hello React headline with the title of the Plone front page:

<h2>{this.state.page.title}</h2>

We can also show the description and the body text of the front-page.
  class AppContainer extends Component {

    ...

    render(){
      return (

        ...

        {
          this.state.page.description &&
          <h3>{this.state.page.description}</h3>
        }
        {
          this.state.page.text &&
          <p dangerouslySetInnerHTML={{ __html: this.state.page.text.data }} />
        }
      );
    }
  }

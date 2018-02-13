import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      description: this.props.description
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name);
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:8080/Plone/front-page', {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic Zm9vYmFyOmZvb2Jhcgo=',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: this.state.title,
            description: this.state.description
          })
        }
      )
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.log('Error patching data', error);
      });
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <h3>Post data to Plone</h3>
        <label>
          Page title:
          <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Page description:
          <textarea value={this.state.description} onChange={this.handleInputChange} name="description" />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      page: {}
    };
  }

  componentDidMount() {
    fetch(
        'http://localhost:8080/Plone/front-page', {
          headers: {
            'Accept': 'application/json',      
          }
        }
      )
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          page: responseData
        });
        console.log('Fetch from plone.restapi successful!')
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      });
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.page.title}</h2>
        </header>
        <p className="App-intro">
          {
            this.state.page.description &&
            <h3>{this.state.page.description}</h3>
          }
          {
            this.state.page.text &&
            <p dangerouslySetInnerHTML={{ __html: this.state.page.text.data }} />
          }
        </p>
        {
          this.state.page.title && this.state.page.description &&
          <Form title={this.state.page.title} description={this.state.page.description}/>
        }        
      </div>
    );
  }
}

export default App;

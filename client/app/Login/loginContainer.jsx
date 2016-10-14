import React, { PropTypes } from 'react';
import LoginPresentational from './loginPresentational.jsx';


class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: 'please enter username and password', 
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    // this.username.value = '';
    // this.password.value = '';
    fetch('http://localhost:8888/login2', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((data) => {
      console.log('login success stage 0');
      if(data.status === 404) {
        this.setState({message: 'Incorrect username or password'});
      } else { 
        console.log('login success stage 1');
        fetch('http://localhost:3030/stash?' + 'name=' + password + '&id=' + username)
        .then((data) => {
          console.log('login success stage 2');
          if(data.status === 200) {
            console.log('login success stage 3');
            this.context.router.push('/home');
          }
        })
      }
    })
    .catch((err) => {
      this.setState('handleSubmit error in electron login', err);
    })

    document.getElementById('loginform').reset();
  }

  getRefUsername(e) {
    this.setState({username: e.target.value});

  }

  getRefPassword(e) {
    this.setState({password: e.target.value});
  }

  render() {
    return (
    <LoginPresentational message={this.state.message} getRefUsername={this.getRefUsername.bind(this)} getRefPassword={this.getRefPassword.bind(this)} handleSubmit={this.handleSubmit.bind(this)}/>
    );
  }
}

LoginContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default LoginContainer;
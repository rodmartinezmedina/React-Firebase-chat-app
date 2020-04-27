import React from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './styles';
const firebase = require("firebase");

class LoginComponent extends React.Component {

constructor() {
  super();
  this.state = {
    email: null,
    password: null,
    loginErr: ''
  };
}


  render () {

    const { classes } = this.props

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Log In!
          </Typography>
          <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-email-input'>Enter your Email</InputLabel>
              <Input autoComplete='email' autoFocus 
                id='login-email-input' onChange={(e) => this.userTyping('email', e)}>
              </Input>
            </FormControl>

            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-password-input'>Enter your password</InputLabel>
              <Input type='password' id='login-password-input' onChange={(e) => this.userTyping('password', e)}>
              </Input>
            </FormControl>
            <Button type='submit' className={classes.submit} fullWidth variant='contained' color='primary'>Log In</Button>
          </form>
          {
            this.state.loginErr ?
              <Typography className={classes.errorText} component='h5' variant='h6'>
                Incorrect Login Information
              </Typography> : 
              null
          }
          <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't have an account?</Typography>
          <Link className={classes.signupLink} to='./signup'>Sign up!</Link>
        </Paper>
      </main>    
    );
  }

  userTyping = (type, e) => {
    console.log(type, e);
    switch (type) {
      case 'email':
        this.setState({ email: e.target.value });
        break;

      case 'password': 
      this.setState({ password: e.target.value });
      break;

      default:
        break;
    }
  }

  submitLogin = async (e) => {
    e.preventDefault();
    // console.log('SUBMITTING');
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/dashboard');

      }, err => {
        this.setState({ loginErr: 'Server Error' })
        console.log(err)
      })

  }



}

export default withStyles(styles)(LoginComponent);
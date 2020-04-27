import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';


class ChatTextBoxComponent extends React.Component {

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>

        <TextField placeholder="Type your message..."
          onKeyUp={(e) => this.userTyping(e)}
          id='chatterbox'
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}

          ></TextField>
      </div>
    )
  }
  
  
  userTyping = (e) => {
    console.log('user typing')
  }
  
  userClickedInput = () => {
    console.log('user clicked input')
  }


}


export default withStyles(styles)(ChatTextBoxComponent);
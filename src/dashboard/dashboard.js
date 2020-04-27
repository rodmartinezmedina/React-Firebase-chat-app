import React from 'react';
import ChatListComponent from '../chatList/chatList';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatViewComponent from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
const firebase = require('firebase')


class DashboardComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: []
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if(!_usr)
        this.props.history.push('/login');
      else {
        await firebase
          .firestore()
          .collection('chat')
          .where('users', 'array-contains', _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats
            })
            console.log(this.state)
          })
      }
    })
  }


  render() {
    const { classes } = this.props;
    
    return(
      <div>
        {/* We are not using React Router in this component. 
        So we dont have acces to 'history'. We pass them as props from other components */}
        <ChatListComponent history={this.props.history}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}></ChatListComponent>
          {
            this.state.newChatFormVisible ? 
            null : 
            <ChatViewComponent
              user={this.state.email}
              chat={this.state.chats[this.state.selectedChat]}>
            </ChatViewComponent>            
          }
          {
            this.state.selectedChat !== null && !this.state.newChatFormVisible ?
          <ChatTextBoxComponent></ChatTextBoxComponent> :
          null
          }
          
          <Button className={classes.signOutBtn} onClick={this.signOut}>Signout</Button>
      </div>
    );
  }


  signOut = () => firebase.auth().signOut();
  

  selectChat = (chatIndex) => {
    console.log('index:', chatIndex);
    this.setState({ selectedChat: chatIndex })
  }

  newChatBtnClicked = () => {
    // console.log('New chat button clicked');
    this.setState({ newChatFormVisible: true, selectedChat: null })
  }




}

export default withStyles(styles)(DashboardComponent);
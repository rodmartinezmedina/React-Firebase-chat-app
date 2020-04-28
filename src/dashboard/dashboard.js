import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';

// import NewChatComponent from '../NewChat/newChat';
import ChatViewComponent from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
import ChatListComponent from '../chatList/chatList';
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


  signOut = () => firebase.auth().signOut();
  
  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  }


  // Chat index could be different than the one we are currently on in the case
  // that we are calling this function from within a loop such as the chatList.
  // So we will set a default value and can overwrite it when necessary.
  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(this.state.chats[chatIndex].users.filter(_usr => _usr !== this.state.email)[0]);
    if(this.clickedMessageWhereNotSender(chatIndex)) {
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log('Clicked message where the user was the sender');
    }
  }

  clickedMessageWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;


  newChatBtnClicked = () => {
    // console.log('New chat button clicked');
    this.setState({ newChatFormVisible: true, selectedChat: null })
  }


  buildDocKey = (friend) => {
    console.log('USER CLICKED SEND BTN. Building the firebase document key for this specific chat');
    return [this.state.email, friend].sort().join(':')
  };  

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
      .users
      .filter(_usr => _usr !== this.state.email)[0]
    )
    console.log(docKey)
    
      firebase
      .firestore()
      .collection('chat')
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now()
        }),
        receiverHasRead: false
      });
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
          selectedChatIndex={this.state.selectedChat}>
        </ChatListComponent>
        
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
          <ChatTextBoxComponent messageReadFn={this.messageRead}  submitMessageFn={this.submitMessage}></ChatTextBoxComponent> :
          null
          }
          
          <Button className={classes.signOutBtn} onClick={this.signOut}>Signout</Button>
      </div>
    );
  }


}


export default withStyles(styles)(DashboardComponent);
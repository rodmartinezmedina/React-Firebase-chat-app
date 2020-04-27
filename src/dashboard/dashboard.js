import React from 'react';
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



  render() {
    return(
      <div>
        <h1>User's chats</h1>
        {/* We are not using React Router in this component. 
        So we dont have acces to 'history'. We pass them as props from other components */}
        <ChatListComponent history={this.props.history}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}></ChatListComponent>
      </div>
    );
  }

  selectChat = (chatIndex) => {
    console.log('Selected a chat', chatIndex);
  }

  newChatBtnClicked = () => {
    // console.log('New chat button clicked');
    this.setState({ newChatFormVisible: true, selectedChat: null })
  }




}

export default DashboardComponent;
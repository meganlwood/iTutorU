import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from '../actions/index';
import {addMessage} from "../FirebaseManager";

class Messaging extends Component {


    state = {
        messages: [],
        currentUserUID: '',
        otherPersonUID: '',
        otherPersonName: '',
        convoKey: '',

    };

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.otherPersonName}`,
        // headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        // headerStyle:{
        //     backgroundColor:'white',
        // },
    });

    //params: convoKey, otherPersonName, uid



    componentWillMount() {
        console.log("mounting messagingin component");
        console.log(this.props.navigation.state.params);


        const { convoKey, uid, otherPersonUID, otherPersonName } = this.props.navigation.state.params;
        this.setState({ convoKey, currentUserUID: uid, otherPersonUID, otherPersonName }, function() {
            if (this.props.messages[convoKey] === undefined) {
                this.props.loadMessages(convoKey);
            }
            else {
                console.log("calling addmessages");
                this.addMessages(this.props.messages[convoKey]);
            }
        });
        console.log("mounting messages with: ");
        console.log(convoKey);
        console.log(uid);
        console.log(otherPersonUID);
        console.log(this.state);

        console.log(this.props.messages);
        console.log(convoKey);
        console.log(this.props.messages[convoKey]);


    }

    addMessages(messages) {
        for (var i = 0; i < messages.length; i++) {
            var mes = messages[i];
            console.log("adding: ");
            console.log(mes);

            var text = mes.message;
            var createdAt = mes.timestamp;
            var _id = this.state.messages.length + 1 + i;

            var to = mes.to;
            var userId = -1;
            var senderName = "";

            console.log(this.state.currentUserUID);

            if (this.state.currentUserUID === to) {
                userId = 2;
                senderName = this.state.otherPersonName;
            }
            else {
                userId = 1;
                senderName = this.state.currentUserUID;
            }

            this.onSend({ _id, text, createdAt, user: { _id: userId, name: senderName}}, false);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("messaging will receive");
        console.log(nextProps);

        var messages = nextProps.messages[this.state.convoKey];

        //var n = messages.length - this.state.messages.length;
        this.addMessages(messages.slice(this.state.messages.length));
    }


    onSend(message = [], addToDatabase) {
        console.log("called on send");
        console.log(message);

        if (Array.isArray(message)) message = message[0];


        var from = message.user._id === 1 ? this.state.currentUserUID : this.state.otherPersonUID;
        var to = message.user._id === 2 ? this.state.currentUserUID : this.state.otherPersonUID;

        if (addToDatabase) addMessage(this.state.convoKey, message, from, to);

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }));

    }



    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages, true)}
                user={{
                    _id: 1,
                }}
                bottomOffset={44}
                minInputToolbarHeight={42}
                renderActions={this.renderCustomActions}
            />
        );
    }
}

function mapStateToProps(state, props) {
    return {
        //data: state.dataReducer.data,
        messages: state.messagingReducer.allMessages,
        hasMessages: state.messagingReducer.hasMessages,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Messaging);

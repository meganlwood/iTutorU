import React, { Component } from 'react';
import {View, Text, Button as RNButton, KeyboardAvoidingView, Image, StyleSheet} from 'react-native';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SimpleFormComponent from "../../components/SimpleFormComponent";
import {Button} from "react-native-elements";
import {DotIndicator} from "react-native-indicators";

class LoginScreen extends Component {

    state={
        email: '',
        password: '',
        errors: {
            email: '',
            password: ''
        },
        loading: false,
        // loading: false,
    }

    onPressLogin() {
        if (this.state.errors.email == '' && this.state.errors.password == '') {
          this.setState({ loading: true });
          this.props.signInUser(this.state.email, this.state.password);
        }

    }

    onChangeEmail(text) {
        this.state.errors.password = "";

        if (text.match(/.*@.*\..*.*/)) {
            this.state.errors.email = '';
        }
        else {
            this.state.errors.email = 'Invalid Email';
        }

        this.setState(this.state);
        this.setState({ email: text });
    }

    onChangePassword(text) {
        this.state.errors.password = "";
        this.state.password = text;
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.signedIn && nextProps.userType == 'tutor') {
        //     console.log("Navigating...");
        //     this.props.navigation.navigate('LoggedInTutor');
        // }
        if (nextProps.signInError != '') {
            this.state.loading = false;
            this.state.errors.password = nextProps.signInError;
            this.setState(this.state);
        }

        console.log(nextProps);
    }

    onPressForgotPassword() {
        this.props.navigation.navigate('ForgotPassword', { email: this.state.email });
    }

    render() {
        return(
            <KeyboardAvoidingView style={{ backgroundColor: 'white', height: '100%'}} behavior={"position"} keyboardVerticalOffset={-60}>

                <View style={{ height: 50 }}></View>
                <Image
                    source={require('../../images/logo2.png')}
                    style={{ alignSelf: 'center' }}
                />
                <View style={{ height: 10 }}></View>
                <Text style={styles.title}>iTutorU</Text>
                <View style={{ height: 20 }}></View>

                <SimpleFormComponent
                    title={"Email"}
                    onChangeText={(text) => this.onChangeEmail(text)}
                    errorMessage={this.state.errors.email}
                    secure={false}
                    keyboard={'email-address'}
                    spellcheck={false}
                />
                <SimpleFormComponent
                    title={"Password"}
                    onChangeText={(text) => this.onChangePassword(text)}
                    errorMessage={this.state.errors.password}
                    secure={true}
                    keyboard={null}
                />
                <View style={{ height: 40, opacity: this.state.loading? 1 : 0, paddingBottom: 20 }}>
                    <DotIndicator
                        animating={this.state.loading}
                        size={15}
                        color={'#0093ff'}
                    />
                </View>

                <Button
                    buttonStyle={styles.button}
                    title={"Sign in"}
                    onPress={() => this.onPressLogin()}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <RNButton
                        title={"Create Account"}
                        onPress={() => this.props.navigation.navigate('CreateAccount')}
                    />
                    <RNButton
                        title={"Forgot Password?"}
                        onPress={() => this.onPressForgotPassword()}
                    />

                </View>


            </KeyboardAvoidingView>
        );


    }
}

const styles= StyleSheet.create({
    button: {
        backgroundColor: '#0093ff',
        borderRadius: 20,
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gray'
    }
});

function mapStateToProps(state, props) {
    return {
        signedIn: state.authReducer.signedIn,
        userType: state.authReducer.userType,
        signInError: state.authReducer.error,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

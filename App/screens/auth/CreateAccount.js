import React, { Component } from 'react';
import { Text, View, Button as RNButton, StyleSheet, Image, KeyboardAvoidingView, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import SimpleFormComponent from '../../components/SimpleFormComponent';
import { DotIndicator } from 'react-native-indicators';
import {createBlankParent, createBlankTutor} from "../../FirebaseManager";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../../actions";

class CreateAccount extends Component {

    state = {
        email: '',
        password: '',
        errors: {
            email: '',
            password: '',
        },
        type: '',
        loading: false,
        confirm: '',
    }

    onChangeEmail(email) {
        //TODO check if account already exists

        if (email.match(/.*@.*\..*.*/)) {
            this.state.errors.email = '';
        }
        else {
            this.state.errors.email = 'Invalid Email';
        }

        this.setState(this.state);
        this.setState({ email });
    }

    onChangePassword(password) {
        if (this.state.errors.email.match(/.*password.*/)) {
            this.state.errors.email = "";
        }

        this.setState(this.state);
        this.setState({ password });
    }

    onChangePasswordConfirm(confirm) {
        this.setState({ confirm }, function() {
            if (this.state.password === confirm) {
                this.state.errors.password = "";
                this.setState(this.state);
            }
            else {
                this.state.errors.password = "Passwords do not match.";
                this.setState(this.state);
            }
        });

    }


    onPressParent() {
        this.setState({ loading: true });

        if (this.state.errors.email == "" && this.state.errors.password == "") {
            createBlankParent(this.state.email, this.state.password).then(user => {
                this.props.navigation.navigate('SignUpParent', { uid: user.uid, goBack: false });
            }).catch(error => {
                this.state.errors.email = error;
                this.state.loading = false;
                this.setState(this.state);
            })
        }
        else {
            this.setState({ loading: false });
        }
    }

    onPressTutor() {
        this.setState({ loading: true });

        if (this.state.errors.email == "" && this.state.errors.password == "") {
            console.log("attempting to create a tutor");

            createBlankTutor(this.state.email, this.state.password).then(user => {
                console.log("should be navigating");
                this.props.navigation.navigate('SignUpTutor', { uid: user.uid, goBack: false });
            }).catch(error => {
                console.log("there was an error");
                console.log(error.message);
                this.state.errors.email = error;
                this.state.loading = false;
                this.setState(this.state);
            })
        }
        else {
            this.setState({ loading: false });
        }
    }

    render() {
        return(
            <KeyboardAvoidingView style={{ backgroundColor: 'white', height: '100%'}} behavior={"position"} keyboardVerticalOffset={-150}>
                <ScrollView>
                    <View style={{ height: 50 }}></View>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={{ height: 20 }}></View>

                    <SimpleFormComponent
                        title={"Email"}
                        onChangeText={(text) => this.onChangeEmail(text)}
                        errorMessage={this.state.errors.email}
                        secure={false}
                        keyboard={'email-address'}
                    />
                    <SimpleFormComponent
                        title={"Password"}
                        onChangeText={(text) => this.onChangePassword(text)}
                        secure={true}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Confirm Password"}
                        onChangeText={(text) => this.onChangePasswordConfirm(text)}
                        errorMessage={this.state.errors.password}
                        secure={true}
                        keyboard={null}
                    />


                    <View style={{ height: 40, opacity: this.state.loading? 1 : 0, paddingBottom: 20 }}>

                        <DotIndicator
                            animating={this.state.loading}
                            // hidden={!this.state.loading}
                            // size={"large"}
                            size={15}
                            color={'#0093ff'}
                        />
                        <View style={{ height: 20 }}></View>

                    </View>

                    <Button
                        buttonStyle={styles.button}
                        title={"Sign up as Parent"}
                        onPress={() => this.onPressParent()}
                    />
                    <Button
                        buttonStyle={styles.button}
                        title={"Sign up as Tutor"}
                        onPress={() => this.onPressTutor()}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <RNButton
                            title={"Already have an account? Sign in"}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    </View>
                    <View style={{ height: 30 }}></View>



                </ScrollView>



            </KeyboardAvoidingView>
        );
    }

}

const styles= StyleSheet.create({
    button: {
        backgroundColor: '#0093ff',
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gray'
    }
});

// we want to have the tutor data and the student data
function mapStateToProps(state, props) {
    return  {

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);

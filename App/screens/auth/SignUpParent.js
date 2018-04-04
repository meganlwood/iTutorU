import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';

import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SimpleFormComponent from "../../components/SimpleFormComponent";

class SignUpParent extends Component {

    state = {
        studentName: '',
        parentName: '',
        phone: '',
        subject: '',
        grade: '',
        address: '',
        uid: '',
    }


    componentWillMount() {
        const { uid, goBack } = this.props.navigation.state.params;
        this.setState({ uid, goBack });
    }

    onPressSignUp() {
        const { uid, studentName, parentName, phone, subject, grade, address } = this.state;

        // TODO: validate all forms filled out
        this.props.signUpParent(uid, parentName, phone, studentName, subject, grade, address);

        if (this.state.goBack) {
            this.props.navigation.goBack();
        }
    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={"position"} keyboardVerticalOffset={-60} >
                <ScrollView>
                    <View style={{ height: 50 }}></View>
                    <Text style={styles.title}>New Student Sign Up</Text>
                    <SimpleFormComponent
                        title={"Full Name (Parent)"}
                        onChangeText={(text) => this.setState({ parentName: text })}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Full Name (Student)"}
                        onChangeText={(text) => this.setState({ studentName: text })}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Phone Number"}
                        onChangeText={(text) => this.setState({ phone: text })}
                        secure={false}
                        keyboard={'phone-pad'}
                    />
                    <SimpleFormComponent
                        title={"Subject(s)"}
                        onChangeText={(text) => this.setState({ subject: text })}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Student's Grade"}
                        onChangeText={(text) => this.setState({ grade: text })}
                        secure={false}
                        keyboard={'numeric'}
                    />
                    <SimpleFormComponent
                        title={"Address"}
                        onChangeText={(text) => this.setState({ address: text })}
                        secure={false}
                        keyboard={null}
                    />
                    <Button
                        buttonStyle={styles.button}
                        title={"Submit"}
                        onPress={() => this.onPressSignUp()}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

        );
    }


}


const styles= StyleSheet.create({
    button: {
        backgroundColor: '#0093ff',
        borderRadius: 20,
        marginBottom: 20
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gray'
    },
    container: {
        backgroundColor: 'white',
        height: '100%',
    }
});


function mapStateToProps(state, props) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpParent);

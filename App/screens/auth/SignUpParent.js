import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Button as RNButton } from 'react-native';
import { Button, Card } from 'react-native-elements';

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
        goBack: false,
        availability: [],
    }


    componentWillMount() {
        console.log("SIGNUPPARENT PARAMS");
        console.log(this.props.navigation.state.params);

        const { uid, goBack } = this.props.navigation.state.params;
        this.setState({ uid, goBack });
    }

    onPressSignUp() {
        const { uid, studentName, parentName, phone, subject, grade, address, availability } = this.state;

        // TODO: validate all forms filled out
        this.props.signUpParent(uid, parentName, phone, studentName, subject, grade, address, availability);
        //this.props.navigation.navigate('SelectAvailability');

        if (this.state.goBack) {
            this.props.navigation.goBack();
        }
    }

    onAvailabilityNavBack(availability) {
        console.log("availability navback");
        console.log(availability);
        this.setState({ availability });
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
                    {this.state.availability.length == 0 &&
                    <Button
                        buttonStyle={styles.button}
                        title={"Select Availability"}
                        onPress={() => {
                            console.log("about to navigate...");
                            this.props.navigation.navigate('SelectAvailability', { callback: this.onAvailabilityNavBack.bind(this) })
                        }}
                    />
                    }
                    {this.state.availability.length != 0 &&
                    <Card
                        title={"Availability"}
                        containerStyle={{ marginBottom: 20 }}
                    >
                        <View style={{ justifyContent: 'center' }}>
                        {this.state.availability.map((item, index) => {
                            return (
                                <Text style={{ alignSelf: 'center', marginBottom: 5, }}>{item}</Text>
                            )
                        })}
                        </View>

                        <RNButton
                            buttonStyle={styles.button}
                            title={"Edit Availability"}
                            onPress={() => this.props.navigation.navigate('SelectAvailability', { data: this.state.availability, callback: this.onAvailabilityNavBack.bind(this)})}
                        />
                    </Card>

                    }


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

import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Text, StyleSheet } from 'react-native';
import SimpleFormComponent from "../../components/SimpleFormComponent";
import MultipleSelect from "../../components/MultipleSelect";
import {Button, FormValidationMessage} from "react-native-elements";

import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { NavigationActions } from 'react-navigation';

class SignUpTutor extends Component {



    state={
        name: '',
        phone: '',
        exp: '',
        degree: '',
        city: '',
        selectedItems: [],
        subjects: [],
        degree: '',
        institution: '',

        nameError: '',
        phoneError: '',
        expError: '',
        degreeError: '',
        cityError: '',
        selectedItemsError: '',
        degreeError: '',
        institutionError: '',
    }

    componentWillMount() {
        console.log("Signuptutor mounted: ");
        console.log(this.props.subjects);

        this.setSubjects(this.props.subjects);

    }

    setSubjects(sub) {
        var subjects = [];
        for (var i = 0; i < sub.length; i++) {
            subjects.push({ name: sub[i] });
        }

        this.setState({ subjects });
    }

    componentWillReceiveProps(nextProps) {
        console.log("will receive");
        console.log(nextProps);
        this.setSubjects(nextProps.subjects);
    }

    onPressSignUp() {
        const { goBack } = this.props.navigation.state.params;

        var error = this.validateForm();
        if (!error) {
            const { uid } = this.props.navigation.state.params;
            const { name, phone, exp, degree, city, selectedItems, institution } = this.state;
            this.props.signUpTutor(uid, name, phone, exp, degree, selectedItems, city, institution);
            if (goBack) {
              this.props.navigation.goBack();
            }
            else this.props.navigation.navigate('Home');
        }
    }

    validateForm() {
        var error = false;
        this.state.nameError = '';
        this.state.phoneError = '';
        this.state.expError = '';
        this.state.degreeError = '';
        this.state.cityError = '';
        this.state.selectedItemsError = '';

        if (this.state.name.trim().length == 0) {
            this.state.nameError = 'Please enter your name';
            error = true;
        }
        if (this.state.phone.match(/\(\d\d\d\)-\d\d\d-\d\d\d\d/) == null) {
            this.state.phoneError = 'Please enter a valid phone number';
            error = true;
        }
        if (this.state.exp.trim().length == 0) {
            this.state.expError = "Please enter your experience";
            error = true;
        }
        if (this.state.degree.trim().length == 0) {
            this.state.degreeError = "Please enter your degree";
            error = true;
        }
        if (this.state.institution.trim().length == 0) {
            this.state.institutionError = "Please enter your institution";
            error = true;
        }
        if (this.state.city.trim().length == 0) {
            this.state.cityError = "Please enter cities you are willing to service (separated by commas)";
            error = true;
        }
        if (this.state.selectedItems.length == 0) {
            this.state.selectedItemsError = "Please select at least one subject";
            error = true;
        }

        this.setState(this.state);
        return error;

    }

    onChangePhoneNumber(text) {
        if (text.length === 3 && text.match(/\d\d\d/)) {
            text = "(" + text + ")-";
        }
        if (text.length === 9) {
            text += "-";
        }
        if (text.length === 5) {
            text = text[1] + text[2];
        }
        this.setState({ phone: text });
    }

    render() {
        console.log("subjects");
        console.log(this.state.subjects);


        return(
            <KeyboardAvoidingView style={{ backgroundColor: 'white', height: '100%'}} behavior={"position"} keyboardVerticalOffset={-60}>

                <ScrollView>
                    <View style={{ height: 50 }}></View>
                    <Text style={styles.title}>New Tutor Application</Text>
                    <View style={{ height: 20 }}></View>

                    <SimpleFormComponent
                        title={"Full Name"}
                        onChangeText={(text) => this.setState({ name: text })}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.nameError}
                    />
                    <SimpleFormComponent
                        title={"Phone Number"}
                        onChangeText={(text) => this.onChangePhoneNumber(text)}
                        secure={false}
                        keyboard={'phone-pad'}
                        value={this.state.phone}
                        maxLength={14}
                        errorMessage={this.state.phoneError}
                    />
                    <MultipleSelect
                        outerStyle={{ flex: 1, margin: 20}}
                        items={this.state.subjects}
                        uniqueKey={"name"}
                        onSelectedItemsChange={(selectedItems) => {
                            this.setState({ selectedItems });
                            console.log(selectedItems);
                        }}
                        selectText={"What subjects would you like to tutor?"}
                        placeholderText={"Search subjects..."}
                        color={"#0093ff"}
                        submitButtonText={"Submit"}
                    />
                    <FormValidationMessage>{this.state.selectedItemsError}</FormValidationMessage>

                    <SimpleFormComponent
                        title={"Do you have tutoring experience?"}
                        onChangeText={(text) => this.setState({ exp: text })}
                        secure={false}
                        errorMessage={this.state.expError}
                    />
                    <SimpleFormComponent
                        title={"What is your highest degree (and title) obtained? e.g. 'BS Computer Science'"}
                        onChangeText={(text) => this.setState({ degree: text })}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.degreeError}
                    />
                    <SimpleFormComponent
                        title={"What institution is your highest degree from?"}
                        onChangeText={(text) => this.setState({ institution: text })}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.institutionError}
                    />
                    <SimpleFormComponent
                        title={"City"}
                        onChangeText={(text) => this.setState({ city: text })}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.cityError}
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
        marginBottom: 50,
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
        subjects: state.authReducer.subjects,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpTutor);

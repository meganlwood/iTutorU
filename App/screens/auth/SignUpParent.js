import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Button as RNButton } from 'react-native';
import {Button, Card, FormValidationMessage, ButtonGroup, FormLabel} from 'react-native-elements';

import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SimpleFormComponent from "../../components/SimpleFormComponent";
import MultilineSimpleFormComponent from "../../components/MultilineSimpleFormComponent";
import { NavigationActions } from 'react-navigation';


class SignUpParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        studentName: '',
        parentName: '',
        phone: '',
        subject: '',
        grade: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        uid: '',
        goBack: false,
        availability: [],
        weeklySess: 1,
        otherInfo: '',
        selectedIndex: 0,

        //Errors
        parentNameError: '',
        studentNameError: '',
        phoneNumberError: '',
        subjectsError: '',
        gradeError: '',
        addressError: '',
        cityError: '',
        zipError: '',
        stateError: '',
        sessionsError: '',
        submitError: '',


    }
  }


    componentWillMount() {
        const { uid, goBack } = this.props.navigation.state.params;
        this.setState({ uid, goBack });
    }

    validateForms() {
        var error = false;
        this.state.parentNameError = '';
        this.state.studentNameError = '';
        this.state.phoneNumberError = '';
        this.state.subjectsError = '';
        this.state.gradeError = '';
        this.state.addressError = '';
        this.state.cityError = '';
        this.state.zipError = '';
        this.state.stateError = '';
        this.state.sessionsError = '';
        this.state.submitError = '';

        if (this.state.parentName.trim().length == 0) {
            this.state.parentNameError = 'Please enter Parent Name';
            error = true;
        }
        if (this.state.studentName.trim().length == 0) {
            this.state.studentNameError = 'Please enter Student Name';
            error = true;
        }
        if (this.state.phone.match(/\(\d\d\d\)-\d\d\d-\d\d\d\d/) == null) {
            this.state.phoneNumberError = 'Please enter a valid phone number';
            error = true;
        }
        if (this.state.grade.trim().length == 0) {
            this.state.gradeError = "Please enter student's grade";
            error = true;
        }
        if (this.state.subject.trim().length == 0) {
            this.state.subjectsError = 'Please enter at least one subject';
            error = true;
        }
        if (this.state.address.trim().length == 0) {
            this.state.addressError = 'Please enter your address';
            error = true;
        }
        if (this.state.city.trim().length == 0) {
            this.state.addressError = 'Please enter your city';
            error = true;
        }
        if (this.state.zip.trim().length == 0) {
            this.state.addressError = 'Please enter your zip code';
            error = true;
        }
        if (this.state.state.trim().length == 0) {
            this.state.addressError = 'Please enter your state';
            error = true;
        }
        if (this.state.weeklySess != 1 && this.state.weeklySess != 2) {
            this.state.sessionsError = 'Please enter 1 or 2';
            error = true;
        }
        if (this.state.availability.length == 0 || this.state.availability.length < this.state.weeklySess) {
            this.state.submitError = 'Please select more available times for tutoring';
            error = true;
        }

        this.setState(this.state);
        return error;
    }

    onPressSignUp() {
        var error = this.validateForms();

        const { uid, studentName, parentName, phone, subject, grade, address, city, zip, state, availability, weeklySess, otherInfo } = this.state;
        var fullAddress = address + ", " + city + ", " + state + " " + zip;
        if (!error) {
            this.props.signUpParent(uid, parentName, phone, studentName, subject, grade, fullAddress, city, availability, weeklySess, otherInfo);
            if (this.state.goBack) {
              this.props.navigation.goBack();
            }
            else {
              this.props.navigation.navigate('Home');
            }
        }
    }

    onAvailabilityNavBack(availability) {
        this.setState({ availability });
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
        return (
            <KeyboardAvoidingView style={styles.container} behavior={"position"} keyboardVerticalOffset={-180} >
                <ScrollView>
                    <View style={{ height: 50 }}></View>
                    <Text style={styles.title}>New Student Sign Up</Text>
                    <SimpleFormComponent
                        title={"Full Name (Parent)"}
                        onChangeText={(text) => {
                          this.setState({ parentName: text });
                        }}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.parentNameError}
                    />
                    <SimpleFormComponent
                        title={"Full Name (Student)"}
                        onChangeText={(text) => {
                          this.setState({ studentName: text })
                        }}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.studentNameError}
                    />
                    <SimpleFormComponent
                        title={"Phone Number"}
                        value={this.state.phone}
                        onChangeText={(text) => this.onChangePhoneNumber(text)}
                        secure={false}
                        keyboard={'phone-pad'}
                        errorMessage={this.state.phoneNumberError}
                        maxLength={14}
                    />
                    <SimpleFormComponent
                        title={"Subject(s)"}
                        onChangeText={(text) => {
                          this.setState({ subject: text });
                        }}
                        secure={false}
                        keyboard={null}
                        errorMessage={this.state.subjectsError}
                    />
                    <SimpleFormComponent
                        title={"Student's Grade"}
                        onChangeText={(text) => {
                          this.setState({ grade: text });
                        }}
                        secure={false}
                        keyboard={'numeric'}
                        errorMessage={this.state.gradeError}
                    />
                    <Card
                      title={"Address"}
                      containerStyle={{ marginBottom: 10 }}
                    >
                      <SimpleFormComponent
                          title={"Address"}
                          onChangeText={(text) => this.setState({ address: text })}
                          secure={false}
                          keyboard={null}
                          errorMessage={this.state.addressError}
                      />
                      <SimpleFormComponent
                          title={"City"}
                          onChangeText={(text) => this.setState({ city: text })}
                          secure={false}
                          keyboard={null}
                          errorMessage={this.state.cityError}
                      />
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <SimpleFormComponent
                            title={"State"}
                            onChangeText={(text) => {
                              var upper = text.toUpperCase();
                              console.log(upper);
                              this.setState({ state: upper })
                            }}
                            value={this.state.state}
                            secure={false}
                            keyboard={null}
                            errorMessage={this.state.stateError}
                            style={{ flex: 1}}
                            maxLength={2}
                        />
                        <SimpleFormComponent
                            title={"Zip Code"}
                            onChangeText={(text) => this.setState({ zip: text })}
                            secure={false}
                            keyboard={'numeric'}
                            errorMessage={this.state.zipError}
                            style={{flex: 1}}
                            maxLength={5}
                        />

                      </View>

                    </Card>


                    {/*}<Text style={{marginRight: 20, marginLeft: 20, color: 'gray', fontWeight: 'bold', fontSize: 16}}>How many sessions would you like each week?</Text> */}

                    <FormLabel>How many sessions would you like each week?</FormLabel>
                    <ButtonGroup containerStyle={{marginTop: 10, marginBottom: 20, marginRight: 20, marginLeft: 20}}
                      onPress={(index) => {
                        this.setState({selectedIndex: index, weeklySess: index+1});
                      }}
                      selectedIndex={this.state.selectedIndex}
                      buttons={['1', '2']}
                      />
                    
                    <MultilineSimpleFormComponent
                        title={"Is there anything else you would like us to know about your student? (Learning style, etc)"}
                        onChangeText={(text) => this.setState({ otherInfo: text })}
                        secure={false}
                        keyboard={null}
                    />

                    {this.state.availability.length == 0 &&
                    <Button
                        buttonStyle={styles.button}
                        title={"Select Availability"}
                        onPress={() => {
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
                                <Text style={{ alignSelf: 'center', marginBottom: 5, fontSize: 16}}>{item}</Text>
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

                    <FormValidationMessage>{this.state.submitError}</FormValidationMessage>
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

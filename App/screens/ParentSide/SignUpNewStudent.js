import React, { Component } from 'react';
import { View, Text, Button as RNButton, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { FormValidationMessage, ButtonGroup, Button, Card } from 'react-native-elements';
import SimpleFormComponent from '../../components/SimpleFormComponent';
import MultilineSimpleFormComponent from '../../components/MultilineSimpleFormComponent';
import { createStudent } from '../../FirebaseManager';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../../actions";

class SignUpNewStudent extends Component {

  state = {
    studentName: '',
    subject: '',
    grade: '',
    address: '',
    selectedIndex: 0,
    weeklySess: 1,
    availability: [],
    otherInfo: '',

    studentNameError: '',
    subjectsError: '',
    gradeError: '',
    addressError: '',
    sessionsError: '',
    submitError: '',

  }

  validateForms() {
    var error = false;
    this.state.studentNameError = '';
    this.state.subjectsError = '';
    this.state.gradeError = '';
    this.state.addressError = '';
    this.state.sessionsError = '';
    this.state.submitError = '';

    if (this.state.studentName.trim().length == 0) {
        this.state.studentNameError = 'Please enter Student Name';
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
    const { studentName, subject, grade, address, availability, weeklySess, otherInfo } = this.state;

    if (!error) {
      createStudent(this.props.uid, studentName, subject, grade, address, availability, weeklySess, otherInfo);
      this.props.navigation.goBack(null);
    }
  }

  onAvailabilityNavBack(availability) {
    this.setState({ availability });
  }

  render() {
    return(
      <KeyboardAvoidingView style={styles.container} behavior={"position"} keyboardVerticalOffset={-60}>
        <ScrollView>
          <Text style={styles.title}>New Student Sign Up</Text>
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
          <SimpleFormComponent
              title={"Address"}
              onChangeText={(text) => this.setState({ address: text })}
              secure={false}
              keyboard={null}
              errorMessage={this.state.addressError}
          />
          <Text style={{marginRight: 20, marginLeft: 20, color: 'gray', fontWeight: 'bold', fontSize: 16}}>How many sessions would you like each week?</Text>
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
      uid: state.parentReducer.data.uid,
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in our actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SignUpNewStudent);

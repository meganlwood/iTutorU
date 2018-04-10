import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Button as RNButton } from 'react-native';
import { Button, Card, ButtonGroup } from 'react-native-elements';

import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SimpleFormComponent from "../../components/SimpleFormComponent";


class SignUpParent extends Component {
  constructor(props) {
    super(props);
    this.onUpdateFields = this.onUpdateFields.bind(this);
    this.state = {
        studentName: '',
        parentName: '',
        phone: '',
        subject: '',
        grade: '',
        address: '',
        uid: '',
        goBack: false,
        availability: [],
        weeklySess: 0,
        canSubmit: false,
        selectedIndex: 0
    };
  }

    componentWillMount() {
        console.log("SIGNUPPARENT PARAMS");
        console.log(this.props.navigation.state.params);

        const { uid, goBack } = this.props.navigation.state.params;
        this.setState({ uid, goBack });
    }

    onPressSignUp() {
        const { uid, studentName, parentName, phone, subject, grade, address, availability, weeklySess } = this.state;
        this.props.signUpParent(uid, parentName, phone, studentName, subject, grade, address, availability, weeklySess);
        this.props.navigation.goBack();
    }

    onUpdateFields() {
      console.log("CHECKING: ");
      console.log(this.state);
      if (this.state.studentName == '' || this.state.parentName == '' || this.state.phone == '' || this.state.subject == '' || this.state.grade == '' || this.state.address == '') {
        this.setState({canSubmit: false});
      } else if (this.state.weeklySess != 1 && this.state.weeklySess != 2) {
        this.setState({canSubmit: false});
      } else {
        this.setState({canSubmit: true});
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
                        onChangeText={(text) => {
                          this.setState({ parentName: text });
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Full Name (Student)"}
                        onChangeText={(text) => {
                          this.setState({ studentName: text })
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Phone Number"}
                        onChangeText={(text) => {
                          this.setState({ phone: text });
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={'phone-pad'}
                    />
                    <SimpleFormComponent
                        title={"Subject(s)"}
                        onChangeText={(text) => {
                          this.setState({ subject: text });
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"Student's Grade"}
                        onChangeText={(text) => {
                          this.setState({ grade: text });
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={'numeric'}
                    />
                    <SimpleFormComponent
                        title={"Address"}
                        onChangeText={(text) => {
                          this.setState({ address: text });
                          this.onUpdateFields();
                        }}
                        secure={false}
                        keyboard={null}
                    />
                    <ButtonGroup containerStyle={{marginTop: 10, marginBottom: 20, marginRight: 20, marginLeft: 20}}
                      onPress={(index) => {
                        this.setState({selectedIndex: index, weeklySess: index+1});
                        this.onUpdateFields();
                      }}
                      selectedIndex={this.state.selectedIndex}
                      buttons={['1', '2']}
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
                        disabled={!this.state.canSubmit}
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

import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Text, StyleSheet } from 'react-native';
import SimpleFormComponent from "../../components/SimpleFormComponent";
import MultipleSelect from "../../components/MultipleSelect";
import {Button} from "react-native-elements";

import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class SignUpTutor extends Component {

    // subjects = [
    //     {
    //         id: 0,
    //         name: "Math (Elementary/Middle School)"
    //     },
    //     {
    //         id: 1,
    //         name: "Math (High School)"
    //     },
    //     {
    //         id: 2,
    //         name: "AP Computer Science",
    //     },
    //     {
    //         id: 3,
    //         name: "Physics"
    //     },
    //     {
    //         id: 4,
    //         name: "Writing"
    //     },
    //     {
    //         id: 5,
    //         name: "Reading"
    //     }
    // ]

    subjects2 = [
        {
            name: "Math (Elementary/Middle School)"
        },
        {
            name: "Math (High School)"
        },
        {
            name: "AP Computer Science",
        },
        {
            name: "Physics"
        },
        {
            name: "Writing"
        },
        {
            name: "Reading"
        }
    ]

    state={
        name: '',
        phone: '',
        exp: '',
        degree: '',
        city: '',
        selectedItems: [],
        subjects: [],
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
        const { uid } = this.props.navigation.state.params;
        const { name, phone, exp, degree, city, selectedItems } = this.state;
        this.props.signUpTutor(uid, name, phone, exp, degree, selectedItems, city);
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
                    />
                    <SimpleFormComponent
                        title={"Phone Number"}
                        onChangeText={(text) => this.setState({ phone: text })}
                        secure={false}
                        keyboard={'phone-pad'}
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

                    <SimpleFormComponent
                        title={"Do you have tutoring experience?"}
                        onChangeText={(text) => this.setState({ exp: text })}
                        secure={false}
                    />
                    <SimpleFormComponent
                        title={"What is your highest degree obtained?"}
                        onChangeText={(text) => this.setState({ degree: text })}
                        secure={false}
                        keyboard={null}
                    />
                    <SimpleFormComponent
                        title={"City"}
                        onChangeText={(text) => this.setState({ city: text })}
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

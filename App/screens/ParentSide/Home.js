import React, { Component } from 'react';
import { View, Text, Button as RNButton, ScrollView } from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Card, Button } from 'react-native-elements';

import * as Actions from '../../actions/index';

class ParentHome extends Component {


    renderStudentCard(student) {
        var tutor = student.tutor;
        if (tutor === undefined) {
            return (
                <Card
                    title={student.studentName}
                >
                    <Text>Waiting to be matched with a tutor.</Text>
                </Card>
            )
        }
        else {
            return(
                <Card
                    title={student.studentName}
                >
                    <Text>{`${student.studentName}'s tutor: ${tutor.name}`}</Text>
                    <Button
                        title={`Message ${tutor.name}`}
                        onPress={() => this.props.navigation.navigate('Messaging', { uid: student.uid, convoKey: student.tutor.convoKey, otherPersonUID: student.tutor.uid, otherPersonName: student.tutor.name })}
                    />
                </Card>
            );
        }



    }

    renderProfileData() {
        if (this.props.incomplete_profile) {
            return <Card
                title={"Incomplete Profile"}
            >
                <Text>Hey there! We noticed you didn't complete your profile. Until you do so, we won't be able to match you with a tutor. Press the button below to continue!</Text>
                <Button
                    title={"Finish Sign Up"}
                    onPress={() => this.props.navigation.navigate('SignUp', { uid: this.props.data.uid, goBack: true })}
                    buttonStyle={styles.buttonStyle}
                />

            </Card>
        }
        else {
            if (this.props.data.students != undefined) {
                return this.props.data.students.map((student, index) => {
                    return this.renderStudentCard(student)
                })
            }
            else return <Text>Loading</Text>;



        }
    }

    render() {
        return(
            <ScrollView style={{ paddingBottom: 10 }}>
                {this.renderProfileData()}

                <RNButton
                    title={"Sign Out"}
                    onPress={() => this.props.signOut()}
                />
            </ScrollView>
        );


    }
}

const styles = {
    buttonStyle: {
        marginTop: 20,
        backgroundColor: '#0093ff',
        borderRadius: 30,
    },
    cardStyle: {
        borderColor: '#f5f924'
    },
    cardFlexRow: {
        flexDirection: 'row',
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    text: {
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
    },
    bigText: {
        fontSize: 22,
        marginBottom: 20,
    },
    tutorInfoCard: {
        paddingTop: 30,
        width: 150,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 30
    }

}

function mapStateToProps(state, props) {
    return {
        //data: state.dataReducer.data,
        incomplete_profile: state.parentReducer.incomplete_profile,
        data: state.parentReducer.data,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ParentHome);
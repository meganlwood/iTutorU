import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor} from "../../FirebaseManager";

class SelectStudent extends Component {

    componentWillMount() {
        console.log("select student props");
        console.log(this.props);
    }

    renderCards(students) {
        if (!Array.isArray(students)) {
            return null;
        }

        return students.map((student, i) => {
            return <Card title={`Student`} key={i}>
                <Text >Grade: {student.grade}</Text>
                <Text >Subject: {student.subject}</Text>
                <Text >City: {student.city}</Text>
                <Text >Availability: N/A</Text>


                <Button
                    buttonStyle={styles.buttonStyle}
                    title={`Tutor Student`}
                    onPress={() =>  {

                        var arr = this.props.currentStudents;
                        console.log("current students: ");
                        console.log(arr);
                        if (typeof arr == "undefined") {
                            arr = [];
                        }
                        arr.push(student.key);

                        connectStudentTutor(student.key, this.props.uid, arr);
                        this.props.navigation.state.params.onNavigateBack(this);
                        this.props.navigation.goBack();
                    }}
                />

            </Card>
        })
    }

    render() {
        return(
            <ScrollView>
                {this.renderCards(this.props.unmatchedStudents)}
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
}


function mapStateToProps(state, props) {
    return {
        unmatchedStudents: state.tutorReducer.data.unmatchedStudents,
        currentStudents: state.tutorReducer.studentIDs,
        uid: state.tutorReducer.data.uid,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectStudent);
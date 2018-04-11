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
        if (!Array.isArray(students) || students.length == 0) {
            return(<Text style={styles.textStyle}>No new students, check back later!</Text>);
        }

        return students.map((student, i) => {
            return <Card title={`Student`} key={i}>
                <Text >Grade: {student.grade}</Text>
                <Text >Subject: {student.subject}</Text>
                <Text >City: {student.city}</Text>


                <Button
                    buttonStyle={styles.buttonStyle}
                    title={`See Student Availability`}
                    onPress={() =>  {
                      this.props.navigation.navigate('SelectTime', { studentData: student});
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
    textStyle: {
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: '50%'
    }
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

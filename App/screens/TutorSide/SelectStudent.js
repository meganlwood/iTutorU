import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor} from "../../FirebaseManager";
import {NavigationActions} from 'react-navigation';

class SelectStudent extends Component {

    componentWillMount() {
        console.log("select student props");
        console.log(this.props);
    }

    renderSubjects(subs) {
      var subjects = '';
      if (subs == undefined) return '';
      if (subs.length == 1) return subs[0];
      subs.map((sub) => {
        subjects = subjects + ", ";
      });
      return subjects.substring(0, subjects.length-1);
    }

    renderCards(students) {
        console.log("render cards");
        console.log(students);

        let relStudents = [];

        var x = this.props.subjects;
        students.map((student) => {
          if (student.subjects == undefined) {

          } else {
            for (var i = 0;i < student.subjects.length; i++) {
              for (var j = 0; j < x.length; j++) {
                if (student.subjects[i] == x[j]) {
                  relStudents.push(student);
                  break;
                }
              }
            }
          }
        });

        if (relStudents.length == 0) {
            return(<Text style={styles.textStyle}>No new students, check back later!</Text>);
        }


        return relStudents.map((student, i) => {
            return <Card title={`Student`} key={i}>
                <Text style={styles.standardTextStyle}>Grade: {student.grade}</Text>
                <Text style={styles.standardTextStyle}>Subject(s): {this.renderSubjects(student.subjects)}</Text>
                <Text style={styles.standardTextStyle}>City: {student.city}</Text>


                <Button
                    buttonStyle={styles.buttonStyle}
                    title={`See Student Availability`}
                    onPress={() =>  {
                      this.props.navigation.navigate('SelectTime', { studentData: student, fromSettings: this.props.navigation.state.params.fromSettings});
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
        marginTop: 10,
        backgroundColor: '#0093ff',
        borderRadius: 30,
    },
    textStyle: {
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: '50%',
      fontSize: 16
    },
    standardTextStyle: {
      textAlign: 'center',
      fontSize: 16,
      margin: 5
    }
}


function mapStateToProps(state, props) {
    return {
        unmatchedStudents: state.tutorReducer.data.unmatchedStudents,
        currentStudents: state.tutorReducer.studentIDs,
        uid: state.tutorReducer.data.uid,
        subjects: state.tutorReducer.data.subjects
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectStudent);

import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor, updateStudentCalendar, updateTutorCalendar} from "../../FirebaseManager";
import {nextDays, stringToIndex, mergeCalendar, mergeSessions} from '../../Util';

class SelectTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableTimes: this.props.navigation.state.params.studentData.availability,
      checked: [],
      numChecked: 0,
      student: this.props.navigation.state.params.studentData
    }
  }

    renderAvailability(times) {
      let total = -1;
      return times.map((time, i) => {
          this.state.checked.push(false);
          let count = total + 1;
          total++;
          return (<CheckBox title={time} checked={this.state.checked[count]}
                onPress={() => {
                  let check = this.state.numChecked;
                  let arr = this.state.checked;
                  if (this.state.checked[count] === false) {
                    check += 1;
                    arr[count] = true;
                  } else {
                    check -= 1;
                    arr[count] = false;
                  }
                  this.setState({numChecked: check, checked: arr})
                }} />);
      });
    }

    onChooseTimes() {


    }

    render() {
      console.log(this.props.navigation);
        return(
            <ScrollView>
              <Text style={styles.headerStyle}>Choose {this.state.student.weeklySessions} {this.state.student.weeklySessions > 1 ? 'Times' : 'Time'}</Text>
              {this.renderAvailability(this.state.availableTimes)}
              <Button style={styles.standardButton} disabled={this.state.numChecked != this.state.student.weeklySessions} // want this enabled when count is valid, disabled when not
                    title={'Tutor Student at Selected Times'}
                    onPress={() => {
                      // only enabled when the correct number of times are selected
                      var arr = this.props.currentStudents;
                      if (typeof arr == "undefined") {
                          arr = [];
                      }
                      arr.push(this.state.student.key);

                      var studentIndex = this.state.student.studentName.indexOf(" ");
                      var tutorIndex = this.props.name.indexOf(" ");
                      let title = this.state.student.studentName.substring(0, studentIndex) + ": Tutoring Session with " + this.props.name.substring(0, tutorIndex);
                      let i = 0;
                      var times = [];
                      var cal1 = [];
                      var cal2 = [];
                      this.state.availableTimes.map((time) => {
                        let index = i;
                        if (this.state.checked[index] === true) {
                          // adds the checked time to the list of times
                          times.push(time);

                          // at the end of this segment of code, cal1 will have
                          //  all the scheduled sessions between this tutor & student
                          if (this.state.student.paidSessions > 0) {
                            var space = time.indexOf(" ");
                            var words = time.substring(0, space);
                            var ind = stringToIndex(words);
                            if (cal1.length == 0) {
                              cal1 = nextDays(ind, this.state.student.paidSessions / this.state.student.weeklySessions, title, time.substring(space+1));
                            } else {
                              cal2 = nextDays(ind, this.state.student.paidSessions / this.state.student.weeklySessions, title, time.substring(space+1));
                              cal1 = mergeCalendar(cal1, cal2);
                            }
                          }
                        }

                        i++;
                      });
                      var studentInfo = this.state.student;
                      studentInfo.chosenTimes = times;
                      this.setState({student: studentInfo});

                      if (this.state.student.paidSessions > 0) {
                        updateStudentCalendar(studentInfo.key, cal1);
                        cal2 = mergeCalendar(cal1, this.props.currentCal);
                        updateTutorCalendar(this.props.uid, cal2);
                      }
                      connectStudentTutor(this.state.student, this.props.uid, arr);



                      var resetAction;
                      console.log(this.props.navigation);
                      if (this.props.navigation.state.params.fromSettings == false) {
                        resetAction = NavigationActions.reset({
                          index: 0,
                          actions: [NavigationActions.navigate({ routeName: 'Home' })],
                        });
                      } else {
                        resetAction = NavigationActions.reset({
                          index: 0,
                          actions: [NavigationActions.navigate({ routeName: 'Settings' })],
                        });

                      }
                      this.props.navigation.dispatch(resetAction);


                    }}
                />
            </ScrollView>
        );
    }


}

const styles = {
    buttonStyle: {
        margin: 20,
        padding: 5,
        backgroundColor: '#0093ff',
        borderRadius: 0,
    },
    selectedStyle: {
        margin: 20,
        backgroundColor: '#6dc1ff',
        borderRadius: 0,
    },
    standardButton: {
      marginTop: 20,
      backgroundColor: '#0093ff',
      borderRadius: 30,
    },
    textStyle: {
      color: 'white',
      fontSize: 14,
    },
    headerStyle: {
      fontSize: 18,
      textAlign: 'center',
      margin: 5
    }
}


// we want to have the tutor data and the student data
function mapStateToProps(state, props) {
    return  {
        currentStudents: state.tutorReducer.studentIDs,
        uid: state.tutorReducer.data.uid,
        name: state.tutorReducer.data.tutorName,
        currentCal: state.calReducer.cal
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTime);

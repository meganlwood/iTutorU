import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor} from "../../FirebaseManager";
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

    componentWillMount() {
        console.log("select time props");
        console.log(this.props);
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

                      let i = 0;
                      var times = [];
                      var cal1 = [];
                      var cal2 = [];
                      this.state.availableTimes.map((time) => {
                        let index = i;
                        if (this.state.checked[index] === true) {
                          times.push(time);

                          var space = time.indexOf(" ");
                          var words = time.substring(0, space);
                          var ind = stringToIndex(words);
                          if (cal1.length == 0) {
                            cal1 = nextDays(ind, 4, "Tutoring Session with Jane", time.substring(space+1));
                          } else {
                            cal2 = nextDays(ind, 4, "Tutoring Session with Jane", time.substring(space+1));
                            cal1 = mergeCalendar(cal1, cal2);
                          }
                        }
                        i++;
                      });
                      // var studentInfo = this.state.student;
                      // studentInfo.chosenTimes = times;
                      // this.setState({student: studentInfo});
                      // console.log(this.state.student);
                      // connectStudentTutor(this.state.student, this.props.uid, arr);

                      // put cal1 into database for student
                      // pull tutor calendar from database, merge with calendar

                      // var data = [
                      //   0: {
                      //     "2018-4-17" : {
                      //       sessions: {
                      //         name: "Tutoring Session with John",
                      //         time: "3:00 PM"
                      //       }
                      //     }
                      //   },
                      //   1: {
                      //     "2018-4-23": {
                      //       sessions: {
                      //         name: "Tutoring Session with John",
                      //         time: "3:00 PM"
                      //       }
                      //     }
                      //   }
                      // ];
                      var data = [
                        {"2018-04-16":
                          {sessions:[
                            {
                              name:"Tutoring Session with Jane",
                              time:"5:00 PM"
                            }
                          ]}
                        },
                        {"2018-04-24":
                          {sessions:[
                            {
                              name:"Tutoring Session with Jane",
                              time:"6:00 PM"
                            }
                          ]}
                        }];
                      // console.log(JSON.stringify(cal1));
                      cal2 = mergeCalendar(cal1, data);
                      console.log(cal2);
                      console.log("merged");
                      this.props.addCalendar(cal2);
                      this.props.navigation.navigate('Home');

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
        uid: state.tutorReducer.data.uid
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTime);

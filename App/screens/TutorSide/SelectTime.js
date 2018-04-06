import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor} from "../../FirebaseManager";

class SelectTime extends Component {

    componentWillMount() {
        console.log("select time props");
        console.log(this.props);
    }

    // renderCards(students) {
    //     if (!Array.isArray(students)) {
    //         return null;
    //     }
    //
    //     return students.map((student, i) => {
    //         return <Card title={`Student`} key={i}>
    //             <Text >Grade: {student.grade}</Text>
    //             <Text >Subject: {student.subject}</Text>
    //             <Text >City: {student.city}</Text>
    //             <Text >Availability: N/A</Text>
    //
    //
    //             <Button
    //                 buttonStyle={styles.buttonStyle}
    //                 title={`See Student Availability`}
    //                 onPress={() =>  {
    //
    //                     var arr = this.props.currentStudents;
    //                     console.log("current students: ");
    //                     console.log(arr);
    //                     if (typeof arr == "undefined") {
    //                         arr = [];
    //                     }
    //                     arr.push(student.key);
    //
    //                     connectStudentTutor(student.key, this.props.uid, arr);
    //                     this.props.navigation.state.params.onNavigateBack(this);
    //                     this.props.navigation.goBack();
    //                 }}
    //             />
    //
    //         </Card>
    //     })
    // }

    renderAvailability(times) {
      return times.map((time, i) => {

          return (<CheckBox title={time} checked={this.state.checked}
                onPress={() => {
                  console.log(time + " checked");
                  // IF SELECTED NOW:
                  // add this time to an array of times
                  // increment count
                  // ELSE:
                  // remove from array of times
                  // decrement count
                }} />);
      });
    }

    render() {
        return(
            <ScrollView>
              {this.renderAvailability(["Mon 3 - 4 pm", "Tues 7 - 8 pm", "Wed 3 - 4 pm"])}
              <Button style={styles.standardButton} disabled={true} // want this enabled when count is valid, disabled when not
                    title={'Tutor Student at Selected Times'}
                    onPress={() => {
                      // only enabled when the correct number of times are selected
                      var arr = this.props.currentStudents;
                      console.log("current students: ");
                      console.log(arr);
                      if (typeof arr == "undefined") {
                          arr = [];
                      }
                      arr.push(student.key);

                      connectStudentTutor(student.key, this.props.uid, arr);
                      setTimeout(function() {
                        this.props.navigation.state.params.onNavigateBack(this);
                        this.props.navigation.goBack();
                      }, 500);
                      this.props.navigation.goBack();
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
    }
}


// we want to have the tutor data and the student data
function mapStateToProps(state, props) {
    return {
        currentStudents: state.tutorReducer.studentIDs,
        uid: state.tutorReducer.data.uid,
        //student: // todo
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTime);

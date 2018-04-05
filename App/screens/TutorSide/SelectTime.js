import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {connectStudentTutor} from "../../FirebaseManager";

class SelectTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableTimes: this.props.navigation.state.params.studentData.availability,
      checked: [],
      numChecked: 0,
      studentId: this.props.navigation.state.params.studentData.key
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
              {this.renderAvailability(this.state.availableTimes)}
              <Button style={styles.standardButton} disabled={this.state.numChecked !== 1 && this.state.numChecked !== 2} // want this enabled when count is valid, disabled when not
                    title={'Tutor Student at Selected Times'}
                    onPress={() => {
                      // only enabled when the correct number of times are selected
                      var arr = this.props.currentStudents;
                      if (typeof arr == "undefined") {
                          arr = [];
                      }
                      arr.push(this.state.studentId);

                      connectStudentTutor(this.state.studentId, this.props.uid, arr);
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
    }
}


// we want to have the tutor data and the student data
function mapStateToProps(state, props) {
    return  {
        currentStudents: state.tutorReducer.studentIDs,
        uid: state.tutorReducer.data.uid
        //student: // todo
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTime);

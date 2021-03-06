import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Card, Button } from 'react-native-elements';

import * as Actions from '../../actions';

class TutorHome extends Component {


    constructor(props) {
        super(props);
        this.handleReRender = this.handleReRender.bind(this);

        this.state = {
            refreshing: false,
        }
    }

    handleReRender() {
        this.setState({ refreshing: true });
        this.props.loadUserThenTutorData();
        this.setState({ refreshing: false });
    }

    componentWillMount() {
        console.log(this.props);
    }

    componentWillReceiveProps(nextProps) {
        console.log("will receive");
        console.log(nextProps);
        this.setState({ refreshing: false });
    }

    renderSubjects(subs) {
      var subjects = '';
      if (subs == undefined) return '';
      if (subs.length == 1) return subs[0];
      subs.map((sub) => {
        subjects = subjects + ", " + sub;
      });
      return subjects.substring(2);
    }

    renderTimes(times) {
      var t = '';
      if (times.length == 1) return times[0];
      times.map((time) => {
        t = t + ", " + time;
      });
      return t.substring(2);
    }

    renderCards(students) {
        if (!Array.isArray(students)) {
            return null;
        }

        if (students.length === 0) {
            return <Card title={'No Students Yet'}>
                <Button
                    buttonStyle={styles.buttonStyle}
                    title={'Select a Student'}
                    onPress={() => this.props.navigation.navigate('SelectStudent', { onNavigateBack: this.handleReRender, fromSettings: false })}
                />

            </Card>
        }

        return students.map((student) => {
            console.log("STUDENT MAP");
            console.log(student);
            return <Card title={`Your student: ${student.name}`}>
                <Text style={styles.smallTextStyle}>Subject(s): {this.renderSubjects(student.subjects)}</Text>
                <Text style={styles.smallTextStyle}>Address: {student.address}</Text>
                <Text style={styles.smallTextStyle}>Time: {this.renderTimes(student.chosenTimes)}</Text>

                <Button
                    buttonStyle={styles.buttonStyle}
                    title={`Message ${student.name}`}
                    onPress={() => this.props.navigation.navigate('Messaging', { uid: this.props.uid, convoKey: student.convoKey, otherPersonName: student.name, otherPersonUID: student.uid} )}
                />

            </Card>
        })
    }

    render() {
        if (this.props.incomplete_profile) {
            return (
                <View
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleReRender}
                  />}
                >
                    <Card
                    title={"Incomplete Profile"}
                >
                    <Text>Hey there! We noticed you didn't complete your profile. Until you do so, we won't be able to match you with students. Press the button below to continue!</Text>
                    <Button
                        title={"Finish Sign Up"}
                        onPress={() => this.props.navigation.navigate('SignUp', { uid: this.props.data.uid, goBack: true })}
                        buttonStyle={styles.buttonStyle}
                    />
                </Card>

                </View>
            );
        }

      else if (this.props.data.frozen === true) {
        return (<View
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleReRender}
            />}
          >
          <Text style={{fontStyle: 'italic', textAlign: 'center', marginTop: 150}}>Once you are approved by our team, you will be able to choose students to tutor and see their info here!</Text>
          </View>);
      }

        else return(
            <ScrollView style={{ paddingBottom: 10 }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleReRender}
                />
              }>

                {this.renderCards(this.props.students)}

            </ScrollView>
        );


    }
}

const styles = {
    buttonStyle: {
        paddingRight: '15%',
        paddingLeft: '15%',
        marginTop: 10,
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
    },
    smallTextStyle: {
      margin: 5
    }

}

function mapStateToProps(state, props) {
    return {
        data: state.tutorReducer.data,
        students: state.tutorReducer.data.students,
        uid: state.tutorReducer.data.uid,
        address: state.tutorReducer.data.address,
        incomplete_profile: state.tutorReducer.incomplete_profile,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorHome);

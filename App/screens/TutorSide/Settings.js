import React, { Component } from 'react';
import { View, Text, StyleSheet, Button as RNButton, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class TutorSettings extends Component {


    render() {
      if (this.props.data.frozen === true) {
        return (
          <View style={styles.container}>
            <Button style={styles.buttonStyle}
                title={"Sign Out"}
                onPress={() => this.props.signOut()}
            />
          </View>
        );
      }

        return(
            <View style={styles.container}>

                <Button style={styles.buttonStyle}
                  title={"Approve Timesheet"}
                  onPress={() => console.log("approving timesheet")}
                />

                <Button style={styles.buttonStyle}
                    title={"Find New Students"}
                    onPress={() => this.props.navigation.navigate('SelectStudent', { onNavigateBack: this.componentDidMount })}
                />

                <Button style={styles.buttonStyle}
                    title={"Sign Out"}
                    onPress={() => this.props.signOut()}
                />


            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        flexDirection: 'column',
    },
    buttonStyle: {
      margin: 20
    }
});

function mapStateToProps(state, props) {
    return {
      data: state.tutorReducer.data
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorSettings);

import React, { Component } from 'react';
import { View, Text, StyleSheet, Button as RNButton, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class TutorSettings extends Component {


    render() {
        return(
            <View style={styles.container}>
                <Text>Tutor settings</Text>

                <Button
                    title={"Find New Students"}
                    onPress={() => this.props.navigation.navigate('SelectStudent', { onNavigateBack: this.componentDidMount })}
                />

                <Button
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
        justifyContent: 'space-around',
        flexDirection: 'column',
    }
});

function mapStateToProps(state, props) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorSettings);
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "./../../actions";

class TutorLPHome extends Component {


    openLearningPlan = (student) => {
        console.log(student);

        this.props.navigation.navigate('LearningPlan', { data: student.learningPlan, studentuid: student.uid, title: student.name })
    }

    render() {
        return (
            <FlatList
                data={this.props.data.students}
                renderItem={(data) => {
                    return(
                        <View>
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => this.openLearningPlan(data.item)}
                            >
                                <Text>{data.item.name}</Text>
                                <Icon name={'angle-right'} size={18} color={'gray'} />

                            </TouchableOpacity>
                        </View>
                    );
                }}

            />
        );
    }

}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        padding: 20,
        borderColor: 'lightgray',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

function mapStateToProps(state, props) {
    return {
        data: state.tutorReducer.data,
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in our actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(TutorLPHome);
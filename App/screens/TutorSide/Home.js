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
    }

    componentWillMount() {
        console.log(this.props);
    }

    componentWillReceiveProps(nextProps) {
        console.log("will receive");
        console.log(nextProps);
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
                    onPress={() => this.props.navigation.navigate('SelectStudent', { onNavigateBack: this.handleReRender })}
                />

            </Card>
        }

        return students.map((student) => {
            return <Card title={`Your student: ${student.name}`}>
                <Button
                    buttonStyle={styles.buttonStyle}
                    title={`Message ${student.name}`}
                    onPress={() => this.props.navigation.navigate('Messaging', { uid: this.props.uid, convoKey: student.convoKey, otherPersonName: student.name, otherPersonUID: student.uid} )}
                />

            </Card>
        })
    }

    render() {
        return(
            <ScrollView style={{ paddingBottom: 10 }}>

                {this.renderCards(this.props.students)}

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
    }

}

function mapStateToProps(state, props) {
    return {
        data: state.tutorReducer.data,
        students: state.tutorReducer.data.students,
        uid: state.tutorReducer.data.uid,
        address: state.tutorReducer.data.address,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorHome);
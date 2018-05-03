import React, { Component } from 'react';
import { View, Text, StyleSheet, Button as RNButton, TextInput, Linking} from 'react-native';
import { Button } from 'react-native-elements';
import * as Actions from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class TutorSettings extends Component {


    render() {
      if (this.props.data.frozen === true) {
        return (
          <View style={styles.container}>
            <Button
                buttonStyle={styles.buttonStyle}
                title={"Contact Support"}
                onPress={() => Linking.openURL('mailto:info@itutoru.org?subject=App Support&body=')}
            />

            <Button
                buttonStyle={styles.buttonStyle}
                title={"FAQ"}
                onPress={() => this.props.navigation.navigate('WebView', { url: 'https://www.itutoru.org/faq'})}
            />
            <Button buttonStyle={styles.buttonStyle}
                title={"Sign Out"}
                onPress={() => this.props.signOut()}
            />
          </View>
        );
      }

        return(
            <View style={styles.container}>

                <Button buttonStyle={styles.buttonStyle}
                    title={"Find New Students"}
                    onPress={() => this.props.navigation.navigate('SelectStudent', { onNavigateBack: this.componentDidMount, fromSettings: true })}
                />

                <Button buttonStyle={styles.buttonStyle}
                    title={"Sign Out"}
                    onPress={() => this.props.signOut()}
                />

                <Button
                    buttonStyle={styles.buttonStyle}
                    title={"Contact Support"}
                    onPress={() => Linking.openURL('mailto:info@itutoru.org?subject=App Support&body=')}
                />

                <Button
                    buttonStyle={styles.buttonStyle}
                    title={"FAQ"}
                    onPress={() => this.props.navigation.navigate('WebView', { url: 'https://www.itutoru.org/faq'})}
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
      margin: 20,
      backgroundColor: '#0093ff'
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

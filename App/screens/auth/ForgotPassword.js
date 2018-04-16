import React, { Component } from 'react';
import { View, Text, Button as RNButton } from 'react-native'
import SimpleFormComponent from "../../components/SimpleFormComponent";
import {Button, Header} from "react-native-elements";
import {resetPassword} from "../../FirebaseManager";


class ForgotPassword extends Component {

    state = {
        email: '',
    }

    componentWillMount() {
        console.log(this.props.navigation.state.params);

        const {email} = this.props.navigation.state.params;
        this.setState({ email });
    }

    render() {
        return(
            <View style={styles.containerStyle}>
                <Header
                    leftComponent={<RNButton title={'Close'} onPress={() => this.props.navigation.goBack()}/>}
                    backgroundColor={'white'}
                />
                <Text style={styles.textStyle}>Enter your email below, and we'll send you an email to reset your password</Text>
                <SimpleFormComponent
                    title={"Email"}
                    keyboard={'email-address'}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                />
                <Button
                    title={"Send email"}
                    onPress={() => {
                        resetPassword(this.state.email);
                        this.props.navigation.goBack();
                    }}
                    buttonStyle={styles.buttonStyle}
                />

            </View>

        );
    }
}

const styles = {
    buttonStyle: {
        backgroundColor: '#0093ff',
        borderRadius: 20,
        marginBottom: 20,
    },
    textStyle: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 16,
        margin: 10,
    },
    containerStyle: {
        backgroundColor: 'white',
        height: '100%'
    }
}

export default ForgotPassword

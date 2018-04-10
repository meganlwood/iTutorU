import React, { Component } from 'react';
import {View, Text, TextInput} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const MultilineSimpleFormComponent = (props) => {

    return (
        <View>
            <FormLabel>{props.title}</FormLabel>
            <TextInput
                onChangeText={(text) => props.onChangeText(text)}
                secureTextEntry={props.secure}
                keyboardType={props.keyboard}
                spellCheck={props.spellcheck}
                value={props.value}
                multiline={true}
                style={styles.textInput}
            />
            <FormValidationMessage>{props.errorMessage}</FormValidationMessage>
        </View>
    );

}

const styles = {
    textInput: {
        borderColor: 'lightgray',
        margin: 20,
        borderWidth: 1,
        height: 100,
        color: 'gray'
    }
}

export default MultilineSimpleFormComponent;
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const SimpleFormComponent = (props) => {

    return(
        <View>
            <FormLabel>{props.title}</FormLabel>
            <FormInput
                onChangeText={(text) => props.onChangeText(text)}
                secureTextEntry={props.secure}
                keyboardType={props.keyboard}
                spellCheck={props.spellcheck}
            />
            <FormValidationMessage>{props.errorMessage}</FormValidationMessage>
        </View>
    );


}

export default SimpleFormComponent;
import React, { Component } from 'react';
import { View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

class MultipleSelect extends Component {

    /*
        props:

        items
        uniqueKey
        onSelectedItemsChange
        selectText
        placeholderText
        color
        submitButtonText

     */

    multiSelect = null;

    state = {
        selectedItems: []
    }

    onSelectedItemsChange = selectedItems => {
        console.log(selectedItems);

        this.setState({ selectedItems });
        this.props.onSelectedItemsChange(selectedItems);
    };

    render() {
        return(
            <View style={this.props.outerStyle}>
                <MultiSelect
                    hideTags
                    items={this.props.items}
                    uniqueKey={this.props.uniqueKey}
                    ref={(component) => { this.multiSelect = component }}
                    selectedItems={this.state.selectedItems}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectText={this.props.selectText}
                    searchInputPlaceholderText={this.props.placeholderText}
                    onChangeInput={ (text)=> console.log(text)}
                    tagRemoveIconColor={this.props.color}
                    tagBorderColor={this.props.color}
                    tagTextColor={this.props.color}
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor={this.props.color}
                    submitButtonText={this.props.submitButtonText}
                />
                <View>
                    {this.multiSelect != null? this.multiSelect.getSelectedItemsExt(this.state.selectedItems) : <View />}
                </View>


            </View>
        );


    }


}

export default MultipleSelect;
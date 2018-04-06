import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

class SelectAvailability extends Component {

    state = {
        chosenTimes: [],
        possibilities: [],
        checkBoxStates: [],
        dayIndex: 0,
    }

    componentWillMount() {
        var possibilities = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 2; j < 8; j++) {
                var day = i == 0? "Mon" : i==1? "Tues" : i==2? "Wed" : i==3? "Thurs" : "Fri";
                possibilities.push(day + " " + j + ":00 PM");
            }
        }

        var checkBoxStates = [];
        for (var i = 0; i < possibilities.length; i++) {
            checkBoxStates.push(false);
        }

        const { data } = this.props.navigation.state.params;
        if (data) {
            data.map((item) => {
                possibilities.map((p, i) => {
                    if (item == p) {
                        checkBoxStates[i] = true;
                    }
                })
            })
        }

        this.setState({ checkBoxStates, possibilities, dayIndex: 0 });


    }

    toggleCheckBox(index) {
        this.state.checkBoxStates[index] = !this.state.checkBoxStates[index];
        this.setState(this.state);
    }

    renderBoxes() {
        // return this.state.possibilities.map((item, index) => {
        //     return (
        //         <CheckBox
        //             checked={this.state.checkBoxStates[index]}
        //             onPress={() => this.toggleCheckBox(index)}
        //             text={this.state.possibilities[index]}
        //             disabled={false}
        //         />
        //     );
        // })
        var numOptionsPerDay = this.state.possibilities.length / 5;
        var start = this.state.dayIndex * numOptionsPerDay;

        var options = this.state.possibilities.slice(start, start + numOptionsPerDay);

        return (
            <Card
                title={days[this.state.dayIndex]}
            >
                {options.map((item, index) => {
                    return (
                        <CheckBox
                            checked={this.state.checkBoxStates[index + start]}
                            onPress={() => this.toggleCheckBox(index + start)}
                            title={options[index]}
                        />
                    )
                })}
                <View style={styles.buttonViewStyle}>
                    {this.state.dayIndex == 0 && <View style={{ width: 150 }}></View>}
                { this.state.dayIndex != 0 && <Button
                    title={`<- ${days[this.state.dayIndex - 1]}`}
                    onPress={() => this.setState({ dayIndex: this.state.dayIndex - 1})}
                    buttonStyle={styles.buttonStyle}
                /> };
                    {this.state.dayIndex == 4 && <View style={{ width: 150 }}></View>}

                    {this.state.dayIndex != 4 &&
                <Button
                    title={`${days[this.state.dayIndex + 1]} ->`}
                    onPress={() => this.setState({dayIndex: this.state.dayIndex + 1})}
                    buttonStyle={styles.buttonStyle}
                />
                }

                </View>

            </Card>

        );

    }


    render() {
        return(
            <ScrollView>

                {this.renderBoxes()}

                <Button
                    title={"Done"}
                    buttonStyle={styles.doneButtonStyle}
                    onPress={() => {
                        var avail = [];
                        this.state.checkBoxStates.map((item, index) => {
                            if (item == true) {
                                avail.push(this.state.possibilities[index]);
                            }
                        })

                        this.props.navigation.state.params.callback(avail);
                        this.props.navigation.goBack()
                    }}
                />

            </ScrollView>
        );
    }
}

const styles = {
    buttonStyle: {
        backgroundColor: '#0093ff',
        borderRadius: 20,
        width: 150,
    },
    doneButtonStyle: {
        marginTop: 20,
        backgroundColor: '#0093ff',
        borderRadius: 20,
    },
    buttonViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
}

export default SelectAvailability;
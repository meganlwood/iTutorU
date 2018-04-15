import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TextInput,
    Button as RNButton,
    KeyboardAvoidingView
} from 'react-native';
import { Card, Header, Button } from 'react-native-elements';
import FlatListWithEnd from 'react-native-flatlist-with-end';
import CardWithTextInput from '../components/CardWithTextInput';
import CheckBox from '../components/CheckBox';
import {addCard, onCardMarkComplete, onChangeTitle, onUpdateTasks} from "../FirebaseManager";

class LearningPlanItem extends Component {
    state = {
        editing: false,
        text: '',
    }

    renderCard(item) {
        if (this.state.editing) {
            return(
                <CardWithTextInput isTextInput={true} headerText={item.title} onChangeHeaderText={(text) => this.props.onChangeTitle(text)}>
                    {item.list.map((i, index) => {
                        return (
                            <View style={{ padding: 5, borderWidth: 1, borderRadius: 5, borderColor: 'gray', marginBottom: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <CheckBox onPress={() => this.props.onItemMarkComplete(index)} checked={i.complete} text={i.description} textWidth={200}/>
                                <Button
                                    title={"Del"}
                                    buttonStyle={
                                        [styles.littleButtonStyle, {
                                            backgroundColor: 'red',
                                            marginRight: 5
                                        }]
                                    }
                                    onPress={() => this.props.onRemoveTask(index)}
                                />
                            </View>
                        );

                    })}
                    <View style={{ padding: 10, borderWidth: 1, borderRadius: 5, borderColor: 'gray', marginBottom: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ text: text })}
                            value={this.state.text}
                            placeholder={"New item..."}
                            style={{ width: 200}}
                        />
                        <Button
                            title={"Add"}
                            buttonStyle={styles.littleButtonStyle}
                            onPress={() => {
                                this.props.onAddTask(this.state.text);
                                this.setState({ text: '' })
                            }}
                        />
                    </View>

                    {/*<Button title={"Change Title"} buttonStyle={[styles.buttonStyle, { alignSelf: 'center', width: 300 }]} onPress={() => this.onPressChangeTitle()}/>*/}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button title={"Save Plan"} buttonStyle={[styles.buttonStyle]} onPress={() => {
                            console.log("PROPS!!!! " + JSON.stringify(this.props));
                            this.setState({editing: false});
                            this.props.doneEditing();
                        }} />
                        <Button title={"Mark Complete"} buttonStyle={[styles.buttonStyle] } onPress={() => this.props.onCardMarkComplete()}/>
                    </View>

                </CardWithTextInput>
            );
        }

        if (item.complete === false) {
            return(
                <CardWithTextInput headerText={item.title}>
                    {item.list.map((i, index) => {
                        return (
                        <View style={{ paddingTop: index==0? 0 : 15  }}>
                            <CheckBox disabled={true} text={i.description} checked={i.complete} textWidth={'90%'}/>
                        </View>);
                    })}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button title={"Edit Plan"} buttonStyle={styles.buttonStyle} onPress={() => this.setState({editing: true})}/>
                        <Button title={"Mark Complete"} buttonStyle={styles.buttonStyle} onPress={() => this.props.onCardMarkComplete()}/>
                    </View>
                </CardWithTextInput>
            );
        }
        else {
            return (
                <CardWithTextInput headerText={item.title} containerStyle={{backgroundColor: 'lightgray'}}>
                    {item.list.map((i) => {
                        return <CheckBox disabled={true} text={i.description} checked={i.complete} textWidth={'90%'}/>
                    })}
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        {/*<Button title={"Complete"} buttonStyle={styles.buttonStyle} onPress={() => this.props.onCardMarkComplete()} />*/}

                    </View>
                </CardWithTextInput>
            );
        }
    }

    render() {
        if (this.props.edit) this.state.editing = true;

        return(
            this.renderCard(this.props.lpitem.item)
        );
    }
}

class LearningPlan extends Component {

    static navigationOptions = ({ navigation }) => ({
       title: `${navigation.state.params.title}`,
       headerTitleStyle: { textAlign: 'center', alignSelf: 'center'},
       headerStyle: {
           backgroundColor: 'white'
       }
    });

    state = {
        data: [],
        nextIndex: 1,
        currentlyEditing: null,
        studentuid: '',
    }

    componentWillMount() {
        const { data, studentuid } = this.props.navigation.state.params;
        this.setState({ data, studentuid, nextIndex: data.length });
    }

    addCard() {
        var newCard = {
            title: "New Card",
            list: [],
            complete: false,
            index: this.state.nextIndex
        }

        this.state.data.push(newCard);
        this.state.currentlyEditing = this.state.nextIndex;
        this.state.nextIndex = this.state.nextIndex + 1;
        this.setState(this.state);

        //update in firebase
        addCard(this.state.studentuid, newCard, newCard.index);

    }

    pressedSave(index) {
        onChangeTitle(this.state.studentuid, index, this.state.data[index].title);
        onUpdateTasks(this.state.studentuid, index, this.state.data[index].list);


    }

    onCardMarkComplete(index) {
        this.state.data[index].complete = true;
        this.setState(this.state);

        //update in firebase
        onCardMarkComplete(this.state.studentuid, index);

    }

    onItemMarkComplete(cardIndex, itemIndex) {
        var prevValue = this.state.data[cardIndex].list[itemIndex].complete;

        this.state.data[cardIndex].list[itemIndex].complete = !prevValue;
        this.setState(this.state);
    }

    onAddTask(cardIndex, task) {
        var task = {
            description: task,
            complete: false,
        }

        var ind = this.state.data[cardIndex].list.length;
        this.state.data[cardIndex].list.push(task);
        this.setState(this.state);
    }

    onRemoveTask(cardIndex, index) {
        this.state.data[cardIndex].list.splice(index, 1);
        this.setState(this.state);
    }

    onChangeTitle(index, title) {
        this.state.data[index].title = title;
        this.setState(this.state);
    }

    render() {
        return(
            <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={30}>
                <FlatListWithEnd
                    data={this.state.data}
                    renderItem={(item) => {
                        return(
                            <LearningPlanItem
                                lpitem={item}
                                onCardMarkComplete={() => {
                                    this.onCardMarkComplete(item.item.index);
                                }}
                                onItemMarkComplete={(itemIndex) => this.onItemMarkComplete(item.item.index, itemIndex)}
                                onAddTask={(task) => this.onAddTask(item.item.index, task)}
                                onRemoveTask={(index) => this.onRemoveTask(item.item.index, index)}
                                edit={
                                    this.state.currentlyEditing === item.item.index ? true : false
                                }
                                doneEditing={() => {
                                    this.setState({ currentlyEditing: null });
                                    this.pressedSave(item.item.index);
                                }}
                                onChangeTitle={(title) => this.onChangeTitle(item.item.index, title)}
                            />
                        );

                    }
                    }
                    extraData={this.state}
                    renderEndComponent={() => {
                        return(
                            <Button title={"New Card"} buttonStyle={[styles.buttonStyle, { alignSelf: 'center', marginBottom: 20 }]} onPress={() => this.addCard()} ></Button>
                        );
                    }
                    }
                />

            </KeyboardAvoidingView>
        );


    }

}

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#0093ff',
        width: 150,
        borderRadius: 10
    },
    littleButtonStyle: {
        backgroundColor: '#0093ff',
        width: 55,
        height: 30,
        borderRadius: 5,
        padding: 0
    }
});

export default LearningPlan;

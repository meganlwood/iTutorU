import React, { Component } from 'react';
import {Text, View} from "react-native";
import {initialize} from "./FirebaseManager";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "./actions";

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import ParentHome from './screens/ParentSide/Home';
import TutorHome from './screens/TutorSide/Home';
import LoginScreen from "./screens/auth/LoginScreen";
import Messaging from './screens/Messaging';
import TutorLPHome from "./screens/TutorSide/TutorLPHome";
import LearningPlan from "./screens/LearningPlan";
import CalendarScreen from './screens/CalendarScreen';
import TutorSettings from './screens/TutorSide/Settings';
import SelectStudent from "./screens/TutorSide/SelectStudent";
import SelectTime from './screens/TutorSide/SelectTime';
import CreateAccount from './screens/auth/CreateAccount';
import SignUpParent from "./screens/auth/SignUpParent";
import SignUpTutor from "./screens/auth/SignUpTutor";
import ParentLPHome from "./screens/ParentSide/ParentLPHome";
import ParentSettings from "./screens/ParentSide/Settings";
import SelectAvailability from "./screens/auth/SelectAvailability";
import ForgotPassword from "./screens/auth/ForgotPassword";
import SignUpNewStudent from './screens/ParentSide/SignUpNewStudent';
import WebViewPage from './components/WebViewPage';
import ChangeEmail from './screens/ChangeEmail';

const TutorHomeStack = StackNavigator({
    Home: { screen: TutorHome },
    Messaging: { screen: Messaging },
    SelectStudent: { screen: SelectStudent },
    SelectTime: { screen: SelectTime },
    SignUp: { screen: SignUpTutor },
});

const TutorLearningPlanStack = StackNavigator({
    LPHome: { screen: TutorLPHome, navigationOptions: { title: "Learning Plans"}},
    LearningPlan: { screen: LearningPlan }
})

const TutorSettingsStack = StackNavigator({
    Settings: { screen: TutorSettings },
    SelectStudent: { screen: SelectStudent },
    SelectTime: { screen: SelectTime },
    WebView: { screen: WebViewPage }
})

const ParentLearningPlanStack = StackNavigator({
    LPHome: { screen: ParentLPHome, navigationOptions: { title: "Learning Plans"}},
    LearningPlan: { screen: LearningPlan }
});

const SignUpStack = StackNavigator(
    {
        SignUpParent: { screen: SignUpParent},
        SelectAvailability: { screen: SelectAvailability, tabBarHidden: true }
    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);

const ParentHomeStack = StackNavigator({
    Home: { screen: ParentHome },
    Messaging: { screen: Messaging },
    //SignUp: { screen: SignUpStack }
    SignUp: { screen: SignUpParent},
    SelectAvailability: { screen: SelectAvailability, tabBarHidden: true }
});

const ForgotPassStack = StackNavigator({
    SendEmail: { screen: ForgotPassword }
}, { headerMode: 'none', mode: 'modal' });

const SignUpNewStudentStack = StackNavigator({
  SignUpStudent: { screen: SignUpNewStudent },
  SelectAvailability: { screen: SelectAvailability }
}, {
  headerMode: 'none'
});

const ParentSettingsStack = StackNavigator({
    ParentSettingsHome: { screen: ParentSettings },
    SignUpNewStudent: { screen: SignUpNewStudentStack },
    WebView: { screen: WebViewPage },
    ChangeEmail: { screen: ChangeEmail }
});



//will be modal
// const AuthStack = StackNavigator(
//     {
//         Login: { screen: LoginScreen },
//         CreateAccount: { screen: CreateAccount },
//         SignUpParent: { screen: SignUpStack },
//         SignUpTutor: { screen: SignUpTutor },
//         ForgotPassword: { screen: ForgotPassStack }
//     },
//     {
//         headerMode: 'none',
//         mode: 'modal',
//     }
// );
//
// const SignUpStack = StackNavigator(
//     {
//         SignUpParent: { screen: SignUpParent},
//         SelectAvailability: { screen: SelectAvailability }
//     },
//     {
//         headerMode: 'none',
//         mode: 'modal',
//     }
// );

const AuthStackCard = StackNavigator(
    {
        Login: { screen: LoginScreen },
        SignUpParent: { screen: SignUpStack },
        SignUpTutor: { screen: SignUpTutor },
    },
    {
        headerMode: 'none',
        mode: 'card'
    }
);

const AuthStackModal = StackNavigator(
    {
        Home: AuthStackCard,
        ForgotPassword: { screen: ForgotPassword },
        CreateAccount: { screen: CreateAccount },
    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);

const LoggedInTutor = TabNavigator({
    Home: {
        screen: TutorHomeStack,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-home'} color={tintColor} size={25} />
            },
        }
    },
    LearningPlan: {
        screen: TutorLearningPlanStack,
        navigationOptions: {
            tabBarLabel: "LearningPlan",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-bulb'} color={tintColor} size={25} />
            }
        }
    },
    Calendar: {
        screen: CalendarScreen,
        navigationOptions: {
            tabBarLabel: "Calendar",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-calendar'} color={tintColor} size={25} />
            }
        }
    },
    Settings: {
        screen: TutorSettingsStack,
        navigationOptions: {
            tabBarLabel: "Settings",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-settings'} color={tintColor} size={25} />
            }
        }
    }
});

const LoggedInParent = TabNavigator({
    Home: {
        screen: ParentHomeStack,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-home'} color={tintColor} size={25} />
            },
        }
    },
    LearningPlan: {
        screen: ParentLearningPlanStack,
        navigationOptions: {
            tabBarLabel: "Learning Plan",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-bulb'} color={tintColor} size={25} />
            }
        }
    },
    Calendar: {
        screen: CalendarScreen,
        navigationOptions: {
            tabBarLabel: "Calendar",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-calendar'} color={tintColor} size={25} />
            }
        }
    },
    Settings: {
        screen: ParentSettingsStack,
        navigationOptions: {
            tabBarLabel: "Settings",
            tabBarIcon: ({ tintColor }) => {
                return <Icon name={'ios-settings'} color={tintColor} size={25} />
            }
        }
    }
});


const createRouter = ({signedIn, isTutor}) => {
    return StackNavigator(
        {
            LoggedOut: {
                screen: AuthStackModal
            },
            LoggedInTutor: {
                screen: LoggedInTutor
            },
            LoggedInParent: {
                screen: LoggedInParent
            }
        },
        {
            headerMode: 'none',
            initialRouteName: !signedIn? "LoggedOut" : isTutor? 'LoggedInTutor' : 'LoggedInParent',
        }
    );
}

const Route = (props) => {
    var Routing = createRouter(props);
    return (
        <Routing />
    );
}

export class Router extends Component {

    componentWillMount() {
        //this.props.signIn();
        initialize();
        this.props.isSignedIn();


    }

    componentWillReceiveProps(nextProps) {
        //change this to be like 'received data from fb'
        // if (nextProps.loaded) {
        //     this.setState({ loading: false });
        // }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.signedIn == false && nextProps.signedIn == true) {
    //         console.log("User is now signed in");
    //         return false;
    //     }
    //     else return true;
    // }

    renderItems() {
        if (!this.props.loaded) {
            return(
                <View>

                    <Text style={{marginTop: 250, marginLeft: 25, marginRight: 25, textAlign: 'center'}}>Loading...</Text>

                </View>
            );
        }
        else {
            return(
                <Route
                    signedIn={this.props.signedIn}
                    isTutor={this.props.isTutor}
                />
            );
        }
    }

    render() {
        console.log("Router render called");
        return(
            this.renderItems()
        );
    }



}

function mapStateToProps(state, props) {
    return {
        signedIn: state.authReducer.signedIn,
        loaded: state.authReducer.loaded,
        isTutor: state.authReducer.userType == 'tutor'? true : false
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in our actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Router);

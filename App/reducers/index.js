import { combineReducers } from 'redux';

import { CALENDAR, DATA_AVAILABLE, SIGN_IN_SUCCESS_TUTOR, SIGN_IN_FAIL, SIGN_IN_SUCCESS_PARENT, IS_SIGNED_IN, NOT_SIGNED_IN, TUTOR_DATA, PARENT_DATA, INCOMPLETE_PARENT_PROFILE, MESSAGES, LOADED_SUBJECTS, INCOMPLETE_TUTOR_PROFILE } from "../actions/"

let authState = { signedIn: false, userType: '', loaded: false, error: '', subjects: [] };

let tutorData =
    {
        data: {},
        studentIDs: [],

        //data has the shape
        /*
        uid: '',
        students: [
            {
                uid: '',
                name: '',
                subject: '',
                grade: ''

            }
            ],
        address: '',
        subjects: []
        */
    };

let parentData =
    {
        data: {},
        incomplete_profile: false,
    };

let messageData = {
    allMessages: {}, // { key1: [], key2: [] }
    hasMessages: false,
}

let calData = {
  cal: {},
}

const calReducer = (state = calData, action) => {
  switch(action.type) {
    case CALENDAR:
      console.log(action);
      console.log(action.cal);
      return { ...state, cal: action.cal };
    default:
      return state;
  }
}

const messagingReducer = (state = messageData, action) => {
    switch(action.type) {
        case MESSAGES:
            var convoKey = action.convoKey;
            var newAll = state.allMessages;
            newAll[convoKey] = action.data;
            console.log(newAll);
            return { allMessages: newAll, numMessages: newAll[convoKey].length };
        default:
            return state;
    }
}

const parentReducer = (state = parentData, action) => {
    switch(action.type) {
        case PARENT_DATA:
            return { ...state, data: action.data, incomplete_profile: false }
        case INCOMPLETE_PARENT_PROFILE:
            return { ...state, incomplete_profile: true, data: action.data }
        default:
            return state;
    }
}

const tutorReducer = (state = tutorData, action) => {
    switch (action.type) {
        case TUTOR_DATA:
            console.log(action.data);
            return { ...state, data: action.data, studentIDs: action.studentIDs };
        case INCOMPLETE_TUTOR_PROFILE:
            return { ...state, incomplete_profile: true, data: action.data }
        default:
            return state;
    }
}

const authReducer = (state = authState, action) => {
    console.log(action.type);

    switch (action.type) {
        case SIGN_IN_SUCCESS_TUTOR:
            return { ...state, signedIn: true, userType: 'tutor', loaded: true }
        case SIGN_IN_SUCCESS_PARENT:
            return { ...state, signedIn: true, userType: 'parent', loaded: true }
        case SIGN_IN_FAIL:
            if (action.error.match(/.*password.*/)) {
                action.error = "Incorrect password.";
            }
            if (action.error.match(/.*user.*/)) {
                action.error = "This email does not match any account in our databases.";
            }
            return { ...state, signedIn: false, loaded: true, error: action.error }
        case IS_SIGNED_IN:
            return { ...state, signedIn: true, loaded: true, userType: action.userType }
        case NOT_SIGNED_IN:
            return { ...state, signedIn: false, loaded: true }
        case LOADED_SUBJECTS:
            return { ...state, subjects: action.subjects }
        default:
            return state;
    }
}

// Combine all the reducers
const rootReducer = combineReducers({
    tutorReducer,
    authReducer,
    parentReducer,
    messagingReducer,
    calReducer
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
})

export default rootReducer;

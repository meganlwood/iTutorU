import { combineReducers } from 'redux';

import { DATA_AVAILABLE, SIGN_IN_SUCCESS_TUTOR, SIGN_IN_FAIL, SIGN_IN_SUCCESS_PARENT, IS_SIGNED_IN, NOT_SIGNED_IN, TUTOR_DATA, PARENT_DATA, INCOMPLETE_PARENT_PROFILE, MESSAGES } from "../actions/"

//let dataState = { uid: '', data: [], userType: '' };
let authState = { signedIn: false, userType: '', loaded: false, error: '' };

let tutorData =
    {
        data: {},
        // TODO: enter in database and pull
        subjectsMap: {},
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

const messagingReducer = (state = messageData, action) => {
    switch(action.type) {
        case MESSAGES:
            var convoKey = action.convoKey;
            var newAll = state.allMessages;
            newAll[convoKey] = action.data;
            console.log(newAll);
            return { ...state, allMessages: newAll, hasMessages: true };
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
            return { ...state, signedIn: true, userType: 'parent', loaded: true}
        case SIGN_IN_FAIL:
            return { ...state, signedIn: false, loaded: true, error: action.error }
        case IS_SIGNED_IN:
            return { ...state, signedIn: true, loaded: true, userType: action.userType }
        case NOT_SIGNED_IN:
            return { ...state, signedIn: false, loaded: true }
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
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
})

export default rootReducer;
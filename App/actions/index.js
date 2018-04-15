import {
    getLoggedInUserPromise, getTutor, signIn as FBSignIn, userType, getParent, signOut as FBSignOut,
    getStudent, getStudentsWithoutTutor, createParent, createStudent, createTutor,
    getMessage, getSubjects, getStudentAndUID
} from "../FirebaseManager";
import firebase from "firebase";
import {generateConvoKey, mergeCalendar} from "../Util";


export const DATA_AVAILABLE = 'DATA_AVAILABLE';
export const IS_SIGNED_IN = 'IS_SIGNED_IN';
export const NOT_SIGNED_IN = 'NOT_SIGNED_IN';
export const SIGN_IN_SUCCESS_TUTOR = 'SIGN_IN_SUCCESS_TUTOR';
export const SIGN_IN_SUCCESS_PARENT = 'SIGN_IN_SUCCESS_PARENT';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const TEST = 'TEST';
export const TUTOR_DATA = 'TUTOR_DATA';
export const INCOMPLETE_PARENT_PROFILE = 'INCOMPLETE_PARENT_PROFILE';
export const PARENT_DATA = 'PARENT_DATA';
export const MESSAGES = 'MESSAGES';
export const NO_MESSAGES = 'NO_MESSAGES';
export const LOADED_SUBJECTS = 'LOADED SUBJECTS';
export const INCOMPLETE_TUTOR_PROFILE = 'INCOMPLETE_TUTOR_PROFILE';
export const CALENDAR = 'CALENDAR';


// Called from Router. First action called when the app opens. Checks if the user is logged in, and if so loads the appropriate data.
export function isSignedIn() {
    return (dispatch) => {
        getLoggedInUserPromise().then(user => {
            userType(user.uid).then(type => {
                if (type === 'tutor') {
                    getTutor(user.uid).then(res => {
                        dispatch({ type: IS_SIGNED_IN, userType: 'tutor' });
                        loadTutorData(dispatch, user.uid, res);
                    })
                }
                else if (type === 'parent') {
                    getParent(user.uid).then(res => {
                        dispatch({ type: IS_SIGNED_IN, userType: 'parent', data: res, uid: user.uid });
                        loadParentData(dispatch, user.uid, res);
                    })
                }
            })
        }).catch(() => {
            loadSubjects(dispatch);
            dispatch({ type: NOT_SIGNED_IN });
        })
    }

}

// Function for loading Tutor Data when user uid is not known
export function loadUserThenTutorData() {
    return (dispatch) => {
        getLoggedInUserPromise().then(user => {
            getTutor(user.uid).then(res => {
                loadTutorData(dispatch, user.uid, res);
            }).catch(error => {
                console.log(error);
            })
        })
    }
}

// Function for loading Parent Data when user uid is not known
export function loadUserThenParentData() {
    return (dispatch) => {
        getLoggedInUserPromise().then(user => {
            getParent(user.uid).then(res => {
                loadParentData(dispatch, user.uid, res);
            })
        }).catch(error => {
            console.log(error);
        });

    }
}

// Internal function to load Tutor Data
function loadTutorData(dispatch, uid, tutorData) {
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

    // If name="null", this means the tutor has created an account, but does not have a completed application.
    if (tutorData.name === "null") {
        loadSubjects(dispatch);
        dispatch({ type: INCOMPLETE_TUTOR_PROFILE, data: { uid }});
    }
    else {
        var resdata = {
            uid: uid,
            students: [],
            address: tutorData.city,
            subjects: tutorData.subjects,
            unmatchedStudents: [],
            frozen: tutorData.frozen,
            tutorName: tutorData.name,
            //calendar: tutorData.calendar
        }

        getStudentsWithoutTutor().then(res => {
            resdata.unmatchedStudents = res;
            dispatch({ type: TUTOR_DATA, data: resdata, studentIDs: tutorData.students });
        })

        var students = tutorData.students;
        var calendar = [];

        for (var i in students) {
            getStudentAndUID(students[i]).then(res => {
                var convoKey = generateConvoKey(uid, res.uid);
                var data = res.data;

                if (students[i] == undefined) console.log("NOT COMMENTED OUT");
                else console.log("COMMENTED OUT");

                resdata.students.push({
                    uid: res.uid,
                    name: data.studentName,
                    subject: data.subject,
                    address: data.city,
                    learningPlan: data.learningPlan,
                    convoKey: convoKey,
                });

                if (data.calendar != undefined) {
                  calendar.push(data.calendar);
                }

                if (resdata.students.length === students.length) {
                    dispatch({ type: TUTOR_DATA, data: resdata, studentIDs: tutorData.students });

                    if (tutorData.calendar == undefined) {
                      if (calendar.length > 0) {
                        var cal = calendar[0];
                        for (var i = 1; i < calendar.length; i++) {
                          cal = mergeCalendar(cal, calendar[i]);
                        }
                        dispatch({ type: CALENDAR, cal: cal });
                      }
                    }
                    else {
                      dispatch({ type: CALENDAR, cal: tutorData.calendar });
                    }
                }
            })
        }
    }

}

function loadParentData(dispatch, uid, parentData) {
    var studentArr = parentData.students;

    //finish this
    var resdata = {
        uid: uid,
        students: [
            //{
                // uid: '',
                // tutor: {
                //     uid: '',
                //     name: '',
                //     convoKey: '',
                // }
            //}
        ],

    }

    if (parentData.parentName === "null") {
        dispatch({ type: INCOMPLETE_PARENT_PROFILE, data: { uid } });
    }
    else {
        // Load each student's information
        var calendar = [];

        for (var i = 0; i < studentArr.length; i++) {
            var studentID = studentArr[i];
            getStudent(studentID).then(studentRes => {
                var tutorUID = studentRes.tutor;
                studentRes.uid = studentID;
                if (studentRes.calendar != undefined) calendar.push(studentRes.calendar);

                if (tutorUID) {
                    getTutor(tutorUID).then(tutorRes => {
                        var convoKey = generateConvoKey(studentID, tutorUID);
                        studentRes.tutor = { uid: tutorUID, name: tutorRes.name, convoKey: convoKey };
                        resdata.students.push(studentRes);
                        if (resdata.students.length == studentArr.length) {
                            var cal = [];
                            for (var i = 1; i < calendar.length; i++) {
                                cal = mergeCalendar(cal, calendar[i]);
                            }
                            dispatch({ type: CALENDAR, cal: cal });

                            dispatch({ type: PARENT_DATA, data: resdata });
                        }
                    })
                }
                else {
                    resdata.students.push(studentRes);
                    console.log(resdata);
                    if (resdata.students.length == studentArr.length) {
                        dispatch({ type: PARENT_DATA, data: resdata });
                    }
                }

            })
        }
    }
}


// Called when a parent completes their profile.
export function signUpParent(uid, parentName, phoneNumber, studentName, subject, grade, address, availability, weeklySess) {
    return (dispatch) => {
        createParent(uid, parentName, phoneNumber).then(() => {
            createStudent(uid, studentName, subject, grade, address, availability, weeklySess).then(() => {
                getParent(uid).then(res => {
                    loadParentData(dispatch, uid, res);
                    dispatch({ type: SIGN_IN_SUCCESS_PARENT });
                })
            })
        });
    }
}

// Called when a tutor completes their application.
export function signUpTutor(uid, name, phoneNumber, experience, degree, subjects, city) {
    return (dispatch) => {
        createTutor(uid, name, phoneNumber, experience, degree, subjects, city).then(() => {
            getTutor(uid).then(res => {
                loadTutorData(dispatch, uid, res);
                dispatch({ type: SIGN_IN_SUCCESS_TUTOR });
            })
        })
    }
}

// Called from LoginScreen
export function signInUser(email, password) {
    return (dispatch) => {
        FBSignIn(email, password).then(user => {
            userType(user.uid).then(type => {
                if (type === 'tutor') {
                    getTutor(user.uid).then(data => {
                        loadTutorData(dispatch, user.uid, data);
                    })
                    dispatch({ type: SIGN_IN_SUCCESS_TUTOR });
                }
                else if (type === 'parent') {
                    getParent(user.uid).then(data => {
                        loadParentData(dispatch, user.uid, data);
                    })
                    dispatch({ type: SIGN_IN_SUCCESS_PARENT });
                }
             })
        }).catch(error => {
            dispatch({ type: SIGN_IN_FAIL, error: error });
        })
    }
}

// Signs out currently logged in user.
export function signOut() {
    return (dispatch) => {
        FBSignOut().then(res => {
            loadSubjects(dispatch);
            dispatch({ type: NOT_SIGNED_IN });
        })
    }
}

// Load messages between two users (identified by convokey).
export function loadMessages(convoKey) {
    return (dispatch) => {
        firebase.database().ref('conversations/' + convoKey).on('value', function(snapshot) {
            if (snapshot.val() != null) {
                //loaded new messages
                console.log("there are messages");
                var messages = snapshot.val();
                console.log(messages);
                var messageData = [];
                for (var i = 0; i < messages.length; i++) {
                    console.log("looking at message: " + i);
                    getMessage(messages[i]).then(mes => {
                        messageData.push(mes);
                        console.log(JSON.stringify(messageData));
                        console.log("messageDatalen: " + messageData.length);
                        if (messageData.length == messages.length) {
                            //sort messagedata by timestamp
                            messageData.sort(compareTimeStamps);

                            dispatch({ type: MESSAGES, data: messageData, convoKey: convoKey });
                        }
                    })
                }
            }
            else {
                dispatch({ type: NO_MESSAGES, convoKey: convoKey });
            }
        })
    }



}

export function addCalendar(cal) {
  return (dispatch) => {
    dispatch({ type: "CAL", cal: cal});

  }

}

// Loads the subjects for the Tutor sign up form.
function loadSubjects(dispatch) {
    getSubjects().then(subjects => {
        dispatch({ type: LOADED_SUBJECTS, subjects: subjects });
    });
}

// Function used to sort messages by timestamp.
function compareTimeStamps(a, b) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else return 1;

    return 0;
}

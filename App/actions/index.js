import {
    getLoggedInUserPromise, getTutor, signIn as FBSignIn, userType, getParent, signOut as FBSignOut,
    getStudentsForTutor, getStudent, getStudentsWithoutTutor, createUser, createParent, createStudent, createTutor,
    getMessage
} from "../FirebaseManager";
import firebase from "firebase";
import {generateConvoKey} from "../Util";


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

// export function loadMessages(convokey) {
//
// }

//called from router
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
                        console.log("get parent res: ");
                        console.log(res);
                        dispatch({ type: IS_SIGNED_IN, userType: 'parent', data: res, uid: user.uid });
                        loadParentData(dispatch, user.uid, res);
                    })
                }
            })
        }).catch(() => {
            dispatch({ type: NOT_SIGNED_IN });
        })
    }

}

export function loadUserThenTutorData() {
    console.log("load user then tutor data");
    return (dispatch) => {
        console.log("inside dispatch");
        getLoggedInUserPromise().then(user => {
            getTutor(user.uid).then(res => {
                console.log("tutor res: ");
                console.log(res);
                loadTutorData(dispatch, user.uid, res);
            }).catch(error => {
                console.log("THERE WAS AN ERROR AND WE COULDN'T LOAD TUTOR DATA");
                console.log(error);
            })
        })
    }
}

export function loadUserThenParentData() {
    console.log("load user then parent data");
    return (dispatch) => {
        console.log("inside dispatch");
        getLoggedInUserPromise().then(user => {
            getParent(user.uid).then(res => {
                console.log("was able to get parent");
                console.log(res);

                loadParentData(dispatch, user.uid, res);
            })
        }).catch(error => {
            console.log("THERE WAS AN ERROR AND WE COULDN'T LOAD PARENT DATA");
            console.log(error);
        });

    }
}

//called from signIn function above
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
    console.log("args: ");
    console.log(dispatch);
    console.log(uid);
    console.log(tutorData);


    var resdata = {
        uid: uid,
        students: [],
        address: tutorData.city,
        subjects: tutorData.subjects,
        unmatchedStudents: []
    }

    getStudentsWithoutTutor().then(res => {
        resdata.unmatchedStudents = res;
        dispatch({ type: TUTOR_DATA, data: resdata, studentIDs: tutorData.students });
    })

    var students = tutorData.students;

    for (var i in students) {
        //console.log("getting " + s);
        var convoKey = generateConvoKey(uid, students[i]);
        getStudent(students[i]).then(data => {
            resdata.students.push({
                uid: students[i],
                name: data.studentName,
                subject: data.subject,
                address: data.city,
                learningPlan: data.learningPlan,
                convoKey: convoKey,
            });

            if (resdata.students.length === students.length) {
                dispatch({ type: TUTOR_DATA, data: resdata, studentIDs: tutorData.students });
            }
        })
    }

    //right now this is assuming students is just one student not an array
}

function loadParentData(dispatch, uid, res) {
    console.log("res in loadparentdata: ");
    console.log(res);

    var studentArr = res.students;

    //finish this
    var resdata = {
        uid: uid,
        students: [
            //{
                // uid: '',
                // tutor: {
                //     uid: '',
                //     name: ''
                // }
            //}
        ],

    }

    if (res.parentName === "null") {
        dispatch({ type: INCOMPLETE_PARENT_PROFILE, data: { uid } });
    }
    else {
        for (var i = 0; i < studentArr.length; i++) {
            var studentID = studentArr[i];
            getStudent(studentID).then(studentRes => {
                var tutorUID = studentRes.tutor;
                studentRes.uid = studentID;
                if (tutorUID) {
                    console.log("getting tutor");
                    getTutor(tutorUID).then(tutorRes => {
                        var convoKey = generateConvoKey(studentID, tutorUID);
                        studentRes.tutor = { uid: tutorUID, name: tutorRes.name, convoKey: convoKey };
                        resdata.students.push(studentRes);
                        if (resdata.students.length == studentArr.length) {
                            dispatch({ type: PARENT_DATA, data: resdata });
                        }
                    })
                }
                else {
                    console.log("no tutor");
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



export function signUpParent(uid, parentName, phoneNumber, studentName, subject, grade, address) {
    return (dispatch) => {
        createParent(uid, parentName, phoneNumber).then(() => {
            createStudent(uid, studentName, subject, grade, address).then(() => {
                getParent(uid).then(res => {
                    loadParentData(dispatch, uid, res);
                    dispatch({ type: SIGN_IN_SUCCESS_PARENT });
                })
            })
        });
    }
}

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


export function signInUser(email, password) {

    return (dispatch) => {
        FBSignIn(email, password).then(user => {
            console.log("id: " + user.uid);
            userType(user.uid).then(type => {
                console.log(type);
                if (type === 'tutor') {
                    console.log("dispatched");
                    //loadUserThenTutorData();
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
            console.log("can't sign in");
            console.log(error);

            dispatch({ type: SIGN_IN_FAIL, error: error });
        })
    }
}

export function signOut() {
    return (dispatch) => {
        FBSignOut().then(res => {
            dispatch({ type: NOT_SIGNED_IN });
        })
    }
}

export function loadMessages(convoKey) {
    console.log("in load messages");
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

function compareTimeStamps(a, b) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else return 1;

    return 0;
}


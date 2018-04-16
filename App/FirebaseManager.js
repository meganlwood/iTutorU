import firebase from "firebase";

const config = {
    apiKey: "AIzaSyBsjlF4FNxju6ise_-PRyyD2ZhPVwyoev4",
    authDomain: "itutoru-ef7e2.firebaseapp.com",
    databaseURL: "https://itutoru-ef7e2.firebaseio.com",
    projectId: "itutoru-ef7e2",
    storageBucket: "itutoru-ef7e2.appspot.com",
    messagingSenderId: "115499384435"
};

var config2 = {
    apiKey: "AIzaSyDIEOu99SaPq8TSdT_ep2EqrzhaDUFJ36Y",
    authDomain: "itutoru-megan-refactor.firebaseapp.com",
    databaseURL: "https://itutoru-megan-refactor.firebaseio.com",
    projectId: "itutoru-megan-refactor",
    storageBucket: "itutoru-megan-refactor.appspot.com",
    messagingSenderId: "842705651129"
};

export function initialize() {
    firebase.initializeApp(config2);
}

export function signIn(email, password) {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                resolve(user);
            })
            .catch((error) => {
                reject(error.message);
            });
    })
}

export function createUser(email, password) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                resolve(user);
            })
            .catch((error) => {
                reject(error.message);
            });
    })
}

export function getLoggedInUserPromise() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user != null) {
                resolve(user);
            } else {
                // No user is signed in.
                reject(null);
            }
        });
    })
}

export function createBlankParent(email, password) {
    return new Promise((resolve, reject) => {
        createUser(email, password).then(user => {
            console.log("creating blank account");

            firebase.database().ref('parents/' + user.uid).set({
                //Placeholder for how we know there is no account info
                parentName: "null",
                email: email,
            });
            resolve(user.uid);
        }).catch(error => {
           reject(error);
        });
    })
}

export function createBlankTutor(email, password) {
    return new Promise((resolve, reject) => {
        createUser(email, password).then(user => {
            firebase.database().ref('tutors/' + user.uid).set({
                name: "null",
                email: email,
            });
            resolve(user.uid);
        }).catch(error => {
            reject(error);
        });
    })
}

export function createParent(uid, parentName, phoneNumber) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('parents/' + uid).update({
            parentName: parentName,
            phoneNumber: phoneNumber,
        });
        resolve(true);
    })
}

export function createTutor(uid, name, phoneNumber, experience, degree, subjects, city, institution) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('tutors/' + uid).update({
            name: name,
            phone: phoneNumber,
            exp: experience,
            degree: degree,
            subjects: subjects,
            city: city,
            frozen: true,
            institution: institution,
        });
        resolve(true);
    })
}

export function createStudent(parentUID, studentName, subject, grade, address, availability, weeklySess, otherInfo) {
    // Set student's information

    var defaultLP = {
        0: {
            complete: false,
            index: 0,
            list: {
                0: {
                    complete: false,
                    description: 'Tap \'Edit Plan\' to make changes',
                },
                1: {
                    complete: false,
                    description: 'Structuring learning plan cards by weekly tasks is a good start'
                },
                2: {
                    complete: false,
                    description: 'Don\'t forget to edit the learning plan card title!',
                }
            },
            title: 'Sample Learning Plan'
        }
    }

    return new Promise((resolve, reject) => {
        var studentRef = firebase.database().ref('students/').push();
        studentRef.set({
            studentName: studentName,
            subject: subject,
            grade: grade,
            address: address,
            learningPlan: defaultLP,
            availability: availability,
            weeklySessions: weeklySess,
            paidSessions: 0,
            otherInfo: otherInfo,
        })

        // Add student to parent
        firebase.database().ref('parents/' + parentUID + '/students').once('value', function(snapshot) {
            var arr = []
            if (snapshot.val()) arr = snapshot.val();

            console.log("arr: ");
            console.log(arr);
            arr.push(studentRef.key);
            firebase.database().ref('parents/' + parentUID).update({
                students: arr,
            }).then(resolve(true));
        });
    })


}


export function userType(uid) {
    return new Promise((resolve, reject) => {
        var ref = firebase.database().ref('tutors');
        ref.once("value").then(snapshot => {
            console.log("tutors database: ");
            console.log(snapshot);

            if (snapshot.child(uid + "").exists()) {
                resolve('tutor');
                ref.off();
                //Router = createRootNavigator(true, true);
            }
            else {
                resolve('parent');
                //Router = createRootNavigator(true, false);
            }
        });
    })
}

export function getTutor(uid) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('tutors/' + uid).once('value', function(snapshot) {
            resolve(snapshot.val());
        })
    });
}

export function getParent(uid) {
    console.log("getting parent for uid: " + uid);
    return new Promise((resolve, reject) => {
        firebase.database().ref('parents/' + uid).once('value', function(snapshot) {
            resolve(snapshot.val());
        })
    });
}

export function signOut() {
    return new Promise((resolve, reject) => {
        firebase.auth().signOut().then(resolve(true));
    })
}


export function getStudent(uid) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('students/' + uid).once('value', function(snapshot) {
            resolve(snapshot.val());
        })
    })
}

export function getStudentAndUID(uid) {
  return new Promise((resolve, reject) => {
      firebase.database().ref('students/' + uid).once('value', function(snapshot) {
          resolve({uid: uid, data: snapshot.val()});
      })
  })
}

export function getStudentsWithoutTutor() {
    return new Promise((resolve, reject) => {
        firebase.database().ref('students').orderByChild('tutor').equalTo(null).once('value', function(snapshot) {
            var returnVal = [];
            snapshot.forEach(function(childSnap) {
                var item = childSnap.val();
                item.key = childSnap.key;
                returnVal.push(item);
            })
            resolve(returnVal);
        })
    });
}

export function connectStudentTutor(student, tutor_id, currentStudents) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('tutors/' + tutor_id).update({
            students: currentStudents
        });
        firebase.database().ref('students/' + student.key).update({
            tutor: tutor_id,
            chosenTimes: student.chosenTimes
        });

        resolve(true);
    })
}

//Learning Plan
export function addCard(studentuid, cardItem, index) {
    firebase.database().ref('students/' + studentuid + "/learningPlan").update({
        [index] : cardItem,
    })
}

export function onUpdateTasks(studentuid, cardIndex, tasks) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/list'] : tasks,
    });
}

export function onCardMarkComplete(studentuid, cardIndex) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/complete'] : true,
    })
}

export function onChangeTitle(studentuid, cardIndex, title) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/title'] : title,
    })
}

export function addMessage(convoKey, message, fromID, toID) {
    var messageRef = firebase.database().ref('messages/').push();
    messageRef.set({
        to: toID,
        from: fromID,
        message: message.text,
        timestamp: message.createdAt.toLocaleString()
    });
    var convoRef = firebase.database().ref('conversations/' + convoKey);
    convoRef.once('value', function(snapshot) {
        var messagesArr = snapshot.val();
        if (messagesArr === null) messagesArr = [];
        messagesArr.push(messageRef.key);
        firebase.database().ref("conversations/").update({
            [convoKey]: messagesArr,
        });
    });
}

export function getMessage(messageId) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('messages/' + messageId).once('value', function(snapshot) {
            var mes = snapshot.val();
            resolve({ to: mes.to, message: mes.message, timestamp: mes.timestamp });
        })
    })
}

export function loadMessages(convoKey) {
    return new Promise((resolve, reject) => {
        firebase.database().ref('conversations/' + convoKey).once('value', function(snapshot) {
            if (snapshot.val() != null) {
                //loaded new messages
                var messages = snapshot.val();
                var messageData = [];
                for (var i = 0; i < messages.length; i++) {
                    getMessage(messages[i]).then(mes => {
                        messageData.push(mes);
                        if (messageData.length == messages.length) {
                            resolve(messageData);
                        }
                    })
                }
            }
            else {
                resolve([]);
            }
        })
    })
}

export function resetPassword(email) {
    return new Promise((resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            resolve(true);
        }).catch(error => {
            reject(error.message);
        })
    })
}

export function getSubjects() {
    console.log("getting subjects");
    return new Promise((resolve, reject) => {
        firebase.database().ref('subjects').once('value', function(snapshot) {
            resolve(snapshot.val());
        })
    })
}

export function updateStudentCalendar(uid, cal) {
  console.log("update calendar for user: " + uid);
  return new Promise((resolve, reject) => {
      firebase.database().ref('students/' + uid).update({
          calendar: cal
      });
      resolve(true);
  })
}

export function updateTutorCalendar(uid, cal) {
  console.log("update calendar for user: " + uid);
  return new Promise((resolve, reject) => {
      firebase.database().ref('tutors/' + uid).update({
          calendar: cal
      });
      resolve(true);
  })
}

// export function changeEmail(user, newemail) {
//   return new Promsie((resolve, reject) => {
//     user.updateEmail(newemail).then(resolve(true)).catch(error => {
//       reject(error);
//     })
//   })
// }

// export function getTutorCalendar(uid, cal) {
//   console.log("getting tutor " + uid + " calendar");
//
// }

import * as application from "firebase-admin/app"
import * as database from "firebase-admin/firestore"

let exists = application.getApp("server")

const firebase = exists ?? application.initializeApp({
    credential: application.applicationDefault(),
    databaseURL: 'https://mwrl-7b27f-default-rtdb.firebaseio.com',
    databaseAuthVariableOverride: {
      uid: process.env.APIKEY
    }
  }, "server");
  
  let db =database.getFirestore(firebase)
  if(!exists) {
  db.settings({
    ignoreUndefinedProperties: true
  })
}
  export default db
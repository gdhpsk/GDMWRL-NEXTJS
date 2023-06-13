import * as application from "firebase-admin/app"
import * as database from "firebase-admin/firestore"
import * as auth from "firebase-admin/auth"

let apps = application.getApps().length
const firebase = apps ? application.getApp("server") : application.initializeApp({
    credential: application.cert({
        projectId: process.env.project_id,
        privateKey: process.env.private_key?.replaceAll("\\n", "\n")?.replaceAll("\n", "\n"),
        clientEmail: process.env.client_email
    }), 
    databaseURL: 'https://mwrl-7b27f-default-rtdb.firebaseio.com',
    databaseAuthVariableOverride: {
      uid: process.env.APIKEY
    }
  }, "server");
  
  let db =database.getFirestore(firebase)
  if(!apps) {
  db.settings({
    ignoreUndefinedProperties: true
  })
}
  export default db
  export const authentication = auth.getAuth(firebase)
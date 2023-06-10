import * as application from "firebase-admin/app"
import * as database from "firebase-admin/firestore"

let apps = application.getApps().length
console.log(process.env.private_key?.replace("\n", "/\n"))
const firebase = apps ? application.getApp("server") : application.initializeApp({
    credential: application.cert({
        projectId: process.env.project_id,
        privateKey: process.env.private_key?.replace("\\n", "\n")?.replace("\n", "\n"),
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
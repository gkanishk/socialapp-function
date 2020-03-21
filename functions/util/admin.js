var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require('../keys/admin.json')),
    storageBucket: "socialapp-72822.appspot.com"
});

const db=admin.firestore();
module.exports={admin,db};
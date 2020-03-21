const functions = require('firebase-functions');
const app=require('express')();
const {getAllScreams,postOneScream,getScream,commentOnScream,likeScream,unlikeScream,deleteScream}=require('./handlers/screams');
const {signUp,login,uploadImage,addUserDetails,getAuthenticatedUser,markNotificationRead,getUserDetail}=require('./handlers/users');
const FBAuth=require("./util/fbAuth");
const {db}=require('./util/admin');
//Scream route
app.get('/screams',getAllScreams);
app.post('/scream',FBAuth,postOneScream);
app.get('/scream/:screamId',getScream);
app.post('/scream/:screamId/comments',FBAuth,commentOnScream);
//TODO delete routw
app.delete('/scream/:screamId',FBAuth,deleteScream)
app.get('/scream/:screamId/like',FBAuth,likeScream);
app.get('/scream/:screamId/unlike',FBAuth,unlikeScream);
app.get('/user/:handle',getUserDetail);
app.post('/notifications',FBAuth,markNotificationRead)
//Signup route
app.post('/signup',signUp);

//sign-in route
app.post('/login',login);
//upload image
app.post('/user/image',FBAuth,uploadImage);
//user details
app.post('/user',FBAuth,addUserDetails);
app.get("/user",FBAuth,getAuthenticatedUser);

exports.api=functions.region('asia-east2').https.onRequest(app);
exports.createNotificationOnLike=functions.region('asia-east2').firestore.document('likes/{id}')
.onCreate((snapshot)=>{
db.doc(`/screams/${snapshot.data().screamId}`).get()
.then(doc=>{
    if(doc.exists&& doc.data().userHandle!== snapshot.data().userHandle){
        return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt:new Date().toISOString(),
            recipient:doc.data().userHandle,
            sender:snapshot.data().userHandle,
            type:'like',
            read:false,
            screamId:doc.id
        })
    }
})
.catch((err)=> console.error(err));})
exports.deleteNotificationOnUnlike=functions
.region('asia-east2')
.firestore.document('likes/{id}')
.onDelete((snapshot)=>
{
    return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(err=>console.error(err))     
})
exports.createNotificationOnComment=functions
.region("asia-east2")
.firestore.document('comments/{id}')
.onCreate((snapshot)=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
.then(doc=>{
    if(doc.exists&& doc.data().userHandle!== snapshot.data().userHandle){
        return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt:new Date().toISOString(),
            recipient:doc.data().userHandle,
            sender:snapshot.data().userHandle,
            type:'comment',
            read:false,
            screamId:doc.id
        });
    }
})
.then(()=>{
    return;
})
.catch((err)=>{
    console.error(err);
    return;
});});

exports.onUserImageChange=functions.region('asia-east2').firestore.document('/users/{userId}')
.onUpdate((change)=>{
    console.log(change.before.data());
    console.log(change.after.data());
    if(change.before.data().imageUrl!==change.after.data().imageUrl){
        console.log('image has changed');
        let batch=db.batch();
    return db.collection('screams').where('userHandle','==',change.before.data().handle).get()
    .then(data=>{
        data.forEach(doc=>{
            const scream=db.doc(`/screams/${doc.id}`);
            batch.update(scream,{userImage:change.after.data().imageUrl});
        })
        return batch.commit();
    })
    }
    else return true;
})
exports.onScreamDelete=functions.region('asia-east2').firestore.document('/screams/{screamId}')
.onDelete((snapshot,context)=>{
    const screamId=context.params.screamId;
    const batch=db.batch();
    return db.collection('comments').where('screamId','==',screamId).get()
    .then(data=>{
            data.forEach(doc=>{
                batch.delete(db.doc(`/comments/${doc.id}`));
            })
            return db.collection('likes').where('screamId','==',screamId).get();
        }
    )
    .then(data=>{
        data.forEach(doc=>{
            batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('screamId','==',screamId).get();
    }
)
.then(data=>{
    data.forEach(doc=>{
        batch.delete(db.doc(`/notifications/${doc.id}`));
    })
    return batch.commit();
})
.catch(err=>{
    console.error(err);
})
})
let db={
    users:[
        {
            userId:'7ZeVMGphryCBP18YPsqw',
            email:'user@email.com',
            handle:'user',
            createdAt:'2020-02-20T10:39:33.373Z',
            imageUrl:'image/sdfsdfsdfs/sfsdfs',
            bio:'Hello,my name is user,nice to meet you',
            website:'https://user.com',
            location:'Chandigarh, India'
        }
    ],
    comments:[
        {
            userHandle:'user',
            screamId:'dhvs23roiniww4f',
            body:"nice scream  ",
            createdAt:"2020-02-20T10:39:33.373Z"

        }
    ],
    screams: [
        {
            userHandle:'user',
            body:'This is a sample scream',
            createdAt:'2020-02-20T10:39:33.373Z',
            likeCount:5,
            commentCount:3

        }
    ]
};
const userDetails={
    //REdux data
    credentials:{
            userId:'dhvs23roiniww4f',
            email:'user@email.com',
            handle:'user',
            createdAt:'2020-02-20T10:39:33.373Z',
            imageUrl:'image/sdfsdfsdfs/sfsdfs',
            bio:'Hello,my name is user,nice to meet you',
            website:'https://user.com',
            location:'Chandigarh, India'
    },
    likes:[
        {
            userHandle:"user",
            screamId:"7ZeVMGphryCBP18YPsqw"
        },
        {
            userHandle:"user",
            screamId:"nenecfuwenbffeq"
        }
    ]
}
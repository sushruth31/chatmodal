# realtimechat
Add this cool real time chat modal to your app powered by firebase to allow cross-user communication!

Firebase firestore data structure to make this work: 

usersonline -> docs -> { _lastonline, email, firstname, lastname, profilepicsrc, role, uid, unreadMessages: {uid: count } }   -> subcollection sentMessages -> docs -> {message, sentFrom, sentTo, sentTime}

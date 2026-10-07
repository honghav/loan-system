importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBigHSwuf0s6wH5N7ra0nb1P6agM14roM4",
  authDomain: "feonone-site.firebaseapp.com",
  projectId: "feonone-site",
  storageBucket: "feonone-site.firebasestorage.app",
  messagingSenderId: "349031887807",
  appId: "1:349031887807:web:f0b08220b627b01faba70a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});

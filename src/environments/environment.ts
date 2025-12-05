// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { url } from "inspector";

export const environment = {
  production: false,
  url_backend: 'http://127.0.0.1:5000',
  url_security: 'https://bf430289-c6b2-4a1e-b688-bd2704570781.mock.pstmn.io',
  url_web_socket:'https://7f34ef5f-4e85-4cbb-84e4-8270962f9163.mock.pstmn.io',

  firebase: {
    apiKey: "AIzaSyC5Hu0Nj2DOZXEfMd3J5v0ERII_OSltnQg",
    authDomain: "proyecto-angular-14235.firebaseapp.com",
    projectId: "proyecto-angular-14235",
    storageBucket: "proyecto-angular-14235.firebasestorage.app",
    messagingSenderId: "1020262810828",
    appId: "1:1020262810828:web:f0ecba5ca0ff5c41f1ee69",
    measurementId: "G-RFB2K2LGWM"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { url } from "inspector";

export const environment = {
  production: false,
  url_backend: 'https://92c421ed-7c58-4dbf-ba96-06be0a4a6e51.mock.pstmn.io',
  url_security: 'https://bf430289-c6b2-4a1e-b688-bd2704570781.mock.pstmn.io',
  url_web_socket:'https://7f34ef5f-4e85-4cbb-84e4-8270962f9163.mock.pstmn.io'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

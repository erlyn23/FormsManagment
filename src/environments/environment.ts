// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoints: {
    account: "https://localhost:44329/Account",
    forms: "https://localhost:44329/api/Form",
    questionTypes: "https://localhost:44329/api/QuestionType",
    questions: "https://localhost:44329/api/Question",
    questionOptions: "https://localhost:44329/api/QuestionOption",
    answers: "https://localhost:44329/api/Answer",
    userFormAnswer: "https://localhost:44329/api/UserFormAnswer"
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

import csp from "./csp";

const clientAndServerConfig = (config) => ({
  client: config,
  server: config,
});

export const provideStateConfig = {
  intranetEnv: clientAndServerConfig({
    e0: 'e0',
    e1: 'e1',
    e2: 'e2',
    e3: 'e3',
  }),
};

export default {
  csp,
  provideStateConfig,
};

// import csp from "./csp";
// import buildContentSecurityPolicy from '@americanexpress/content-security-policy';

// const clientAndServerConfig = (config) => ({
//   client: config,
//   server: config,
// });


// export default {
//   csp: buildContentSecurityPolicy(),
//   provideStateConfig: {
//     myApiUrl: {
//       client: {
//         e1: 'https://api-dev.americanexpress.com',
//         e2: 'https://api-qa.americanexpress.com',
//         e3: 'https://api.americanexpress.com',
//       },
//       server: {
//         e1: 'https://api-dev.aexp.com',
//         e2: 'https://api-qa.aexp.com',
//         e3: 'https://api.aexp.com',
//       },
//     },
//   },
// };

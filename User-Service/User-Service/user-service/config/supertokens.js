const SuperTokens = require('supertokens-node');
const Session = require('supertokens-node/recipe/session');
const EmailPassword = require('supertokens-node/recipe/emailpassword');

SuperTokens.init({
    framework: 'express',
    supertokens: {
        connectionURI: "http://localhost:3567", // or your own URI
        apiKey: ''  // if you are using a free-tier hosted service
    },
    appInfo: {
        appName: 'User-Service',
        apiDomain: 'http://localhost:3000',
        websiteDomain: 'http://localhost:3000',
        apiBasePath: '/auth'
    },
    recipeList: [
        EmailPassword.init(),
        Session.init()
    ]
});

module.exports = SuperTokens;

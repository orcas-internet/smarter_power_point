module.exports = {
    app: {
        debug: false,
        port: 3001,
        admin: {
            username: 'admin',
            password: '1234' // please change at least this
        }
    },
    host: '10.149.2.100', // ip of Fritz!DECT 200
    user: 'configurator', // user to login
    pass: '',     // password to login
    delay: 100          // milliseconds between requests
};

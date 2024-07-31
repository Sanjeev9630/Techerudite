const { Validator } = require('node-input-validator')

module.exports ={ 
    registerAValidator: async function(dataObj) {
        let { firstName, lastName, email, password } = dataObj ;
        const v = new Validator(dataObj, {
            firstName: 'required|string',
            lastName: 'required|string',
            email: 'required|email',
            password: 'required'
        });

        let matched = await v.check();

        if(!matched){
            throw (v.errors)
        } else {
            return { firstName, lastName, email: email.toLowerCase(), password }
        }
    },
    
    loginAValidator: async function(dataObj) {
        let { email, password } = dataObj ;
        const v = new Validator(dataObj, {
            email: 'required|email',
            password: 'required',
        });

        let matched = await v.check();

        if(!matched){
            throw (v.errors)
        } else {
            return { email: email.toLowerCase(), password }
        }
    }
}
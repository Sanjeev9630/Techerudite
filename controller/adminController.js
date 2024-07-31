const adminValidator = require('../validator/adminValidator')
const authmiddleware = require('../utils/authmiddleware')
const commonHelpher = require("../utils/commonHelpher")
const db = require("../db")


const registerAController = async(req, res) => {
    try {
        const user = await adminValidator.registerAValidator(req.body)
        const { firstName, lastName, email, password } = req.body ;

        const existingUser = await db.query(`Select * from "user" where "email" = $1`, [email])
        if(existingUser.rowCount) return res.status(400).json({ message: "User already exists"})  

        const hashPass = await commonHelpher.hashPassword(password)

        const insertQuery = `Insert into "user" ("firstName", "lastName", "email", "password", "role") values ($1, $2, $3, $4, $5)`
        const values = [firstName, lastName, email, hashPass, 'admin']                  // to prevent from SQL injection
        const finalQuery = await db.query(insertQuery, values)

        const jwt_token = await authmiddleware.jwtToken({ email, role:"admin" })
        res.status(200).json({ message: "Admin registerd successfully", jwt_token })

        // We can also do the registration of both admin and customer in single API in that case we need to send role key from frontend depending on whether its registering from Admin page or Customer page.

    } catch (error) {
        res.status(400).json({ error, message: "Error In Admin Registration" })
    }
}

const loginAController = async(req, res) => {
    try {
        const userLogin = await adminValidator.loginAValidator(req.body)
        const { email, password } = req.body ;

        const existingAdmin = await db.query(`Select * from "user" where "email" = $1` , [email])
        if(!existingAdmin.rowCount) return res.status(400).json({ message: "Admin doesn't exist"})     
        
        if(existingAdmin.rows[0].role === 'customer') return res.status(400).json({ message: "You are not allowed to login from here"})
        
        const [{ email: userEmail, password: existPassword }] = existingAdmin.rows;   

        const comparePass = await commonHelpher.comparePassword(password, existPassword )
        if(!comparePass) return res.status(400).json({ message : "Invalid Credentials"})
   
        const jwt_token = await authmiddleware.jwtToken({ email, role:"admin" })
        res.status(200).json({ message: "Admin LoggedIn successfully", token: jwt_token })

    } catch (error) {
        res.status(400).json({ error, message: "Error In Admin Login" })
    }
}


module.exports = { 
    loginAController,
    registerAController
}
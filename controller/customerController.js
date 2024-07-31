const customerValidator = require('../validator/customerValidator')
const authmiddleware = require('../utils/authmiddleware')
const commonHelpher = require("../utils/commonHelpher")
const db = require("../db")


const registerCController = async(req, res) => {
    try {
        const user = await customerValidator.registerCValidator(req.body)
        const { firstName, lastName, email, password } = req.body ;

        const existingUser = await db.query(`Select * from "user" where "email" = $1`, [email])
        if(existingUser.rowCount) return res.status(400).json({ message: "User already exists"})  

        const hashPass = await commonHelpher.hashPassword(password)

        const insertQuery = `Insert into "user" ("firstName", "lastName", "email", "password", "role") values ($1, $2, $3, $4, $5)`
        const values = [firstName, lastName, email, hashPass, 'customer']                  // to prevent from SQL injection
        const finalQuery = await db.query(insertQuery, values)

        const jwt_token = await authmiddleware.jwtToken({ email, role:"customer" })
        res.status(200).json({ message: "Customer registerd successfully", jwt_token })

    } catch (error) {
        res.status(400).json({ error, message: "Error In Customer Registration" })
    }
}


module.exports = { 
    registerCController
}
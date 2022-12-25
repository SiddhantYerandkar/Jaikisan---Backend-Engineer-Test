const customermodel = require('../models/customerModel')
const jwt = require('jsonwebtoken')


function isValide(value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[A-Za-z ][A-Za-z _]{1,100}$/));
}
function isValideMobile(value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[0-9]{10}$/))
}
function isValideMobile(value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[0-9]{10}$/))
}
 
exports.createcustomer = async function (req, res) {
    try {
        const data = req.body

        const { firstName, lastName, mobileNumber, address, customerId, status, emailId, DOB } = data
        
        if (!firstName) { return res.status(400).send({ status: false, msg: "Please enter firstname" }) }
       
        if (!isValide(firstName)) { return res.status(400).send({ status: false, msg: "Please enter valid name" }) }
       
        if (!lastName) { return res.status(400).send({ status: false, msg: "Please enter lastname" }) }
       
        if (!isValide(lastName)) { return res.status(400).send({ status: false, msg: "Please enter lastname" }) }
       
        if (!mobileNumber) { return res.status(400).send({ status: false, msg: "Please enter mobileNumber" }) }
        if (!isValideMobile(mobileNumber)) { return res.status(400).send({ status: false, msg: "Please enter mobilenumber" }) }
        if (!isValideMobile(mobileNumber)) { return res.status(400).send({ status: false, msg: "please enter valid mobileNo." }) }
        
        if (!emailId) { return res.status(400).send({ status: false, msg: "Please enter emailid" }) } if (!emailId.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.status(400).send({ status: false, msg: "Please enter valide emailid" })
        }
        
        if (!DOB) { return res.status(400).send({ status: false, msg: "Please enter DOB" }) }
        if (!DOB.match(/((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})/)) { return res.status(400).send({ status: false, msg: "please enter DOB 'dd-mm-yyyy'" }) }
        
        if (!address) { return res.status(400).send({ status: false, msg: "Please enter address" }) }
        
        if (!status) { return res.status(400).send({ status: false, msg: "Please enter status" }) }
        
        if (!customerId) { return res.status(400).send({ status: false, msg: "Please enter customerid" }) }
        //-------------------------------------validetion----------------------------------------------// 
        
        if (!customerId.match(/[0-9]{4}-[0-9]{4}-[0-9]{3,10}/)) { return res.status(400).send({ status: false, msg: "Please enter customerid 'xxxx-xxxx-xxxx'" }) }

        const mobile = await customermodel.findOne({ mobileNumber: mobileNumber })
        if (mobile) { return res.status(400).send({ status: false, msg: "mobile number already present" }) }
        
        const email = await customermodel.findOne({ emailId: emailId })
        if (email) { return res.status(400).send({ status: false, msg: " emailId already present" }) }
        
        const customerid = await customermodel.findOne({ customerId: customerId })
        if (customerid) { return res.status(400).send({ status: false, msg: "customerid already exist" }) }

        const savedData = await customermodel.create(data)
        return res.status(201).send({ status: true, msg: "successfull", data: savedData })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


//========================== Login============================================================//
exports.logincustomer = async function (req, res) {
    try {
        const email = req.body.emailId
        const mobile = req.body.mobileNo
       
        if (!mobile) { return res.status(400).send({ status: false, msg: "Please enter mobileNumber" }) }
        if (!isValideMobile(mobile)) { return res.status(400).send({ status: false, msg: "please enter valid mobileNo." }) }
        const mobilexist = await customermodel.findOne({ mobileNumber: mobile })
        if (!mobilexist) { return res.status(400).send({ status: false, msg: "Please enter vaild mobile-No." }) }
        
        if (!email) { return res.status(400).send({ status: false, msg: "Please enter emailid" }) }
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.status(400).send({ status: false, msg: "Please enter valid emailid" })
        }
        const emailexis = await customermodel.findOne({ emailId: email })
        if (!emailexis) { return res.status(400).send({ status: false, msg: "Please enter vaild emailId" }) }
        
        const token = jwt.sign({
            customerId: mobilexist.customerId
        }, "secret-key")

        return res.status(201).send({ status: true, token: token })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


exports.getcustomer = async function (req, res) {
    try {
        const getdata = await customermodel.find({ isDeleted: false, status: 'Active' })
        return res.status(200).send({ status: true, msg: "all customer detail", data: getdata })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

exports.deletecustomer = async function (req, res) {
    try {
        const customerid = req.params.customerId

        const deletecustomer = await customermodel.findOneAndUpdate({ customerId: customerid }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        if (!deletecustomer) { return res.status(404).send({ status: false, msg: "customer is not found" }) }
        { return res.status(200).send({ status: true, msg: "customer deleted" }) }
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}
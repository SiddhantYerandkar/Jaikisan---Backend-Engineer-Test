const cardmodel = require('../models/cardModel');
const customerModel = require('../models/customerModel');

function isValidString(value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[A-Za-z ][A-Za-z _]{1,100}$/));
}

exports.createcard = async function (req, res) {
    try {
        const data = req.body

        if(Object.keys(data).length==0) return res.status(400).send({status: false, message: "Body is empty"})

        const { cardType, customerName, customerId } = data

        const customerid = await customerModel.findOne({ customerId: customerId })
        if (!customerid) { return res.status(404).send({ status: false, message : "customerid does not exist" })}
        if (!cardType) { return res.status(400).send({ status: false, message: "please enter cardtype" }) }
        if (!customerName) { return res.status(400).send({ status: false, message: "please enter customer" }) }
        if (!customerId) { return res.status(400).send({ status: false, message: "please enter customerid" }) }
        
        const arr = ['REGULAR', 'SPECIAL']
        if (!arr.includes(cardType)) { return res.status(400).send({ status: false, message: "Card type accepts only 'REGULAR','SPECIAL'" }) }
        if (!isValidString(customerName)) { return res.status(400).send({ status: false, message: "Invalid customer name" }) }
        if (!customerId.match(/[0-9]{4}-[0-9]{4}-[0-9]{3,10}/)) { return res.status(400).send({ status: false, message: "Please enter customerid 'xxxx-xxxx-xxxx'" }) }
        
        const customeridexist = await cardmodel.findOne({ customerId: customerId })
        if (customeridexist) { return res.status(400).send({ status: false, msg: "enter different customerId" }) }

        const savedata = await cardmodel.create(data)
        return res.status(201).send({ status: true, msg: "card create successfull", data: savedata })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

exports.getcards = async function (req, res) {
    try {
        const customerid = req.params.customerId
        
        if (!customerid.match(/[0-9]{4}-[0-9]{4}-[0-9]{3,10}/)) { return res.status(400).send({ status: false, msg: "Please enter customerid 'xxxx-xxxx-xxxx'" }) }
        const customerexit = await customerModel.findOne({ customerId: customerid, isDeleted: false })
        if (!customerexit) { return res.status(404).send({ status: false, msg: 'customer is not existing' }) }

        const getcards = await cardmodel.find({ isDeleted: false })
        return res.status(200).send({ status: true, data: getcards })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

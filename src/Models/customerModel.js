const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    DOB: {
        type: Date,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('customer', customerSchema)
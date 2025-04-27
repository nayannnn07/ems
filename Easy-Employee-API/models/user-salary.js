// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSalarySchema = new Schema({
//     employeeID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//     salary: {type: Number, default: 0},
//     bonus: {type: Number, default: 0},
//     reasonForBonus: {type: String, default: 'N/A'},
//     assignedDate: {type: String, required: true}
// });


// module.exports = mongoose.model('UserSalary', UserSalarySchema);

//Chnaged for assign salary section
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSalarySchema = new Schema({
    employeeID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grossSalary: { type: Number, default: 0 },           // Admin will input this
    basicSalary: { type: Number, default: 0 },           // Auto-calculate
    dearnessAllowance: { type: Number, default: 0 },     // Auto-calculate
    bonus: { type: Number, default: 0 },                 // Admin input
    reasonForBonus: { type: String, default: 'N/A' },
    providentFund: { type: Number, default: 0 },         // Auto-calculate
    socialSecurityFund: { type: Number, default: 0 },     // Auto-calculate
    totalDeductions: { type: Number, default: 0 },       // Auto-calculate
    netSalary: { type: Number, default: 0 },             // Auto-calculate
    assignedDate: { type: String, required: true }
});

module.exports = mongoose.model('UserSalary', UserSalarySchema);

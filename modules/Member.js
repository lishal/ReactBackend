const mongoose = require("mongoose");
const { Schema } = mongoose;
const MemberSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  address_nepal: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  postalTown: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  familyFullName: {
    type: String,
    required: true,
  },
  familyRelation: {
    type: String,
    required: true,
  },
  familydob: {
    type: String,
    required: true,
  },
  familyAddress: {
    type: String,
    required: true,
  },
  familyPhone: {
    type: String,
    required: true,
  },
  // photo: {
  //   data: Buffer,
  //   contentType: String,
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("member", MemberSchema);

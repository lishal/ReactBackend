const express = require("express");
const router = express.Router();
const Member = require("../modules/Member");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
require("dotenv").config();

const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.post(
  "/createMember",
  [
    body("fullname", "Name must be more then 3 characters!").isLength({
      min: 3,
    }),
    body("email", "Enter a valid Email").isEmail(),
    body("phoneNumber")
      .isInt()
      .withMessage("Phone Number must be in number only")
      .isLength({ min: 10, max: 10 })
      .withMessage("Invalid Phone Number!"),
    body("streetAddress", "Please Enter a valid Street Address").isLength({
      min: 3,
    }),
    body("address_nepal", "Please Enter a valid Address of Nepal").isLength({
      min: 3,
    }),
    body("dob", "Enter a valid Date of Birth").isDate(),
    body("postalTown", "Please Enter a valid Postal Town").isLength({
      min: 3,
    }),
    body("postalCode", "Please Enter a valid Postal Code").isLength({
      min: 3,
    }),
    body("familyFullName", "Please Enter Family Full Name").isLength({
      min: 5,
    }),
    body("familyRelation", "Please Enter the relation of the family").isLength({
      min: 3,
    }),
    body("familydob", "Please Enter the family DOB").isDate(),
    body("familyAddress", "Please Enter the Family Address").isLength({
      min: 5,
    }),
    body("familyPhone")
      .isInt()
      .withMessage("Phone Number must be in number only")
      .isLength({ min: 10, max: 10 })
      .withMessage("Please Enter valid Phone Number of family!"),
  ],
  upload.single("image"),
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { email, phoneNumber } = req.body;
    try {
      let member_email = await Member.findOne({ email });
      let member_phoneNumber = await Member.findOne({ phoneNumber });
      if (member_email) {
        return res
          .status(400)
          .json({ emailExist: "A member already exists with this email!" });
      } else if (member_phoneNumber) {
        return res
          .status(400)
          .json({
            numberExist: "A member already exists with this Phone Number!",
          });
      } else {
        member = await Member.create({
          fullname: req.body.fullname,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          streetAddress: req.body.streetAddress,
          address_nepal: req.body.address_nepal,
          dob: req.body.dob,
          postalTown: req.body.postalTown,
          postalCode: req.body.postalCode,
          familyFullName: req.body.familyFullName,
          familyRelation: req.body.familyRelation,
          familydob: req.body.familydob,
          familyAddress: req.body.familyAddress,
          familyPhone: req.body.familyPhone,
          createdBy: req.user.id,
          // photo: {
          //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          //     contentType: 'image/png'
          // }
        });
        return res.json({ member });
      }
    } catch (error) {
      return res.status(500).send("Internal Server Error!");
    }
  }
);

//Fetch all the Members In Admin Page

router.get("/fetchallmembers", fetchUser, async (req, res) => {
  try {
    const members = await Member.find();
    return res.json({ members });
  } catch (error) {
    return res.status(500).send("Internal Server Error!");
  }
});

//Fetch all the Members In Main Page

router.get("/fetchallmembershomepage", async (req, res) => {
  try {
    const membersHome = await Member.find();
    return res.json({ membersHome });
  } catch (error) {
    return res.status(500).send("Internal Server Error!");
  }
});


// Update the Members
router.put("/updateMember/:id", fetchUser, async (req, res) => {
  const {
    fullname,
    email,
    phoneNumber,
    streetAddress,
    address_nepal,
    dob,
    postalTown,
    postalCode,
    familyFullName,
    familyRelation,
    familydob,
    familyAddress,
    familyPhone,
  } = req.body;

  try {
    //Creating the object to update member
    const updateMember = {};

    //Adding the content inside the updateMember object
    if (fullname) {
      updateMember.fullname = fullname;
    }
    if (email) {
      updateMember.email = email;
    }
    if (phoneNumber) {
      updateMember.phoneNumber = phoneNumber;
    }
    if (streetAddress) {
      updateMember.streetAddress = streetAddress;
    }
    if (address_nepal) {
      updateMember.address_nepal = address_nepal;
    }
    if (dob) {
      updateMember.dob = dob;
    }
    if (postalTown) {
      updateMember.postalTown = postalTown;
    }
    if (postalCode) {
      updateMember.postalCode = postalCode;
    }
    if (familyFullName) {
      updateMember.familyFullName = familyFullName;
    }
    if (familyRelation) {
      updateMember.familyRelation = familyRelation;
    }
    if (familydob) {
      updateMember.familydob = familydob;
    }
    if (familyAddress) {
      updateMember.familyAddress = familyAddress;
    }
    if (familyPhone) {
      updateMember.familyPhone = familyPhone;
    }

    //Find the member that needs to be updated by their corresponding id

    let member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).send("No Member found!");
    }

    member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateMember },
      { new: true }
    );
    return res.json({ member });
  } catch (error) {
    return res.status(500).send("Internal Server Error!");
  }
});

//Delete the Members
router.delete("/deleteMember/:id", fetchUser, async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).send("No Member Found!");
    }
    member = await Member.findByIdAndDelete(req.params.id);
    res.json({ success: "Member Successfully Deleted!", member: member });
  } catch (error) {
    return res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;

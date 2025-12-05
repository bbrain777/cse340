// utilities/profile-validation.js
const { body, validationResult } = require("express-validator")
const utilities = require(".")

const profileValidate = {}

/**
 * Rules for profile form fields.
 */
profileValidate.profileRules = () => {
  return [
    body("phone")
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ min: 7, max: 20 })
      .withMessage("Phone number should be between 7 and 20 characters.")
      .bail()
      .matches(/^[0-9+()\-\s]*$/)
      .withMessage("Phone number contains invalid characters."),
    body("address")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Address is required."),
    body("city")
      .trim()
      .isLength({ min: 2 })
      .withMessage("City is required."),
    body("state")
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage("State / Region must be 50 characters or less."),
    body("postcode")
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ max: 10 })
      .withMessage("Postcode must be 10 characters or less."),
  ]
}

/**
 * Middleware to check validation result and re-render form if needed.
 */
profileValidate.checkProfileData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const { phone, address, city, state, postcode } = req.body

    return res.status(400).render("profile/edit", {
      title: "Edit Contact & Address Details",
      nav,
      errors: errors.array(),
      message: null,
      profile: { phone, address, city, state, postcode },
    })
  }

  next()
}

module.exports = profileValidate

// controllers/profileController.js
const utilities = require("../utilities")
const profileModel = require("../models/profile-model")

/**
 * Show form to edit contact & address details.
 */
async function buildEditProfile(req, res, next) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  if (!accountData) {
    req.flash("notice", "You must be logged in to edit your profile.")
    return res.redirect("/account/login")
  }

  const existingProfile = await profileModel.getProfileByAccountId(
    accountData.account_id
  )

  res.render("profile/edit", {
    title: "Edit Contact & Address Details",
    nav,
    errors: null,
    message: req.flash("notice"),
    profile: existingProfile || {},
  })
}

/**
 * Process profile update after validation.
 */
async function updateProfile(req, res, next) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  if (!accountData) {
    req.flash("notice", "You must be logged in to edit your profile.")
    return res.redirect("/account/login")
  }

  const { phone, address, city, state, postcode } = req.body

  try {
    await profileModel.upsertProfile(
      accountData.account_id,
      phone,
      address,
      city,
      state,
      postcode
    )

    req.flash("notice", "Profile details updated successfully.")
    return res.redirect("/account/")
  } catch (err) {
    console.error("updateProfile error:", err)

    return res.status(500).render("profile/edit", {
      title: "Edit Contact & Address Details",
      nav,
      errors: [
        {
          msg: "An error occurred while saving your profile. Please try again.",
        },
      ],
      message: null,
      profile: { phone, address, city, state, postcode },
    })
  }
}

module.exports = { buildEditProfile, updateProfile }

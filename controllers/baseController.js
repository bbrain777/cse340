// controllers/baseController.js
const baseController = {}

baseController.buildHome = (req, res, next) => {
  res.render("index", {
    title: "CSE Motors | Home"
  })
}

module.exports = baseController

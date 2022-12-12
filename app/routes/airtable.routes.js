module.exports = (app) => {
  const airtables = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Create a new airtables
  router.post("/", airtables.create);

  // Retrieve all airtables
  router.get("/", airtables.findAll);

  router.get("/columns", airtables.findColumns);

  // Retrieve all published airtables
  router.get("/published", airtables.findAllPublished);

  // Get Rows Length
  router.get("/rowlen", airtables.findRowLen);

  // Insert left with col_id and name
  router.post("/insertColumn", airtables.insertColumn);


  // Retrieve a single Tutorial with id
  router.get("/:id", airtables.findOne);

  // Delete a Tutorial with id
  router.delete("/:id", airtables.delete);

  // Delete all airtables
  router.delete("/", airtables.deleteAll);

  app.use("/", router);
};

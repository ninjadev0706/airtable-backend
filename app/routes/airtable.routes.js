module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  router.get("/columns", tutorials.findColumns);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Get Rows Length
  router.get("/rowlen", tutorials.findRowLen);

  // Insert left with col_id and name
  router.post("/insertColumn", tutorials.insertColumn);


  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  app.use("/", router);
};

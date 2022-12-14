const Airtable = require("../models/tutorial.model.js");

// Create and Save a new Airtable
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Airtable
  const airtable = new Airtable({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false,
    col_id: req.body.col_id || false,
    col_order: req.body.col_order || false,
    cell_content: req.body.cell_content || false,
    rowlength: req.body.rowlength || false,
  });

  // Save Airtable in the database
  Airtable.create(airtable, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Airtable.",
      });
    else res.send(data);
  });
};

// Retrieve all Airtable from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  Airtable.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving airtable.",
      });
    else res.send(data);
  });
};

// Retrieve all Columns
exports.findColumns = (req, res) => {
  const title = req.query.title;

  Airtable.getColAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving airtable.",
      });
    else res.send(data);
  });
};

// Find a single Airtable by Id
// exports.findOne = (req, res) => {
//   Airtable.findById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Airtable with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Airtable with id " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

// find all published Airtable
exports.findAllPublished = (req, res) => {
  Airtable.getAllPublished((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving airtable.",
      });
    else res.send(data);
  });
};

// Update a Airtable identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Airtable.updateById(req.params.id, new Airtable(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Airtable with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Airtable with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a Airtable identified by the id in the request
exports.insertColumn = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let data = req.body.data;
  let callStatus;

  Airtable.increaseId(req.params.id, data.col_order, (err, data1) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Airtable with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Airtable with id " + req.params.id,
        });
      }
    } else {
      let content =
        "(" + data.col_order + ", " + '"' + data.cell_content + '"' + ")";

      let insert_col_id;

      Airtable.insertNewItem(content, (err, data2) => {
        insert_col_id = data2.id;

        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Airtable.",
          });

        let datas = "";
        for (let i = 0; i < data.rowlength; i++) {
          datas += "(" + (i + 1) + ", " + insert_col_id + ", '')";
          if (i + 1 != data.rowlength) {
            datas += ",";
          }
        }
        
        Airtable.createdatas(datas, (err, data) => {
          if (err) {

          }
          if (data) {
            callStatus = true;
            res.status(200).send({ message: "success" });
          }
        });
      });

      
    }
  });
};

exports.findRowLen = (req, res) => {
  const title = req.query.title;

  Airtable.rowLength(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving airtable.",
      });
    else res.send(data);
  });
};

// Delete a Airtable with the specified id in the request
exports.delete = (req, res) => {
  Airtable.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Airtable with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Airtable with id " + req.params.id,
        });
      }
    } else res.send({ message: `Airtable was deleted successfully!` });
  });
};

// Delete all Airtable from the database.
exports.deleteAll = (req, res) => {
  Airtable.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Airtable.",
      });
    else res.send({ message: `All Airtable were deleted successfully!` });
  });
};

const sql = require("./db.js");

// constructor
const Airtable = function (airtable) {
  this.title = airtable.title;
  this.description = airtable.description;
  this.published = airtable.published;
};

Airtable.create = (newAirtable, result) => {
  sql.query("INSERT INTO airtable SET ?", newAirtable, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newAirtable });
  });
};

// Insert new records of new column
Airtable.createdatas = (insertcontent, result) => {
  sql.query(
    "INSERT INTO tb_datas (row_id, col_id, cell_content) values " +
      insertcontent,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, true);
    }
  );
};

// Airtable.findById = (id, result) => {
//   sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       result(null, res[0]);
//       return;
//     }

//     result(false, true);
//   });
// };

// get all records
Airtable.getAll = (title, result) => {
  let query =
    "SELECT tb_datas.id, tb_datas.row_id, tb_datas.col_id, cell_content from tb_columns RIGHT JOIN tb_datas ON tb_columns.id = tb_datas.col_id ORDER BY col_order, col_id, row_id;";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// get all columns type
Airtable.getColAll = (title, result) => {
  let query = "SELECT * from tb_columns ORDER BY col_order;";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// get Rows length
Airtable.rowLength = (title, result) => {
  let query = "select MAX(row_id) as len from tb_datas;";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// Airtable.getAllPublished = (result) => {
//   sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     result(null, res);
//   });
// };

// Airtable.updateById = (id, tutorial, result) => {
//   sql.query(
//     "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
//     [tutorial.title, tutorial.description, tutorial.published, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       result(null, { id: id, ...tutorial });
//     }
//   );
// };

// Increate id of columns bigger than chosen one
Airtable.increaseId = (id, col_order, result) => {
  sql.query(
    "UPDATE tb_columns SET col_order = col_order + 1 WHERE col_order >= " +
      col_order,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(false, true);
    }
  );
};

// Insert New item
Airtable.insertNewItem = (insertcontent, result) => {
  sql.query(
    "INSERT INTO tb_columns (col_order, col_name) VALUES " + insertcontent,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(false, { id: res.insertId });
    }
  );
};

// Airtable.remove = (id, result) => {
//   sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     result(null, res);
//   });
// };

// Airtable.removeAll = (result) => {
//   sql.query("DELETE FROM tutorials", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     result(null, res);
//   });
// };

module.exports = Airtable;

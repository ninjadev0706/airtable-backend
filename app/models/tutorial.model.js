const sql = require("./db.js");

// constructor
const Tutorial = function (tutorial) {
  this.title = tutorial.title;
  this.description = tutorial.description;
  this.published = tutorial.published;
};

Tutorial.create = (newTutorial, result) => {
  sql.query("INSERT INTO tutorials SET ?", newTutorial, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created tutorial: ", { id: res.insertId, ...newTutorial });
    result(null, { id: res.insertId, ...newTutorial });
  });
};

Tutorial.createdatas = (insertcontent, result) => {
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

Tutorial.findById = (id, result) => {
  sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found tutorial: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result(false, true);
  });
};

Tutorial.getAll = (title, result) => {
  // let query = "SELECT * FROM tutorials";
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

    // console.log("tutorials: ", res);
    result(null, res);
  });
};

Tutorial.getColAll = (title, result) => {
  // let query = "SELECT * FROM tutorials";
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

    // console.log("tutorials: ", res);
    result(null, res);
  });
};

Tutorial.rowLength = (title, result) => {
  // let query = "SELECT * FROM tutorials";
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

    // console.log("tutorials: ", res);
    result(null, res);
  });
};

Tutorial.getAllPublished = (result) => {
  sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("tutorials: ", res);
    result(null, res);
  });
};


Tutorial.updateById = (id, tutorial, result) => {
  sql.query(
    "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    [tutorial.title, tutorial.description, tutorial.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated tutorial: ", { id: id, ...tutorial });
      result(null, { id: id, ...tutorial });
    }
  );
};

Tutorial.increaseId = (id, col_order, result) => {
  console.log("resut => ", result)
  sql.query(
    // "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    "UPDATE tb_columns SET col_order = col_order + 1 WHERE col_order >= " +
      col_order,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated tutorial: ");
      result(false, true);
      console.log()
    }
  );
};

Tutorial.insertNewItem = (insertcontent, result) => {
  console.log(
    "INSERT INTO tb_columns (col_order, col_name) VALUES " + insertcontent
  );
  sql.query(
    "INSERT INTO tb_columns (col_order, col_name) VALUES " + insertcontent,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created tutorial: ", { id: res.insertId });
      result(false, { id: res.insertId });
    }
  );
};

Tutorial.remove = (id, result) => {
  sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted tutorial with id: ", id);
    result(null, res);
  });
};

Tutorial.removeAll = (result) => {
  sql.query("DELETE FROM tutorials", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};

module.exports = Tutorial;

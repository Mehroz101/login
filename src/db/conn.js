const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/stdRegistration")
  .then(() => {
    console.log("Database connection Successfully");
  })
  .catch((e) => {
    console.log(e);
  });

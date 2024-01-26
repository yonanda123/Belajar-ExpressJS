const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Third-party Middleware
app.use(expressLayouts);
app.use(morgan('dev'));

// Build-in Middleware
app.use(express.static('public'))

app.use((req, res, next) => {
  console.log('Time', Date.now());
  next();
})

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Mahasiswa1",
      email: "mahasiswa1@gmail.com",
    },
    {
      nama: "Mahasiswa2",
      email: "mahasiswa2@gmail.com",
    },
    {
      nama: "Mahasiswa3",
      email: "mahasiswa3@gmail.com",
    },
  ];
  res.render("index", { nama: "Test", title: "Home", mahasiswa, layout: 'layouts/main-layout' });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/main-layout", title: "Halaman About" });
});
app.get("/contact", (req, res) => {
  res.render("contact", { layout: "layouts/main-layout", title: "Halaman Contact" });
});

app.get("/product/:id", (req, res) => {
  res.send(
    `Product ID :  ${req.params.id} <br> Category ID : ${req.query.category}`
  );
});

app.use("/", (req, res) => {
  //halaman akan selalu jalan walaupun url tidak ada
  res.status(404);
  res.send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/ `);
});

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact
} = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Third-party Middleware
app.use(expressLayouts);

// Build-in Middleware
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  console.log("Time", Date.now());
  next();
});

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
  res.render("index", {
    nama: "Test",
    title: "Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No HP tidak Valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("msg", "Data contact berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Form Tambah Data Contact",
  });
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail Contact",
    contact,
  });
});

app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Form Ubah Contact",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    body("nama").custom((value, {req}) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No HP tidak Valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Ubah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact : req.body,
      });
    } else {
      updateContact(req.body);
      req.flash("msg", "Data contact berhasil diubah");
      res.redirect("/contact");
    }
  }
);

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

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ContactApp', {
})

// menambah 1 data
// const contact1 = new Contact({
//     nama: '<NAME>',
//     nohp: '081234567890',
//     email: 'email@gmail.com'
// })

// //simpan ke collection
// contact1.save().then((contact) => console.log(contact));


// eski modulda esa "commedjs" boladi yangisida esa "module" boladi buni package.json dan togrlanadi "typen"-"nodlule" || "commendjs"  !


// const os =  require("os");

// console.log(os.cpus());       //modullari !
// console.log(os.type());       // typesi
// console.log(os.arch());       //arhitekturasi !
// console.log(os.freemem());    // bosh joyi !
// console.log(os.totalmem());   ///toliq joyi !
// console.log(os.hostname());   ///mac yoki shunga oxshash nomi 
// console.log(os.version());    //versiyasi !
// console.log(os.userInfo());   //  ssh orqali kerak bolishi mumkin malumot  !
// console.log(os.machine());    /// javob : arm64
// console.log(os.platform());   // nomi 
// console.log(os.availableParallelism());   //javob chiqdi 8 // meni tushuncham modullari soni 
// console.log(os.endianness());   /// javob chiqdi // Le 


// const http = require("http");   /// http moduli !! ||||  bu esa eski usuli !!!
// import http from 'http';           // bu yangi usuli 

/// node js ning ozida yaratib koramiz serverni !!!!!!!!!
// req foydalunivchi tomonidan keladigon zapros ya'ni login yoki shunga oxshash narsalarda keladigon datalar qabul qilishi uchun requist dan foydalaniladi !! |||| endi respons bu men qabul qilgan datalarga ishlov berib foydalunchiga qaytarib yuboradigon datalar respons hisoblanadi !!!!

// const server = http.createServer((req, res) => { 
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// })
// server.listen(8080, () => {
//     console.log("Server run! ");
// })

 


/// status codelar tahminana 10tacha bor // bu keyingi darda koriladi !!1




// eski modulda esa "commedjs" boladi yangisida esa "module" boladi buni package.json dan togrlanadi "typen"-"nodlule" || "commendjs"  !


// const http = require("http");  bu eskisi moduleni !k
// import http from 'http'          /// bu yangisi !

// const server = http.createServer((req, res) => { 
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// })
// server.listen(8080, () => {
//     console.log("Server run! ");
// })


// const express = require('express')
// const server = express()

// server.get('/', function (req, res) {
//   res.status(200).json({ success: true })
// }) 

// server.listen(8080, () => {
//     console.log("Server run port 8080!");
// })

// console.log(__dirname);   // papkani ochip berdi togrirohi fileni yolini ochip berdi !
// console.log(__filename);  /// buni esa fileni yolini ochip berayapti !

// console.log(process);  // process global obect yani bizga olib kelayotgan barcha objectlar !

// node.js ni eskii versiyasi 1 chi usul 
// const fs = require('fs');
// const path = require("path"); // faqatgina yolini yaratib oldik !

// const imageUrl = 'salom.jpg';

// console.log(path.basename(__filename));  // method
// console.log(path.extname(imageUrl));    //  method
// console.log(path.join(__dirname, 'source','image', 'text.txt'));  // bu narsa faqatgina fileni yolini yaratib beradi !  // method


// fs.mkdir(path.join(__dirname, 'salom'),{}, (err) => {
//     console.log(err);
// })
// fs.mkdir(path.join(__dirname, 'salom'),{}, (err) => {
//     if(err) {
//         throw err;
//     }
// })

// fs.rmdir(path.join(__dirname, "salom"),{},(err) => {
//     if (err) {
//         throw err;
//     }
// })

// fs.writeFile(path.join(__dirname, "salom", "text.txt"), "salom", (err) => {
//     if (err) {
//         throw err;  /// file yaraitsh ! 
//     }
// } )


// fs.mkdir(path.join(__dirname, "salom" ), {}, (err) => {   folder yaratish !
//     if (err) { 
//         throw err;
//     }
// })
// fs.writeFile(path.join(__dirname, "salom", "type.jsx"), 'kdjkgjkf', (err) => { file yaratish !
//     if (err) {
//         throw err;
//     }
// })

// fs.rmdir(path.join(__dirname, "salom"), (err) => { // fileni ochirish uchun rmdir folderni ochirish uchun rm boladi !
//     if (err) {
//         throw err;
//     }
// })


//////
// const express = require('express');
// const server = express();
// const fs = require('fs');
// const path = require('path');

// server.get('/', function (req, res ) {
//     res.status(200).json({ success: true, message: 'Xush kelibsiz ^^'});
// })
// server.get('/f', function ( req, res ) {
//     fs.mkdir(path.join(__dirname, 'salom'), (err) => {
//         if (err) {
//             throw err;
//         }
//         console.log("file yaratildi !");
//         res.status(200).json({success: true, message: 'create file !'}) // xromda chiqadi !
//     })
// })
// server.get('/d', function ( req, res ) {
//     const server = path.join(__dirname, 'salom');
//     fs.rm( server, { recursive: true }, (err) => {
//         if (err) {
//             throw err;
//         }
//         console.log("file ochirildi !"); // terminalda chiqdi !
//         res.status(200).json({ success: true, message: 'delete file !'}) // xrom da chiqadi !
//     })
// })
// server.listen(3005, () => {
//     console.log("Server Run!"); // terminalda chiqadi !
// })

// import { v4 } from 'uuid';
// import express from 'express';
// const server = express();
// server.use(express.json()) // import bolgan express ni dastiqlab oldik 

// const todo = [];

// server.post('/todo/add', function( req, res) {
//     const {title, desc} = req.body;
//     todo.push({id: v4(),title, desc})
//     res.status(201).json({ success: true, todo })
// })
// // putdan biron bir narsalarni yangilashda, ozgartirishda ishlagnadi masaln login dagi ismnim yokida login parol nogiri bolganda ishlanadi yangilash uchun !!!!
// server.put('/todo/edit/:id', function( req, res ) { 
//     const {title, desc } = req.body;
//     const { id } = req.body;
//     const index = todo.findIndex((value) => value.id === id)
//     todo.splice(index,1,{id, title, desc})
//     res.status(200).json({ success: true, todo })
// })
// server.get('/todo/get/:id', ( req, res ) => {
//     const { id } = req.params;
//     const data = todo.find((val) => val.id === id)
//     res.status(200).json({ success: true, data})
// })
// server.get('/todo/get-all/', ( req, res ) => {
//     const { search } = req.query;
//     const data = todo.filter((val) => val.title === search)
//     res.status(200).json({ success: true, data })
// })
// server.get('/todo/delet/:id', ( req, res ) => {
//     const { delet } = req.params;
//     const  data = todo.findIndex((val) => val.id === delet );
//     const deletes = todo.splice(data, 1 )
//      if (deletes.length > 0 ) {
//         console.log("element ochirilidi"); // element ochirlganini terminalda korsatish !
//      } else {
//         console.log("element ochirilmadi !"); // elemtn ovhirilmaganini terminla da korsatish !
//      }
//     res.status(200).json({ success: true, data})
// })
// server.listen(3005, () => {
//     console.log("Server Run!"); // terminalda chiqadi !
// })
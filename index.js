const express = require('express');
const multer = require('multer');
const path = require('path');

//file uploads folder
const UPLOADS_FOLDER = "./uploads/";

//define the storage
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb)=>{
        //important File.pdf => important-file-3575377.pdf
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                        .replace(fileExt, "")
                        .toLowerCase()
                        .split(" ")
                        .join("-") + "-" + Date.now();
        cb(null, fileName + fileExt);
    },
});

//preapre the final multer upload object
var upload =  multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    }, 
    fileFilter:(req, file, cb)=>{
        // console.log(file);

        if(file.fieldname==="avatar"){
            if(
                file.mimetype==="image/png"||
                file.mimetype==="image/jpg"||
                file.mimetype==="image/jpeg"
            ) {
                cb(null, true)
            } else{
                cb(new Error("Only jpg, png, or jpeg format allowed"));
            }
        } else if(file.fieldname ==="doc"){
            if(file.mimetype ==="application/pdf"){
                cb(null, true)
            } else{
                cb(new Error("Only pdf format allowed"))
            }
        } else{
            cb(new Error("There was an unknown error"))
        }
        
    },
});


//express app initalization
const app = express();

//application route next
app.post('/',upload.fields([
    {name:'avatar', maxCount: 3},
    {name:'doc', maxCount: 2},
]), (req, res)=>{
    res.send('hello world')
    console.log(req.files)
});

//default error handler
app.use((err, req, res, next)=>{
    if(err){
        if(err instanceof multer.MulterError){
            res.status(500).send("There was an upload error")
        }
        res.status(500).send(err.message)
    } else{
        res.send("Success")
    }
});

app.listen(3000, ()=>{
    console.log('Server running on port 3000')
})
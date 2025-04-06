const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"whenkii@gmail.com",
        pass:"ashunikkie123"},
    tls:{rejectUnauthorized:false}
})

let mailOptions = {from:"GardenRoots",to:"whenkii@gmail.com",subject:"Test",text:"Order details"}

transporter.sendMail(mailOptions,(err,success) => {
    if (err){
        console.log("Failed")
    }
    else{
        console.log("Success")
    }
})
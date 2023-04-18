const express = require ("express");
const bodyParser = require("body-parser");
const app = express(); 
const date = require(__dirname + "/date.js");
let items=["to code", "to workout", "to sleep"];
let workList=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

    app.get("/", function (req , res) {

            let day=date.getDate();


            // console.log(day);
            res.render("list" , {listTitle : day , addedNewItems:items} );
             } );

        app.get("/work", function(req,res){

            res.render("list",{listTitle:"Work List",addedNewItems:workList});
        });




    app.post("/", function(req,res){
       // console.log(req.body);
        let addedItem = req.body.item;
        if(req.body.list==="Work List"){  
            workList.push(addedItem);
            res.redirect("/work");
        }
        else{
            items.push(addedItem);
            res.redirect("/");
        }
        });
        

app.get("/about", function(req,res){
    res.render("about");
});










    app.listen(3000, function(){
        console.log("server started at port 3000");
    } );

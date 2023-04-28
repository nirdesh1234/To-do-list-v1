const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var _ = require('lodash');
const mongoose = require("mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/listDB");

// let workList = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const date = require(__dirname + "/date.js");

// let items = ["to code", "to workout", "to sleep"];

const itemSchema = new mongoose.Schema({ name: String });

const Item = mongoose.model("Item", itemSchema);

const one = new Item({
  name: "This is your todo list",
});

const two = new Item({
  name: "Use the + to add a new item",
});

const three = new Item({
  name: "You can also delete the item",
});

const defaultItems = [one, two, three];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  let day = date.getDate();

  // console.log(day);

  async function findItems() {
    try {
      const items = await Item.find({});
      // console.log(items);
      return items;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  findItems()
    .then((msg) => {
      // console.log(msg);
      if (msg.length === 0) {
        Item.insertMany(defaultItems)
          .then((message) => {
            console.log("success", message);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        res.render("list", { listTitle: day, addedNewItems: msg });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", addedNewItems: workList });
// });

app.get("/:topic", function (req, res) {
  const topic = _.capitalize([req.params.topic]);  
  async function findDocument() {
    const find = await List.findOne({ name: topic }).exec();
    return find;
  }
  findDocument()
    .then((message) => {
      if (message) {
        console.log("Found existing list:", message);
        // Use existing list here
        res.render("list", {
          listTitle: message.name,
          addedNewItems: message.items,
        });
      } else {
        // Add items to new list here
        console.log("Creating new list...");
        const list = new List({ name: topic, items: defaultItems });

        list.save();
        res.redirect("/" + topic);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
});

app.post("/", function (req, res) {
  // console.log(req.body);
  // let addedItem = req.body.item;

  // if (req.body.list === "Work List") {
  //   //   workList.push(addedItem);
  //   const addItem = new Item({
  //     name: addedItem,
  //   });
  //   addItem.save();
  //   res.redirect("/work");
  // } else {
  // items.push(addedItem);

  let addedItem = req.body.item;
  let listName = req.body.list;
  const addItem = new Item({
    name: addedItem,
  });

  if (listName === date.getDate()) {
    addItem.save();
    res.redirect("/");
  } else {
    async function findDocumentByTitle() {
      const findByTitle = await List.findOne({ name: listName }).exec();
      return findByTitle;
    }
    findDocumentByTitle()
      .then((foundList) => {
        //  here the .then(foundList) gives the name of the list to save
        foundList.items.push(addItem);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", function (req, res) {
  const deleteId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    async function deleteOne() {
      const deletedItem = await Item.findByIdAndRemove({ _id: deleteId });
      return deletedItem;
    }

    deleteOne()
      .then((msg) => {
        console.log("deleted", msg);
        res.redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/");
      });
  } else {
    async function deleteFromOtherThanDefaultList() {
      return await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: deleteId } } } //google search to see how to delete document from an array in mongoose
      ); 
    }

    deleteFromOtherThanDefaultList()
      .then((msg) => {
        console.log("deleted succesfully", msg);
        res.redirect("/"+ listName);
      })
      .catch((err) => {
        console.log("some error", err);
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server started at port 3000");
});

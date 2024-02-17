import fetch from "node-fetch";
import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://Shubhamy:21jumlcpBeAHUxbx@cluster0.ywnqbfq.mongodb.net/roxilerAssignment",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

const response = await fetch(
  "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
);
const data = await response.json();
//console.log(data);

const transaction = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  sold: {
    type: Boolean,
    default: false,
  },
  dateOfSale: {
    type: Date,
  },
});
const Transaction = mongoose.model("Transaction", transaction);

async function getPosts() {
  for (let i = 0; i < data.length; i++) {
    const product = new Transaction({
      id: data[i].id,
      title: data[i].title,
      price: data[i].price,
      description: data[i].description,
      category: data[i].category,
      image: data[i].image,
      sold: data[i].sold,
      dateOfSale: data[i].dateOfSale,
    });
    try {
      const savedProduct = await product.save();
      //   console.log(savedProduct);
    } catch (err) {
      console.log(err);
    }
  }
}
getPosts();

// Task 2

app.get("/products", async (req, res) => {
  const selectedMonth = req.query.keyword;
  const searchText = req.query.search;
  const page = req.query.page || 1;

  const query = {};

  if (selectedMonth) {
    const startOfMonth = new Date(selectedMonth);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(selectedMonth);
    endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1, 0);
    endOfMonth.setUTCHours(23, 59, 59, 999);

    query.dateOfSale = { $gte: startOfMonth, $lte: endOfMonth };
  }

  if (searchText) {
    const searchQuery = {
      $or: [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
      ],
    };

    query.$and = [searchQuery];
  }

  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const products = await Transaction.find(query).skip(skip).limit(perPage);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/salesMonth", async (req, res) => {
  const selectedMonth = req.query.keyword;

  let sales = 0,
    soldItems = 0,
    totalItems = 0;

  try {
    const transactions = await Transaction.find();

    transactions.forEach((transaction) => {
      const transactionMonth = transaction.dateOfSale
        .toISOString()
        .substring(0, 7);
      if (transactionMonth === selectedMonth) {
        sales += transaction.price;
        totalItems++;
        if (transaction.sold) {
          soldItems++;
        }
      }
    });

    res.send({
      totalSale: sales,
      totalSoldItems: soldItems,
      totalNotSoldItems: totalItems - soldItems,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/barChart", (req, res) => {
  const map1 = new Map();
  map1.set("January", "01");
  map1.set("February", "02");
  map1.set("March", "03");
  map1.set("April", "04");
  map1.set("May", "05");
  map1.set("June", "06");
  map1.set("July", "07");
  map1.set("August", "08");
  map1.set("September", "09");
  map1.set("October", "10");
  map1.set("November", "11");
  map1.set("December", "12");

  const map2 = new Map();
  map2.set("0-100", 0);
  map2.set("101-200", 0);
  map2.set("201-300", 0);
  map2.set("301-400", 0);
  map2.set("401-500", 0);
  map2.set("501-600", 0);
  map2.set("601-700", 0);
  map2.set("701-800", 0);
  map2.set("801-900", 0);
  map2.set("901+", 0);

  for (let i = 0; i < data.length; i++) {
    let originalString = data[i].dateOfSale;
    let sold = data[i].sold;
    originalString.toString();
    let text = originalString.substring(0, 7);
    if (text === req.query.keyword) {
      let price = data[i].price;
      if (price <= 100) map2.set("0-100", map2.get("0-100") + 1);
      else if (price <= 200) map2.set("101-200", map2.get("101-200") + 1);
      else if (price <= 300) map2.set("201-300", map2.get("201-300") + 1);
      else if (price <= 400) map2.set("301-400", map2.get("301-400") + 1);
      else if (price <= 500) map2.set("401-500", map2.get("401-500") + 1);
      else if (price <= 600) map2.set("501-600", map2.get("501-600") + 1);
      else if (price <= 700) map2.set("601-700", map2.get("601-700") + 1);
      else if (price <= 800) map2.set("701-800", map2.get("701-800") + 1);
      else if (price <= 900) map2.set("801-900", map2.get("801-900") + 1);
      else map2.set("901+", map2.get("901+") + 1);
    }
  }

  const responseData = Array.from(map2, ([range, numberofItem]) => ({
    range,
    numberofItem,
  }));

  res.json(responseData);
});

//Task 4

app.get("/pieChart", async (req, res) => {
  const map1 = new Map();
  map1.set("January", "01");
  map1.set("February", "02");
  map1.set("March", "03");
  map1.set("April", "04");
  map1.set("May", "05");
  map1.set("June", "06");
  map1.set("July", "07");
  map1.set("August", "08");
  map1.set("September", "09");
  map1.set("October", "10");
  map1.set("November", "11");
  map1.set("December", "12");

  const search = req.query.keyword;

  const map2 = new Map();
  for (let i = 0; i < data.length; i++) {
    let originalString = data[i].dateOfSale;
    originalString.toString();
    let text = originalString.substring(5, 7);
    if (text === map1.get(search)) {
      let category = data[i].category;
      category = category.toString();
      map2.set(category, 0);
    }
  }

  for (let i = 0; i < data.length; i++) {
    let originalString = data[i].dateOfSale;
    originalString.toString();
    let text = originalString.substring(5, 7);
    if (text === map1.get(search)) {
      let category = data[i].category;
      category = category.toString();
      map2.set(category, map2.get(category) + 1);
    }
  }

  const responseData = {};
  map2.forEach((value, key) => {
    responseData[key] = value;
  });

  res.json(responseData);
});

const port = 5000;
app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);

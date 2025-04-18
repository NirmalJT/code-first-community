const express = require("express");
const products = require("./db");
const Admin = require("./admin-db");
const Path = require("path");
const cors = require("cors");
const app = express();

const port = 3000;
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.static(Path.join(__dirname, "public")));
app.set("views", Path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/api/products", (req, res) => {
  res.json(products);
});
app.get("/api/admin", (req, res) => {
  res.json(Admin);
});

app.post("/api/products", (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ message: "Name ,price and image are required" });
  }
  const newProduct = {
    id: Date.now(),
    name: name || "Eccommerce product",
    price: price || 100,
    image: image || "https://picsum.photos/200",
  };
  products.push(newProduct);
  res
    .status(201)
    .json({ message: "Product added succsessfully", product: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, price, image } = req.body;
  if (!name || !price) {
    res.status(400).json({ message: "Name and price is required" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Product not found try again letter" });
    return;
  }
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    res.status(400).json({ message: "Something went wrong product not found" });
    return;
  }
  products[productIndex].name = name;
  products[productIndex].price = price;
  products[productIndex].image = image || "https://picsum.photos/200";
  res.status(200).json({ message: "product updated succsesfully" });
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: "product  not found" });
  }
  let productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    res.status(400).json({ message: "product not fount" });
  }
  products.splice(productIndex, 1);

  res.status(200).json({ message: "product deleted succsesfully" });
});

app.listen(port, () => {
  console.log(`your server is live at ${port}`);
});

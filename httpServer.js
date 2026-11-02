import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shopping cart array
let cart = [
  {
    id: 1,
    productName: "Laptop",
    price: 50000,
    quantity: 1,
  },
  {
    id: 2,
    productName: "Mouse",
    price: 799,
    quantity: 2,
  },
  {
    id: 3,
    productName: "Keyboard",
    price: 1499,
    quantity: 1,
  },
];

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader("Content-Type", "application/json");

  // GET /
  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Welcome to Shopping Cart Application</h1>");
  }

  // GET /cart
  else if (req.method === "GET" && req.url === "/cart") {
    res.end(JSON.stringify(cart));
  }

  // GET /about
  else if (req.method === "GET" && req.url === "/about") {
    res.setHeader("Content-Type", "text/plain");
    res.end("This is a Shopping Cart Management Application.");
  }

  // GET /home
  else if (req.method === "GET" && req.url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Error reading HTML file");
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    });
  }

  // POST /add-to-cart
  else if (req.method === "POST" && req.url === "/add-to-cart") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);

        if (
          product.id == null ||
          !product.productName ||
          typeof product.price !== "number" ||
          typeof product.quantity !== "number" ||
          product.price < 0 ||
          product.quantity <= 0
        ) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Invalid product details",
            }),
          );
          return;
        }

        cart.push(product);

        res.statusCode = 201;
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: product,
          }),
        );
      } catch (error) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  }

  // Invalid route
  else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        message: "Route not found",
      }),
    );
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});

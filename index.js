require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const viewsPath = path.join(__dirname, "/templates/views");
const hbs = require("hbs");
const mongoose = require("mongoose");
const cors = require("cors");

// Set up handlebars
app.set("view engine", "hbs");
app.set("views", viewsPath);
const partialsPath = path.join(__dirname, "/templates/partials");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set up partials
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS
app.use(cors());

// import schemas
const BlogPost = require("./models/createBlogPostSchema");
const User = require("./models/createUserSchema");

// handlebar route
app.get("", async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const blogPosts = await BlogPost.find({});

    // Render the "index" view with blog post data
    res.render("index", {
      title: "Blog",
      name: "Naquan",
      blogPosts: blogPosts,
    });
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for user page
app.get("/user", async (req, res) => {
  try {
    // Fetch user data from the database
    const users = await User.find({});

    // Render the "user" view with user data
    res.render("user", {
      title: "User Page",
      name: "Naquan",
      users: users,
    });
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Example usage in a route handler to create a new blog post
app.post("/createBlogPost", async (req, res) => {
  try {
    const { title, snippet, body } = req.body;

    // Validate that the required fields are present in the request body
    if (!title || !snippet || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new blog post instance
    const newBlogPost = new BlogPost({
      title,
      snippet,
      body,
    });

    console.log(newBlogPost);
    // Save the new blog post to the database
    await newBlogPost.save();

    // Redirect or respond with success
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Assuming you're using bodyParser for parsing JSON in the request body
app.use(express.json());

// Example of a POST request with JSON data
app.post("/createUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log(newUser);
    res.redirect("/about");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for about page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Naquan",
  });
});

// Define route for contact page
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Me",
    name: "Naquan",
  });
});

// Define route for help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Naquan",
    message:
      "If you niggas need help reading the weather, then this shit is over!",
  });
});

// Wildcard route for handling 404 errors, place it at the end
app.get("*", (req, res) => {
  res.status(404).send({
    error: "Page not found",
    name: "Naquan: The Administrator",
    message: "Page not found",
  });
});

const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

eventEmitter.on("response", (data) => {
  console.log(data);
});

// Database Connection
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://naquanjuniorhayes:v5tQCJ3TOWZg47Vy@cluster0.mrlvhn1.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    // Handle the error appropriately (e.g., exit the application)
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

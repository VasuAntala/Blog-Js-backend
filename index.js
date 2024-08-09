const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");

app.use(express.static("public"));

app.use(bodyparser.json());

mongoose.connect("mongodb+srv://vasuantala123:Vasu123@cluster0.p1ilxej.mongodb.net/blog");

const registerSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    category: String
});

const Register = mongoose.model("Register", registerSchema);
const Blog = mongoose.model("Blog", blogSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

function hasspass(password) {
    return bcrypt.hashSync(password, 10);
};


app.post("/register", (req, res) => {
  let data = req.body;

    let login = new Register({
        username: data.username,
        email: data.email,
        password:hasspass(req.body.password)
    });
    login.save();

    res.send("Register successful");
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Sign a JWT token
        const token = jwt.sign({ id: user._id }, 'secratekey', { expiresIn: '2h' });

        // Send the token as a response
        res.json({ token });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ message: 'Internal server error' });
    }
});
    // Register.findOne({ email: req.body.email }, (err, user) => {
    //     if (user) {
    //         bcrypt.compare(password, user.password, (err, result) => {
    //             if (result) {
    //                 res.send("Login successful");
    //             } else {
    //                 res.send("Login failed");
    //             }
    //         });
    //     } else {
    //         res.send("Login failed");
    //     }

// });


app.post("/create", (req, res) => {
    let data = req.body;

    let blog = new Blog({
        title: data.title,
        content: data.content,
        image: data.image,
        category: data.category
    });
    blog.save();
    res.send("Blog created successfully");
}); 


app.get("/read", async (req, res) => {
  
 const read= await Blog.find()
    res.send(read);
    
});


app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    const update = await Register.findByIdAndUpdate(id, { username }, { new: true });
    res.send({"data updated":update});
});


app.put("/update-blog/:id", async (req, res) => {
    const { id } = req.params;
    const {title,content,image,category} = req.body;
    const update = await Blog.findByIdAndUpdate(id, { title,content,image,category }, { new: true });
    res.send({"data updated":update});
});


app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.send(deleteBlog);   
});


app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const deleteBlog = await Register.findByIdAndDelete(id);
    res.send(deleteBlog);   
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
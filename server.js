const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//     // res.redirect('/product');
// });

app.use("/product", require("./routes/product"));

// deploy
if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
    });
}

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
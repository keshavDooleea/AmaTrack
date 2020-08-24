const express = require("express");
const cors = require("cors");
// const { json } = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect('/product');
});

app.use("/product", require("./routes/product"));

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("/get");
});

router.post("/search", (req, res) => {
    const url = req.body.url;

    console.log(url);
    res.send("/findprod");
});

router.get("/notify", (req, res) => {
    res.send("/notify");
});

module.exports = router;
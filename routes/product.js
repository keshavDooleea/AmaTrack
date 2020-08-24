const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("/get");
});

router.get("/seach", (req, res) => {
    res.send("/findprod");
});

router.get("/notify", (req, res) => {
    res.send("/notify");
});

module.exports = router;
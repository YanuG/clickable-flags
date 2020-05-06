var sqlite3 = require("sqlite3");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000
var db = new sqlite3.Database("flags.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name = 'flags'",
    function (err, data) {
        if (!data) {
            db.serialize(function () {
                db.run("CREATE TABLE flags (id INTEGER PRIMARY KEY AUTOINCREMENT , xcoord string NOT NULL, ycoord string NOT NULL)", function () { });

            })
        }
    });

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/api/flags", (req, res, next) => {

    var sql = "select * from flags"
    var params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });

});

app.get("/api/flags/:id", (req, res, next) => {
    var sql = "SELECT * from flags where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

app.post("/api/flags", (req, res, next) => {
    console.log(req.body);
    var errors = []
    var data = {
        xcoord: req.body['xcoord'],
        ycoord: req.body['ycoord']
    }
    if (!data.xcoord) {
        errors.push("No x coordinated specified");
    }
    if (!data.ycoord) {
        errors.push("No y coordinated specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var sql = 'INSERT INTO flags (xcoord, ycoord) VALUES (?,?)'
    var params = [data.xcoord, data.ycoord]
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message })
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

app.delete("/api/flags/:id", (req, res, next) => {
    var sql = 'DELETE FROM flags WHERE id = ?';
    var params = [req.params.id];
    db.run(
        sql,
        params,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                console.log(err.message);
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});
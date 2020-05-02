var sqlite3 = require("sqlite3");

var db = new sqlite3.Database("flags.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


db.get("SELECT name FROM sqlite_master WHERE type='table' AND name = 'flags'",
function(err, data)
{
    if (!data)
    {
        db.serialize(function()
        {
            db.run("CREATE TABLE flags (id INTEGER PRIMARY KEY AUTOINCREMENT , xcoord FLOAT NOT NULL, ycoord FLOAT NOT NULL)", function()
            {});
                
        })
    }
});


function getAllFlags()
{
    var res = {};
    var sql = "select * from flags"
    var params = [];
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res['message'] = 'errors';
            res['data'] = err.message;
        }
        res['message'] = 'success';
        res['data'] = rows;
    });

    return res;
}

function getFlag(id) 
{
    var res = {};
    var sql = "SELECT * from flags where id = ?"
    var params = [id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res['message'] = 'errors';
            res['data'] = err.message;
        }
        res['message'] = 'success';
        res['data'] = row;
    });

    return res;
}

function setFlag(xcoord , ycoord) 
{
    var res = {};
    var errors = []
    if (!xcoord){
        errors.push("No x coordinated specified");
    }
    if (!ycoord){
        errors.push("No y coordinated specified");
    }
    if (errors.length){
        res['message'] = 'errors';
        res['data'] = errors;
    }

    var sql = 'INSERT INTO flags (xcoord, ycoord) VALUES (?,?)'
    var params = [xcoord , ycoord]
    db.run(sql , params, function(err){
        if (err) {
            res['message'] = 'errors';
            res['data'] = err;
        }
        db.get("SELECT last_insert_rowid() as id", function (err, row) {
            if (err) {
                res['message'] = 'errors';
                res['data'] = err;
            }
            res['message'] = 'success';
            res['data'] = row['id'];
        });
        
        
    }); 
    return res;
}

function deleteFlag(id)
{
    var res = {};
    db.run(
        'DELETE FROM flags WHERE id = ?',
        id,
        function (err) {
           if (err) {
            res['message'] = 'errors';
            res['data'] = err;
           }
           res['message'] = 'success';
           res['data'] = this.changes;
    });
    return res;
}

module.exports = {
    
    getAllFlags() {
        return getAllFlags();
    },

    getFlag: function(id){
        return getFlag(id);
    },
    
    setFlag: function(xcoord, ycoord) {
        return setFlag(xcoord, ycoord);
    },

    deleteFlag: function(id) {
        return deleteFlag(id);
    }
}

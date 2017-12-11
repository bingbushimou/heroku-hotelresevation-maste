var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Reservation__c SET Phone__c = $1,Name__c = $2,Roomtype__c = $3 ,Email__c = $4',
            [req.body.Phone__c.trim(), req.body.Name__c.trim(), req.body.Roomtype__c.trim(), req.body.Email__c.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Reservation__c (Phone__c,Name__c,Roomtype__c, Email__c) VALUES ($1, $2, $3, $4)',
                  [req.body.Phone__c.trim(), req.body.Name__c.trim(), req.body.Roomtype__c.trim(), req.body.Email__c.trim()],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

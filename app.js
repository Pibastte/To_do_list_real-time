var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());
app.use(session({secret: 'ssshhhhh'}));

app.get('/', function(req, res){
    //console.log(req.session);
    //console.log(req.session.list)
    var strngList = (req.session.list || '');
    var list;
    if (strngList!='') {
        list = strngList.split('|');
    }else{
        list = undefined;
    }
    res.render('todoList.ejs', {list: list});
});

app.post('/', function(req,res){
    console.log('post request detected...');
    if (req.body.thingToDo) {
        console.log('ajout au cookie: '+req.body.thingToDo);
        if(req.session.list){
            req.session.list += '|'+String(req.body.thingToDo);
        }else {
            req.session.list = String(req.body.thingToDo);
        }
        console.log('list de chose a faire: '+ req.session.list);
        res.send('ok');
    }else if(req.body.thingToDelete){
        var del = String(req.body.thingToDelete);
        console.log('del: ' + del)
        console.log('list: ' + req.session.list);
        console.log(String(req.session.list).replace('|'+del, ''));
        console.log(String(req.session.list).replace(del+'|', ''));
        if (req.session.list != String(req.session.list).replace('|'+del, '')) {
            console.log('different, we don\'t delete the first one');
            req.session.list = String(req.session.list).replace('|'+del, '');
        }else if(req.session.list != String(req.session.list).replace(del+'|', '')){
            console.log('not different, we delete the first one');
            console.log('deleting: '+ del+'|');
            req.session.list = String(req.session.list).replace(del+'|', '');
        }else {
            req.session.list = '';
        }
        console.log('list: ' + req.session.list);
        res.send('ok');
    }
})

app.use(function(req, res, next){
    res.setHeader('Content-type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(8080);

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/product', require('./router/productRoute'));

app.all('*', (req, res) => {
    res.status(404);

    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404Error.html'));
    }
    else if(req.accepts('json')){
        res.json({ message: "Resource not found !! "});
    }
    else{
        res.txt("Resource not found!!")
    }
})


module.exports = app


app.listen(port, () => {
    console.log(` Server running at port ${port}`);
} )
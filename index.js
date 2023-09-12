require('dotenv').config();
const fruits = require('./fruits.json');
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Fruit API");
});

app.get('/fruits', (req, res) => {
    res.send(fruits);
});

const getFruitIndex = (name) => {
    return fruits.findIndex((fruit) => fruit.name.toLowerCase() == name);
}

app.post('/fruits', (req, res) => {
    const index = getFruitIndex(req.body.name.toLowerCase());
    if (index > -1) {
        res.status(409).send("Fruit already exists");
    }else{
        //create an array of all ids
        const ids = fruits.map(fruit => fruit.id);
        //get max id
        let maxId = Math.max(...ids);
        //increment id
        maxId++;
        //adjust id to new max id
        req.body.id = maxId;
        
        fruits.push(req.body);
        res.status(201).send(req.body);
    }
    
})
app.delete('/fruits/:name', (req, res) => {
    const index = getFruitIndex(req.params.name.toLowerCase());
    if (index == -1) {
        res.status(404).send("Fruit cannot be found");
    }else{
        fruits.splice(index,1);
        res.sendStatus(200);
    }
})

app.get('/fruits/:name', (req, res) => {
    //res.send(`Return the fruit with ${req.params.name} name`)
    const name = req.params.name.toLowerCase();
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == name);
    
    if (fruit == undefined) {
        res.status(404).send(`Fruit ${name} not found`);
    }else{
        res.send(fruit);
    }
});

app.listen(port, () => console.log(`Server is now listening on port ${port}!`));
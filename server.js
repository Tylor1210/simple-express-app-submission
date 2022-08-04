const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
PORT = 3000

const connectionString = 'mongodb+srv://Ty1210:Tylor1210@cluster0.ywepnb6.mongodb.net/?retryWrites=true&w=majority'

//Older way of doing things
//MongoClient.connect(connectionString, (err, client) => {
//  if (err) return console.error(err)
//  console.log('Connected to Database')
//})

//Newer way  still a little deprecated
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected To Database')
    const db = client.db('motivational-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine','ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
      quotesCollection.find().toArray()
        .then(results => {
          //console.log(results)
          res.render('index.ejs',{quotes: results})
        })
        .catch(error => console.error(error))
  })
  app.post('/quotes',(req,res) =>{
    quotesCollection.insertOne(req.body)
      .then(result => {
        //console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })
  app.put('/quotes', (req,res) => {
    quotesCollection.findOneAndUpdate(
      {name: 'tylor'},
      {
        $set: {
          name:req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
    .then(result => {
      console.log(result)
      res.json('Success')
    })
    .catch(error => console.error(error))
  })
  app.delete('/quotes', (req,res) => {
    quotesCollection.deleteOne(
    {name: req.body.name }
    )
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json("Deleted Darth Vader's quote")
    })
    .catch(error => console.error(error))
  })
  app.listen(PORT, function() {
      console.log('listening on 3000')
  })
})
  .catch(error => console.error(error))




// My username and password for mongo U: Ty1210 p: Tylor1210
// MY CONNECTION STRING =  mongodb+srv://tylor:Tylor1210@cluster0.epsnpp7.mongodb.net/?retryWrites=true&w=majority'
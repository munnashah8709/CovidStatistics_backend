const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');


app.get('/totalRecovered', async (req, res) => {
    try {
        let recovery=[]
        const usernamedata = await connection.find();
        for(let i=0;i<usernamedata.length;i++){
            recovery.push(usernamedata[i].recovered)
        }
        let totalrecovery=0;
        for(let i=0;i<recovery.length;i++){
            totalrecovery= parseInt(totalrecovery)+recovery[i]
        }
        res.status(200).json({ data:{id:"total",totalrecovery}})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/totalActive', async (req, res) => {
    try {
        let recovery=[]
        let infecteds=[];
        const usernamedata = await connection.find();
        for(let i=0;i<usernamedata.length;i++){
            recovery.push(usernamedata[i].recovered)
            infecteds.push(usernamedata[i].infected)
        }    
        let totalrecovery=0;
        for(let i=0;i<recovery.length;i++){
            totalrecovery= parseInt(totalrecovery)+recovery[i]
        }
       let totalinfected=0;
       for(let i=0;i<infecteds.length;i++){
        totalinfected=parseInt(totalinfected)+infecteds[i]
       }   
       let totalActivecase= totalinfected-totalrecovery;
        res.status(200).json({ data:{id:"total",totalActivecase}})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  app.get('/totalDeath', async (req, res) => {
    try {
        let Deaths=[]
        const usernamedata = await connection.find();
        for(let i=0;i<usernamedata.length;i++){
            Deaths.push(usernamedata[i].death)
        }
        let totalDeaths=0;
        for(let i=0;i<Deaths.length;i++){
            totalDeaths= parseInt(totalDeaths)+Deaths[i]
        }
        res.status(200).json({ data:{id:"total",totalDeaths}})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  app.get('/hotspotStates', async (req, res) => {
    try {
        const usernamedata = await connection.find();
        var myMap = new Map()
        let aa=[]
        for(let i=0;i<usernamedata.length;i++){
            let infecteds=usernamedata[i].infected;
            let recovereds=usernamedata[i].recovered;
            let  hotspotstate=(infecteds - recovereds)/infecteds
            let hotspot=hotspotstate.toFixed(5);
          if(hotspot>0.1){
            myMap.set(usernamedata[i].state,hotspot)
          }
        }
        for(x of myMap.entries()){
            aa.push({state:x[0],rate:x[1]})
        }
        res.status(200).json({data:aa})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.get('/healthyStates', async (req, res) => {
    try {
        const usernamedata = await connection.find();
        var myMap = new Map()
        let aa=[]
        for(let i=0;i<usernamedata.length;i++){
            let infecteds=usernamedata[i].infected;
            let deths=usernamedata[i].death;
            let  mortality =deths/infecteds
            let mortalitys=mortality.toFixed(5);
          if(mortalitys<0.005){
            myMap.set(usernamedata[i].state,mortalitys)
          }
        }
        for(x of myMap.entries()){
            aa.push({state:x[0],rate:x[1]})
        }
        res.status(200).json({data:aa})
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

 

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
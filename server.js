const pug = require('pug'); 
const fs = require('fs'); 
const path = require('path');
const express = require('express'); 
const app = express(); 
const port = 3000; 

//load all data before the server starts 
let fileNames = fs.readdirSync('vendors'); 
let count = 0;
let vendorInfo = []; 
let vendorNames = [];
let currentVend = {}; 
let modified = []; 

//load all of the data from the vendors directory 
for (let i = 0; i < fileNames.length; i++){
    let directoryPath = path.join('vendors', fileNames[i]);
    let currentInfo = fs.readFileSync(directoryPath, {encoding:'utf8'});
    currentInfo = JSON.parse(currentInfo);
    vendorInfo.push(currentInfo); 
    vendorNames.push(vendorInfo[i].name);
}

//set the path for pug files 
app.set('views', './views'); 
app.set('view engine', 'pug');

app.use(express.static('public'));    
app.use(express.json());

//render the home page 
app.get('/', (request, response)=>{
    response.render('homePage');
}); 

//request for all the vendors 
app.get('/vendors', (request, response)=>{
    response.statusCode = 200; 
    response.format({
        //if request is HTML, respond with an HTML page 
        "text/html": ()=>{
            response.status(200).render('vendors', {info: vendorInfo});
        }, 
        //if request is JSON, send a JSON response, containing the vendor names
        "application/json": ()=>{
            response.status(200).json({names: vendorNames});
           
        }
    })
    
}); 

//redner the page that allows the user to add a new vendor 
app.get('/addVendor', (request, response)=>{
    response.render('addVendor'); 
    
});

//accepts a JSON encoding of a new vendor data 
app.post('/vendors', (request, response)=>{
    response.setHeader('Content-Type', 'application/JSON');
    let newVendor = request.body;
    //checks if any field is empty, and if so sends a bad request response 
    if(newVendor.name === "" || newVendor.delivery_fee === "" || newVendor.min_order === ""){
        response.statusCode = 400; 
        response.send("400: bad request - Vendor information cannot be blank");
    
    }else{
        //saves the new vendor data and sends back the JSON representation of the new vendor
        response.statusCode = 200; 
        vendorInfo[newVendor.id] = {id: newVendor.id, name: newVendor.name, min_order: newVendor.min_order, delivery_fee: newVendor.delivery_fee, supplies: {}};
        vendorNames[newVendor.id] = newVendor.name;
        response.send(vendorInfo[newVendor.id]);
    }
   
}); 


app.get("/vendors/:vendorID", (request, response)=>{
    response.format({
        //if the request is HTML, it sends back the pug page 
        "text/html": ()=>{
            currentVend = vendorInfo[request.params.vendorID];
            response.render('vendorPage', {vend: vendorInfo[request.params.vendorID], supplies: vendorInfo[request.params.vendorID].supplies});
            
        }, 
        //if the request is for JSON data, send the information of the current vendor
        "application/json": ()=>{
            let res = JSON.stringify(vendorInfo[request.params.vendorID]);
            response.statusCode = 200; 
            response.send(res);
           
        }
    });
    
});

//recived the modified data of the vendor from the client
app.post("/vendors/saveData", (request, response)=>{
    modified = request.body;
    response.send(currentVend.id.toString())
    
})

//save the modified data 
app.put("/vendors/:vendorID", (request, response,next)=>{
    
    if(request.params.vendorID > vendorNames.length){
        response.status(404).send("This ID does not match any vendor in our system.")
    }

    
    //saving modified vendor name, vendor minimum order, vendor delivery fee
    if(modified.vendorName != ""){
        currentVend.name = modified.vendorName; 
    }

    if(modified.vendorMin != ""){
        currentVend.min_order = Number(modified.vendorMin); 
    }

    if(modified.vendorDel != ""){
        currentVend.delivery_fee = Number(modified.vendorDel); 
    }

    //saving all new categories added 
    Object.keys(modified.categories).forEach(key=>{
        currentVend.supplies[`${modified.categories[key]}`] = {};
    });
   
    Object.keys(currentVend.supplies).forEach(category =>{
        Object.keys(currentVend.supplies[category]).forEach(id=>{   
                if(id > count){
                count++;
            }
        });
        
    });
    
    count++; 
  
    //adding the new data at the end of the category it was chosen to be under 
    Object.keys(modified.supplies).forEach(key=>{

         currentVend.supplies[[`${modified.supplies[key].category}`]][count]= {name: modified.supplies[key].name, description: modified.supplies[key].description, stock: modified.supplies[key].stock, price: modified.supplies[key].price};
    });
    response.end();
});

app.listen(port); 
 
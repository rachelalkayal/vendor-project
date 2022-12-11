
let count = -1;     
let allModData = [];
let addedSupplies = []; 
let addedCategories = []; 
let newCat = [];
let idk = []; 
let currentId = 0; 

function addCategory(){
    //adds a new category to the select list and to the supply list 
    newCat = ({category: document.getElementById("new-category").value}); 
    addedCategories.push(newCat.category); 
    //creates a new div with the category name as the id 
    const newDiv = document.createElement("div");
    newDiv.id = `${newCat.category}`; 
    //gets an 'array' of all the categories 
    let arrayOfCategories = document.getElementsByName("categories");

    //check if the element already exists
    for(let i = 0; i < arrayOfCategories.length; i++){
        if(arrayOfCategories[i].value.toLowerCase() === newCat.category.toLowerCase()){
            alert(`${newCat.category} already exists!`); 
            return; 
        }
    }

    document.getElementById("supplies").appendChild(newDiv);
    document.getElementById("category").innerHTML += `<option name="categories">${newCat.category}</option>`;
    document.getElementById(`${newCat.category}`).innerHTML += `<h3>${newCat.category}</h3>`;  
}

function addSupply(){ 
    count++;  

    //get all information of the added supply 
    let category = document.getElementById("category").value; 
    let supName = document.getElementById("name").value;
    let supStock = document.getElementById("stock").value;
    let supPrice = document.getElementById("price").value;
    let supDescription = document.getElementById("description").value;

    //if there is no category, alert the user to add one (mainly for newly added vendors with no supply list)
    if(category == ""){
       alert("Please add a category before you add supplies")
    }

    //add the new supplies to the list 
    addedSupplies[count]=({category: category, name: supName, price: Number(supPrice), stock: Number(supStock), description: supDescription});
    document.getElementById(category).innerHTML += `<p>${supName}</p>`;
    document.getElementById(category).innerHTML += `<p>&nbsp;&nbsp;&nbsp Price $:${Number(supPrice).toFixed(2)} Stock:${supStock}</p>`;
    document.getElementById(category).innerHTML += `<p>&nbsp;&nbsp;&nbsp ${supDescription}</p>`;

}

function saveData(){
    let newName = document.getElementById("vend-name").value;
    let newMin = document.getElementById("min-order").value; 
    let newDel = document.getElementById("delivery-fee").value;
   
    allModData = ({categories: addedCategories, vendorName: newName, vendorMin: newMin, vendorDel: newDel, supplies: addedSupplies});

    //send all modified data to the server 
    let req = new XMLHttpRequest(); 

    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            currentId = this.responseText;
            alert("Changes have been saved.");
        }
    }
    req.open("POST", 'saveData'); 
    req.setRequestHeader('Content-Type', 'application/JSON');
    req.send(JSON.stringify(allModData)); 

    //request that the server saves the modified data 
    let update = new XMLHttpRequest(); 

    update.open("PUT", '/vendors/' + currentId); 
    update.send(); 

}

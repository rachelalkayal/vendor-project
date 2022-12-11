let newVendorInfo = {}; 
let newSupply = {}; 
let id = 2; 

function addVendor(){
    id++; 
    //get information that the user has inputted 
    let venName = document.getElementById('name').value;
    let deliveryFee = Number(document.getElementById('delivery').value); 
    let minOrder = Number(document.getElementById('min-order').value); 

    newVendorInfo = {id: id, name: venName, delivery_fee: deliveryFee, min_order: minOrder};
   
    let req = new XMLHttpRequest(); 

    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //redirect the user to show the list of all vendors
             location.href = "http://localhost:3000/vendors";
        
        }else if (this.status == 400){
            //if a bad request response is sent, it shows the error and lets the user try again 
            document.getElementById("new-vendor").innerHTML = this.responseText;
            document.getElementById("back").style.display="block";
        }

    }
    req.open('POST', 'vendors');
    req.setRequestHeader('Content-Type', 'application/JSON');
    req.send(JSON.stringify(newVendorInfo)); 
}

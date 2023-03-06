// close the modal if close button is pressed
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
// open the modal if the button is pressed

function openModal(id) {
    setModaldata(id);
    document.getElementById('myModal').style.display = 'block';
}

function setModaldata(id) {
    const database = getDataFromLocalStorage().data;
    const data = database.find((element) => element.id == id);
    document.getElementById('modal_id').value = data.id;
    document.getElementById('modal_name').value = data.place;
    document.getElementById('modal_address').value = data.address;
    document.getElementById('modal_rating').value = data.rating;
    document.getElementById('modal_type').value = data.type;
    // document.getElementById('modal_file').value = data.img;
    document.getElementById('previewModalImg').src = data.img;
}
var delete_id = 0;
function openWarningModal(id) {
    delete_id = id;
    document.getElementById('warning_modal').style.display = 'block';

}
function closeWarningModal() {
    document.getElementById('warning_modal').style.display = 'none';
}




// Function for genrrating the table from dynamic data
function generateTableHead(data) {

    const tableBody = document.getElementById('table_body');
    if( tableBody == null){
        return;
    }
    let table_html  ="";
    
    data.forEach((element,index) => {
        table_html += 
        `<tr>
            <td>${element.place}</td>
            <td>${element.address}</td>
            <td>${element.rating}</td>

            <td>
                <img class="table_img" src="${element.img}" alt="Place 1" />
            </td>
            <td>
                <button
                    id="${"update"+element.id}"
                    href="#"
                    onclick="openModal(${element.id})"
                    class="btn update"
                >
                    Update
                </button>
                <button
                    id="${"delete"+element.id}"
                    onclick="openWarningModal(${element.id})"
                    href="#"
                    class="btn delete"
                >
                    Delete
                </button>
            </td>
        </tr>`;



    });
   
    

    tableBody.innerHTML = table_html;
    // return table_html;
}

function updateData(){

}
function deleteData(id){

}

// Function for searching the table
function searchInTable() {

    let database = getDataFromLocalStorage().data;
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('table_search');
    filter = input.value.toLowerCase();

    const result = database.filter((element) => {
        return (
            element.place.toLowerCase().includes(filter) ||
            element.address.toLowerCase().includes(filter) ||
            element.rating.toLowerCase().includes(filter) ||
            element.type.toLowerCase().includes(filter)
        );
    });

    generateTableHead(result);
    
}


let database = getDataFromLocalStorage();

let masterTableData = database.data;

let tableData = masterTableData;


const tableHtml = generateTableHead(tableData);




// Code for the form submission and validation

function ResetForm() {
    hidePreview();
    document.getElementById('createForm').reset();
}

function validateForm() {
    
}


function previewFile(){
    console.log("--------file changeed----------   ")
    // get image file url 
    let file = document.getElementById('myFile').files[0];
    
    console.log(URL.createObjectURL(file))

    // set image url to the image tag
    let imagePrevewer = document.getElementById('previewImg');
    imagePrevewer.src = URL.createObjectURL(file);
    imagePrevewer.style.display = "block";
}

function previewModalFile(){
    console.log("--------file changeed----------   ")
    // get image file url 
    let file = document.getElementById('modal_file').files[0];
    
    console.log(URL.createObjectURL(file))

    // set image url to the image tag
    let imagePrevewer = document.getElementById('previewModalImg');
    imagePrevewer.src = URL.createObjectURL(file);
    imagePrevewer.style.display = "block";
}

function hidePreview(){
    let imagePrevewer = document.getElementById('previewImg');
    imagePrevewer.style.display = "none";
    console.log("--------file changeed----------   ")
}
 function  createPlace(){
    // validation for the form
    let name = document.forms["createForm"]["name"].value;
    let address = document.forms["createForm"]["address"].value;
    let rating = document.forms["createForm"]["rating"].value;
    let type = document.forms["createForm"]["type"].value;
    let img_url =  document.getElementById('previewImg').src

    if(rating > 5 || rating < 0){
        alert("Rating should be between 0 to 5");
        return false;
    }

    console.log(img_url);

    const link = convertImageToBase64(img_url,function(base64Img){
        
        let new_data = {
            id: database.total + 1,
            place: name,
            address: address,
            rating: rating,
            type: type,
            img: base64Img,
        }

        database.data.push(new_data);
        database.total += 1;

        // save database in local storage

        localStorage.setItem('database', JSON.stringify(database));


        

        ResetForm();


    });
    

    showToast("Place Added Successfully"); 
    setTimeout(() => {},2000)
    window.location.href = "index.html";

    return false;
}

function updatePlace(){
    // get the data from the form
    let id = document.forms["update_form"]["modal_id"].value;
    let name = document.forms["update_form"]["modal_name"].value;
    let address = document.forms["update_form"]["modal_address"].value;
    let rating = document.forms["update_form"]["modal_rating"].value;
    let type = document.forms["update_form"]["modal_type"].value;
    let updated_img = document.forms["update_form"]["modal_file"].value;
    
    
    

    if(rating > 5 || rating < 0){
        alert("Rating should be between 0 to 5");
        return false;
    }

    // get the index of the data
    let database = getDataFromLocalStorage(); 

    let index = database.data.findIndex((element) => {
        return element.id == id;
    });


    let img_url = "";

    if(updated_img == ""){
        img_url = document.getElementById('previewModalImg').src;

        let newData= {
            id: id,
            place: name,
            address: address,
            rating: rating,
            type: type,
            img: img_url,
        }
    
        // replace the data
        
        database.data[index] = newData;
        
    
        // save database in local storage
        localStorage.setItem('database', JSON.stringify(database));
    
        // update the table
    
        generateTableHead(database.data);
        document.forms["update_form"].reset();
        closeModal();
    
    }else{
        img_url =  document.getElementById('previewModalImg').src;

        const link = convertImageToBase64(img_url,function(base64Img){

            let newData= {
                id: id,
                place: name,
                address: address,
                rating: rating,
                type: type,
                img: base64Img,
            }
        
            // replace the data
            
            database.data[index] = newData;
            
        
            // save database in local storage
            localStorage.setItem('database', JSON.stringify(database));
        
            // update the table
        
            generateTableHead(database.data);
            document.forms["update_form"].reset();
            closeModal();
        });


        
    }

    // console.log(img_url);

    // set the new data

    showToast("Updated Successfully");



    return false;

    


}

function deleteItem(){
    let id = delete_id;
    let database = getDataFromLocalStorage(); 

    let index = database.data.findIndex((element) => {
        return element.id == id;
    });

    database.data.splice(index,1);
    

    localStorage.setItem('database', JSON.stringify(database));

    generateTableHead(database.data);
    closeWarningModal();
    showToast("Deleted Successfully");
    // return false;
}




/// code for some libraries

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    toastMessage.textContent = message;
    toast.style.display = "block";
    setTimeout(function() {
      toast.style.display = "none";
    }, 3000);
}

function convertImageToBase64(imgUrl, callback) {
    const image = new Image();
    image.crossOrigin='anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      callback && callback(dataUrl)
    }
    image.src = imgUrl;
  }
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getDataFromLocalStorage(){
    let data = localStorage.getItem('database');
    let dummy_data = {
        "total": 0,
        "data": []
    }
    if(data == null){
        return dummy_data;
    }
    let Return_database = JSON.parse(data);
    return Return_database;
    // tableData = database.data;
    // generateTableHead(tableData);
}


//  code for generating sorting 


const sortTable = (dataTable,row)=>{

}


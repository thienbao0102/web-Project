var listInforSize = []; // danh sach quantity theo size
/*__________Api_________ */
function insertProduct(){
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const file = document.getElementById('uploadFile').files[0];
    const popular = document.getElementById('popular').checked;
    const sale = document.getElementById('sale').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    //validation
    if( !name || price == 0 || !category || listInforSize.length == 0){
        alert('You need to fill in data to add products!');
        return;
    }

    const formData = new FormData();
    formData.append('name',name);
    formData.append('price',price);
    formData.append('file',file);
    formData.append('popular',popular);
    formData.append('sale',sale);
    formData.append('category',category);
    formData.append('description',description);
    formData.append('sizes',JSON.stringify(listInforSize));
    
    // fetch('/api/insertProduct',{
    //     method: 'post',
    //     body: formData
    // })
    // .then(res => res.json())
    // .then(data =>{
    //     alert(data.ms);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     location.reload();
    // });
}
/*________Client_________*/ 
//add size and quantity of size
function addSize(){
    const size = document.getElementById('size').value;
    const quantity = document.getElementById('quantity').value;
    console.log(listInforSize.filter(item => item.size === size).length);
    if(size && quantity && listInforSize.filter(item => item.size === size).length ===0){
        const obj ={
            'size': size,
            'quantity': quantity
        }
        listInforSize.push(obj);
        console.log(listInforSize);
        renderSize();
        return;
    }
    if(listInforSize.filter(item => item.size === size).length ===1 && quantity){
        Object.entries(listInforSize).forEach(([item, itemData]) =>{
            if(itemData.size === size){
                itemData.quantity = quantity;
            }
        })
        renderSize();
    }

}

//render listsize
function renderSize(){
    const showListSize = document.getElementById('listSizeQuantity');
    var html ='';
    Object.entries(listInforSize).forEach(([item, itemData]) =>{
        html += `<p class="size-Infor">Size: ${itemData.size} - Quantity: ${itemData.quantity}</p>`;
    })
    console.log(html);
    showListSize.innerHTML = html;
}
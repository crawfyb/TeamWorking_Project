let carts = document.querySelectorAll('.add-cart');


let products = [
  {{#each product}}
  {
    id: {{this.product_id}},
    name: "{{this.name}}",
    price: {{this.price}},
    inCart: 0
},
  {{/each}}

];
               /console.log(products);
for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener('click', () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  })
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');

  if (productNumbers) {
    document.querySelector('.cart span').textContent = productNumbers;
  }
};

function cartNumbers(product) {
 // console.log("The product clicked is", product);
  let productNumbers = localStorage.getItem('cartNumbers');

  productNumbers=parseInt(productNumbers);

  if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.cart span').textContent = productNumbers + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.cart span').textContent = 1;
  }
  setItems(product);
};

function setItems(product) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  console.log("asfafasf", cartItems);
  // console.log('Inside of the items function');
  // console.log("my product is ", product);
  if (cartItems != null) {

    if (cartItems[product.name] == undefined) {
      cartItems = {
        ...cartItems,
        [product.name]: product
      }

    }
    cartItems[product.name].inCart += 1;
  }else {
    product.inCart = 1;

     cartItems = {
      [product.name]:product
    }
  }

  localStorage.setItem('productsInCart', JSON.stringify(cartItems))
}

function totalCost(product) {
  //console.log("the product price is ", product.price);
  let cartCost = localStorage.getItem('totalCost');
 // cartCost = parseFloat(cartCost);

  console.log("my cart cost is", cartCost);
  console.log(typeof cartCost);

  if (cartCost != null) {
    cartCost = parseInt(cartCost);

    localStorage.setItem('totalCost', cartCost + product.price)
  }else {
    localStorage.setItem('totalCost', product.price)

  }


}


function displayCart() {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  let productContainer = document.querySelector

  if (cartItems && productContainer) {
    productContainer.innerHTML = '';
    Object.values(cartItems).map(item => {
      productContainer.innerHTML += `
      <div class="product">
          <ion-icon name="close-circle"></ion-icon>
          <img src="./public/${item.id}.jpeg">
          <span>${item.name}</span>
          </div>`
    })
  }
  }

onLoadCartNumbers();
displayCart();

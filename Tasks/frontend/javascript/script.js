let API_URL = "http://localhost:3000/api/products";
let product_container = document.querySelector(".product-container");
let product_container_admin = document.querySelector(
  ".product-container-admin"
);
////using promise

// fetch(url)
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.log(`Error is ${error}`));

/// using async-await
async function fetchData() {
  try {
    let response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const products = await response.json();
    renderProducts(products);
    renderProducts_admin(products);
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

/// render products
function renderProducts(products) {
  try {
    products.forEach((product) => {
      let div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
      <img
        src="${
          product.image ||
          "https://cdn.thewirecutter.com/wp-content/media/2023/07/bluetoothheadphones-2048px-0876.jpg"
        }"
        alt="${product.name}"
        width="250px"
      />
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <small class="product-delivery-duration">Shipped in 3-4 days</small>
        <div class="product-price">${product.price}</div>
      </div>
      <div class="product-buy-links">
        <div class="add-to-cart">Add to cart</div>
        <div class="buy">Buy</div>
      </div>
  `;
      product_container.appendChild(div);
      console.log(product);
    });
  } catch (error) {
    console.log(`Error is ${error}`);
  }
}
function renderProducts_admin(products) {
  try {
    products.forEach((product) => {
      let div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
      <img
        src="${
          product.image ||
          "https://cdn.thewirecutter.com/wp-content/media/2023/07/bluetoothheadphones-2048px-0876.jpg"
        }"
        alt="${product.name}"
        width="250px"
      />
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <small class="product-delivery-duration">Shipped in 3-4 days</small>
        <div class="product-price">${product.price}</div>
      </div>
      <div class="product-buy-links">
        <div class="add-to-cart admin-add">Remove</div>
        <div class="buy">Update</div>
      </div>
  `;
      product_container_admin.appendChild(div);
      console.log(product);
    });
  } catch (error) {
    console.log(`Error is ${error}`);
  }
}

//add products
async function addProduct() {
  const addProductForm = document.querySelector("#addProductForm");
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const price = document.querySelector("#price").value.trim();
    const image = document.querySelector("#image").value.trim();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, image }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added succsessfully");
        document.querySelector("#name").value = "";
        document.querySelector("#price").value = "";
        document.querySelector("#image").value = "";
        fetchData();
      } else {
        alert("something went wrong try again letter");
      }
    } catch (error) {
      console.log(error);
      alert(`something went wrong try again letter`);
    }
  });
}

// update  products
//delete productszz

fetchData();
addProduct();

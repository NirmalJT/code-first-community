let API_URL = "http://localhost:3000/api/products";
let product_container = document.querySelector(".product-container");
const add_btn = document.querySelector("#add-product");
let isUpdating = false;
let updateId = null;
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

/// render products to the user
function renderProducts(products) {
  try {
    product_container.innerHTML = "";
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
//render products in admin panel
function renderProducts_admin(products) {
  try {
    product_container_admin.innerHTML = "";
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
        <div  data-id="${
          product.id
        }" class="add-to-cart admin-add remove">Remove</div>
        <div data-id="${product.id}" class="buy update">Update</div>
      </div>
  `;
      product_container_admin.appendChild(div);
      console.log(product);
    });
    deleteProduct();
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
async function updateProduct(products) {
  const updateBtns = document.querySelectorAll(".update");

  if (!updateBtns.length) {
    return;
  }

  updateBtns.forEach((updateBtn) => {
    updateBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = updateBtn.getAttribute("data-id");

      if (!id) {
        alert("Something went wrong");
        return;
      }
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        alert("Product not found");
        return;
      }
      add_btn.innerHTML = "Update Product";
      document.querySelector("#name").value = products[productIndex].name;
      document.querySelector("#price").value = products[productIndex].price;
      document.querySelector("#image").value = products[productIndex].image;

      add_btn.addEventListener("click", async (e) => {
        try {
          const updatedName = document.querySelector("#name").value.trim();
          const updatedPrice = document.querySelector("#price").value.trim();
          const updatedImage = document.querySelector("#image").value.trim();
          const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedName, updatedPrice, updatedImage }),
          });
          if (res.ok) {
            alert("Product updated successfully");
          } else {
            alert("something went wrong try again letter");
          }
        } catch (error) {
          console.log(error);
          alert("something went wrong try again letter");
        }
      });
    });
  });

  const id = updateBtn.getAttribute("data-id");
}
//delete products
async function deleteProduct() {
  const removeBtns = document.querySelectorAll(".remove");
  if (!removeBtns.length) {
    return;
  }

  removeBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const id = btn.getAttribute("data-id");
      if (!id) {
        alert("Product not found");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        console.log("Delete status:", res.status);

        if (res.ok) {
          alert("Your product was deleted successfully");
          await fetchData();
        } else {
          alert("Failed to delete product. Try again later.");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Try again later.");
      }
    });
  });
}

fetchData();
addProduct();

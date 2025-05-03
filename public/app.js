// This file is for frontend JavaScript functionality.
console.log("Frontend JavaScript is running!");
// Fetch product data from the API and display it on the page
fetch('/api/products')
  .then(response => response.json())
  .then(data => {
    const productList = document.getElementById('product-list');
    data.forEach(product => {
      // Create a container for each product
      const productDiv = document.createElement('div');
      productDiv.className = 'product-item';
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p>${product.description}</p>
      `;
      productList.appendChild(productDiv);
    });
  })
  .catch(error => console.error('Error fetching products:', error));
// Fetch product data from the API and display it on the page
fetch('/api/products')
  .then(response => response.json())
  .then(data => {
    const productList = document.getElementById('product-list');
    data.forEach(product => {
      // Create a container for each product
      const productDiv = document.createElement('div');
      productDiv.className = 'product-item';
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });

    // After rendering, add event listeners to the buttons
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId, data);
      });
    });
  })
  .catch(error => console.error('Error fetching products:', error));
  function addToCart(productId, products) {
    // Find the product object using the productId
    const product = products.find(p => p.id === productId);
    if (!product) return;
  
    // Retrieve the existing cart from localStorage, or start with an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      // Increase the quantity if already added
      existingItem.quantity += 1;
    } else {
      // Add the product with an initial quantity of 1
      cart.push({...product, quantity: 1});
    }
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Optional: Give user feedback that the item was added
    alert(`${product.name} added to cart!`);
  }
  
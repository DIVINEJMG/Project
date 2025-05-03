async function addToCart(productId) {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Product added to cart!');
    } else {
      alert(data.message);
    }
  }
  
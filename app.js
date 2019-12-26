document.addEventListener('DOMContentLoaded', getPlantsFromLS, getPlants(),calculateBadge, carousel);

const carouselSlides = document.getElementById("carousel");
      slide = document.getElementsByClassName("slides");
      bar = document.getElementById("bars");
      menuBar = document.getElementById("menu-bar");
      total = document.getElementById('total');
      badge = document.getElementById('badge');
      plantModal = document.getElementById('plant-modal')

function getPlants() {
  fetch('http://localhost:3000/plants')
  .then(function(res){
    return res.json();
  })
  .then(function(data) {
    let output = '';
    data.forEach(function(plant) {
      output += 
      `<section class="product">
          <div class='prod-main'>
            <img class='prodimg' 
                  src="${plant.photo}" 
                  width="280" 
                  height="200" 
                  onclick='showCard(${plant.id}, event)'>
            <h3>${plant.title}</h3>
            <p>Price: ${plant.price}₽</p>
          </div>
          <button class='btn-add' onclick='addInCart(${plant.id}, event)'>
            add
          </button>
      </section>`;
    });
    document.getElementById('catalog').innerHTML = output;
  })
  .catch(function(err){
    console.log(err);
  });
  }

// CAROUSEL START
let index = 0,
    slideIndex = 1;

showSlides(slideIndex);

function carousel() {
  for (let i = 0; i < slide.length; i++) {
    slide[i].style.display = "none";  
  }
  index++;
  if (index > slide.length) {index = 1}    
  slide[index-1].style.display = "block";  
  setTimeout(carousel, 4000);    
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  if (n > slide.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slide.length}
  for (let i = 0; i < slide.length; i++) {
    slide[i].style.display = "none";  
  }
  slide[slideIndex-1].style.display = "block";  
}
// CAROUSEL END

// SHOW AND CLOSE BAR-MENU
function  showMenu() {
  menuBar.style.width = "250px";
}

function closeMenu() {
  menuBar.style.width = "0";
}

// SHOW PLANT-INFO MODAL CARD
function showCard(id) {
  fetch('http://localhost:3000/plants')
  .then(function(res){
    return res.json();
  })
  .then(function(data) {
    data.map(function(plant) {
      if (plant.id === id) {
        plantModal.style.display = "block";
        plantModal.innerHTML = 
        `<section class="modal-content">
          <span class="close" onclick = 'closeCard()'>&times;</span>
          <div class='card-content'>
            <aside class='prod-photos'>
              <img class='prod-photo' 
                   src="${plant.photo}" 
                   onclick='showCard(${plant.id}, event)'>
            </aside>
            <aside class='prod-decription'>
              <h3>${plant.title}</h3>
              <p class='prod-title'>${plant.description}</p>
              <p>Price: ${plant.price}₽</p>
              <button class='btn-add' onclick='addInCart(${plant.id}, event)'>add</button>
            </aside>
          </div>
        </section>`;
      }
      return null
    });
  })
  .catch(function(err){
    console.log(err);
  });
  }

function closeCard() {
  plantModal.style.display = 'none';
}

// CART START
function addInCart(id) {
  fetch('http://localhost:3000/plants')
  .then(function(res){
    return res.json();
  })
  .then(function(data) {
    data.map(function(plant) {
      if (plant.id === id) {
        let cart = {};
        let item = { 'id': plant.id, 'title': plant.title, 'price': plant.price, 'photo': plant.photo };
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            if (cart[plant.id]) {
              if(cart[plant.id]['count'] < 6){
                cart[plant.id]['count'] = cart[plant.id]['count'] + 1;
              } else {
                alert('MAXIMUM PLANTS OF THIS KIND')
              }
            } 
            else {
                cart[plant.id] = item;
                cart[plant.id]['count'] = 1;
            }
        } 
        else {
            cart[plant.id] = item;
            cart[plant.id]['count'] = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        for (const plant in cart) {
          if(parseInt(plant) === id && cart[plant]['count'] === 1){
            const tr = document.createElement('tr');
            tr.innerHTML = 
                `<td>
                  <span class='plant-name'>
                    <img src="${cart[plant]['photo']}" width="80" height="80"> 
                    <span class='plant-title'>${cart[plant]['title']}</span>
                    <span class='cart-input-group'>
                      <input class='quantity' 
                             id='quantity${cart[plant]['id']}' 
                             value='${cart[plant]['count']}' 
                             type='number' readonly> 
                      <span class='plus-minus'>
                        <span class='plus' id='plus${cart[plant]['id']}'>+</span> 
                        <span class='minus' id='minus${cart[plant]['id']}'>-</span>
                      </span>
                      
                    </span>  
                    </span>
                </td>
                <td class='plant-name'>
                  <p>price:</p>
                  <input class='cart-input-price' 
                         id='price${cart[plant]['id']}' 
                         readonly 
                         value=''>
                  <span class="close" onclick='removePlant(${cart[plant]['id']},event)'>&times;
                  </span>
                </td>
                `;
                document.getElementById('cartContent').appendChild(tr)
                tr.className="plant-in-cart";
          } 

          let count = cart[plant]['count'];
          const price = document.getElementById(`price${cart[plant]['id']}`);
          const plus = document.getElementById(`plus${cart[plant]['id']}`);
          const minus = document.getElementById(`minus${cart[plant]['id']}`);
          const quantity = document.getElementById(`quantity${cart[plant]['id']}`);

          plus.addEventListener('click', plusPlant);
          minus.addEventListener('click', minusPlant);

          if (parseInt(plant) === id && 1 < count <5) {
            quantity.value = count
          }

          calculateBadge()
          calculateTotal(cart[plant])

          price.value = quantity.value * cart[plant]['price'] + "₽";

          function plusPlant() {
            if (count > 5) { return false }
            count++;
            quantity.value = count;
            price.value = cart[plant]['price'] * quantity.value + "₽";
            localStorage.getItem('cart')
            cart = JSON.parse(localStorage.getItem('cart'));
            cart[plant]['count'] = count;
            localStorage.setItem('cart', JSON.stringify(cart));
            calculateTotal(cart[plant]);
            calculateBadge()
          }

          function minusPlant() {
            if (count < 2) { return false }
            count--;
            quantity.value = count;
            price.value = cart[plant]['price'] * quantity.value + "₽";
            localStorage.getItem('cart')
            cart = JSON.parse(localStorage.getItem('cart'));
            cart[plant]['count'] = count;
            localStorage.setItem('cart', JSON.stringify(cart));
            calculateTotal(cart[plant]);
            calculateBadge()
          }  
        }
        
       }
      return null
    });
  })
  .catch(function(err){
    console.log(err);
  });
}

function calculateBadge() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  let sum = [];
  let totalsum = 0;
  for (let item in cart) {
      sum.push(cart[item]['count']);
  }
  for (let i = 0; i < sum.length; i++) {
      totalsum += sum[i]
  }
  if (totalsum === 0) {
      badge.innerHTML = ''
  } else {
      badge.innerHTML = `${totalsum}`
  }
}

function getPlantsFromLS() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  for (const plant in cart) {
      const tr = document.createElement('tr');
      tr.setAttribute('id', plant);
      tr.innerHTML = 
          `<td>
            <span class='plant-name'>
              <img src="${cart[plant]['photo']}" width="80" height="80"> 
              <span class='plant-title'>${cart[plant]['title']}</span>
              <span class='cart-input-group'>
                <input class='quantity' 
                       id='quantity${cart[plant]['id']}'
                       value='${cart[plant]['count']}' 
                       type='number' 
                       readonly> 
                <span class='plus-minus'>
                  <span class='plus' id='plus${cart[plant]['id']}'>+</span> 
                  <span class='minus' id='minus${cart[plant]['id']}'>-</span>
                </span>
                
              </span>  
              </span>
          </td>
          <td class='plant-name'>
            <p>price:</p>
            <input class='cart-input-price' id='price${cart[plant]['id']}' readonly value=''>
            <span class="close" onclick='removePlant(${cart[plant]['id']}, event)'>&times;
            </span>
          </td>
          `;
          document.getElementById('cartContent').appendChild(tr)
          tr.className="plant-in-cart";

        let count = cart[plant]['count'];
        const price = document.getElementById(`price${cart[plant]['id']}`);
        const plus = document.getElementById(`plus${cart[plant]['id']}`);
        const minus = document.getElementById(`minus${cart[plant]['id']}`);
        const quantity = document.getElementById(`quantity${cart[plant]['id']}`);

        plus.addEventListener('click', plusPlant);
        minus.addEventListener('click', minusPlant);

        price.value = quantity.value * cart[plant]['price'] + "₽";

      function plusPlant() {
        if (count > 5) { return false }
        count++;
        quantity.value = count;
        price.value = cart[plant]['price'] * quantity.value + "₽";
        localStorage.getItem('cart')
        cart = JSON.parse(localStorage.getItem('cart'));
        cart[plant]['count'] = count;
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal(cart[plant]);
        calculateBadge()
      }

      function minusPlant() {
        if (count < 2) { return false }
        count--;
        quantity.value = count;
        price.value = cart[plant]['price'] * quantity.value + "₽";
        localStorage.getItem('cart')
        cart = JSON.parse(localStorage.getItem('cart'));
        cart[plant]['count'] = count;
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal(cart[plant]);
        calculateBadge()
      }  

      calculateTotal(cart[plant])
      calculateBadge()
}}

function calculateTotal(){
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) { return false }
  let sum = [];
  let totalsum = 0;
  for (let plant in cart) {
      sum.push(cart[plant]['price']*cart[plant]['count']);
  }
  for (let i = 0; i < sum.length; i++) {
      totalsum += sum[i]
  }
  total.value = totalsum + "₽"
}

function showCart() {
  document.getElementById('cart').style.display = "block";
}

function closeCart() {
  document.getElementById('cart').style.display = 'none';
}

function removePlant(id, e) {
  e.target.parentElement.parentElement.remove();
  removePlantFromLS(id);
  calculateBadge()
}

function removePlantFromLS(element) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const id = element;
  for (const plant in cart) {
      if (cart[plant]['id'] == id) {
          delete cart[plant];
          localStorage.setItem('cart', JSON.stringify(cart));
      }
      calculateTotal(cart[plant])
  }
}


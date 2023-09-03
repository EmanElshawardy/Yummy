let sidebarSize = $(".sideMenuLeft").innerWidth();
let showData = document.getElementById("showData");
let searchContainer = document.getElementById("searchContainer");
var validName
var validEmail
var validPhone
var validAge
var validPassword
var validRepassword
var password
// <------------- Start loader ------------------->
$(document).ready(function () {
  searchByName("").then(() => {
    $(".loader").fadeOut(100);
    $("body").css("overflow", "auto");
  })
});
// <------------- End loader ------------------->

// <------------- Start side nav ------------------->
function openSideNav() {
  var sidebarContainer = $(".sideBarContainer");
  sidebarContainer.animate({ left: "0px" }, 300);
  $(".sideBarIcon").removeClass("fa-align-justify");
  $(".sideBarIcon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li").eq(i).animate({ top: "0px" }, (i + 5) * 100)
  }
}

function closeSideNav() {
  var sidebarContainer = $(".sideBarContainer");
  sidebarContainer.animate({ left: -sidebarSize }, 500);
  $(".sideBarIcon").addClass("fa-align-justify");
  $(".sideBarIcon").removeClass("fa-x");

  $(".links li").animate({ top: '300px' }, 500)
}
closeSideNav();

$(document).ready(function () {
  $(".sideMenuRight .sideBarIcon").click(function () {
    var sidebarContainer = $(".sideBarContainer");
    let navOfContainer = sidebarContainer.css("left");
    if (navOfContainer === "0px") {
      closeSideNav()
    } else {
      openSideNav()
    }
  });
});
// <------------ End side nav ------------------->

// <------------- Start Meals ------------------->
// MealDetails
async function getMealDetails(mealID) {
  closeSideNav()
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayMealDetails(responseData.meals[0])
      console.log(responseData.meals[0]);
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
// displayMeals
function displayMeals(meals) {
  let cartoona = "";
  for (let i = 0; i < meals.length; i++) {
    cartoona += `
        <div class="col-md-3">
          <div onclick="getMealDetails('${meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${meals[i].strMealThumb}" alt="">
            <div class="layer position-absolute d-flex align-items-center text-black p-2">
              <h3>${meals[i].strMeal}</h3>
            </div>
          </div>
        </div>`;
  }
  showData.innerHTML = cartoona;
}
// displayMealDetails
function displayMealDetails(meal) {
  searchContainer.innerHTML=``
  let ingredients = ``
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
    }
  }
  let tags = meal.strTags?.split(",") ?? []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }
  let cartoona = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2 class="text-white">${meal.strMeal}</h2>
          </div>
          <div class="col-md-8 text-white">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsStr}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`
  showData.innerHTML = cartoona
}
// <-------------- End Meals -------------------->

// <-----------  Start Categories Section ----------------->
// Categories
async function getCategories() {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayCategories(responseData.categories)
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
// getCategoryMeals
async function getCategoryMeals(category) {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayMeals(responseData.meals.slice(0, 20))
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
// displayCategories
function displayCategories(categories) {
  searchContainer.innerHTML=``
  let cartoona = "";

  for (let i = 0; i < categories.length; i++) {
    cartoona += `
      <div class="col-md-3">
              <div onclick="getCategoryMeals('${categories[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${categories[i].strCategoryThumb}" alt="" srcset="">
                  <div class="layer position-absolute text-center text-black p-2">
                      <h3>${categories[i].strCategory}</h3>
                      <p>${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                  </div>
              </div>
      </div>
      `
  }

  showData.innerHTML = cartoona;
}
// <----------- End Categories Section ----------------->

//<----------------- Start Area section ------------------->
// Area
async function getArea() {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayArea(responseData.meals)
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
// displayArea
function displayArea(responseData) {
  searchContainer.innerHTML=``
  let cartoona = "";

  for (let i = 0; i < responseData.length; i++) {
    cartoona += `
      <div class="col-md-3 text-white">
      <div onclick="getAreaMeals('${responseData[i].strArea}')" class="meal rounded-2 text-center">
      <i class="fa-solid fa-house-laptop fa-4x"></i>
      <h3>${responseData[i].strArea}</h3>
      </div>
      </div>
      `
  }

  showData.innerHTML = cartoona;
}
// getAreaMeals
async function getAreaMeals(area) {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayMeals(responseData.meals.slice(0, 20))
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
//<----------------- End Area section ------------------->

//<----------------- Start Ingredients Section ------------------->
// Ingredients
async function getIngredients() {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayIngredients(responseData.meals)
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
// displayIngredients
function displayIngredients(ingredients) {
  searchContainer.innerHTML=``
  let cartoona = "";
  var description
  var strIngredient
  for (let i = 0; i < 20; i++) {
    if (ingredients[i].strDescription != null) {
      strIngredient = ingredients[i].strIngredient
      if (ingredients[i].strDescription.length > 24) {
        description = ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")
      } else {
        description = ingredients[i].strDescription
      }
    }
    cartoona += `
      <div class="col-md-3 text-white">
                <div onclick="getIngredientsMeals('${strIngredient}')" class="rounded-2 text-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${strIngredient}</h3>
                        <p>${description}</p>
                </div>
        </div>
      `
  }
  showData.innerHTML = cartoona;
}
// getIngredientsMeals
async function getIngredientsMeals(ingredients) {
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayMeals(responseData.meals.slice(0, 20))
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
//<----------------- End Ingredients Section ------------------->

//<----------------- Start Search Inputs Section ------------------->
// search By Name
async function searchByName(term) {
  closeSideNav()
  $(".loading").fadeIn(300)
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
      `);

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      displayMeals(responseData.meals)

      console.log(responseData.meals);
    } else {
      console.log('Error fetching data:', apiResponse.status);
      console.log(await apiResponse.text());
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
//  show Search Inputs
function showSearchInputs() {
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`
  showData.innerHTML = "";
}

// Search By FLetter
async function searchByFLetter(term) {
  $(".loading").fadeIn(300)
  if (term == '') {
    term = ''
  }
  try {
    var apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}
        `);

    if (apiResponse.ok) {
      var responseData = await apiResponse.json();
      if (responseData.meals) {
        displayMeals(responseData.meals)

      }
      else{
        displayMeals([])
      }
    } else {
      console.log('Error fetching data:', apiResponse.status);
    }
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  $(".loading").fadeOut(300)
}
//<----------------- End Search Inputs Section ------------------->

//<----------------- Start ConactUs ------------------->
// Form Contact
function showContactsUs() {
  searchContainer.innerHTML=``
  showData.innerHTML = `<div class="contact vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="validateInputs()"  type="text" class="form-control" placeholder="Enter Your Name">
              <small id="nameError" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</small>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="validateInputs()" type="email" class="form-control " placeholder="Enter Your Email">
              <small id="emailError" class="alert alert-danger w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</small>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="validateInputs()" type="text" class="form-control " placeholder="Enter Your Phone">
              <small id="phoneError" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</small>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="validateInputs()" type="number" class="form-control " placeholder="Enter Your Age">
              <small id="ageError" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</small>
             
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="validateInputs()"   type="password" class="form-control " placeholder="Enter Your Password">
              <small id="passwordError" class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</small>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="validateInputs()"  type="password" class="form-control " placeholder="Repassword">
              <small id="repasswordError" class="alert alert-danger w-100 mt-2 d-none">Enter valid password</small>
          </div>
      </div>
      <button id="submitBtn" type="button" class="btn btn-outline-danger px-2 mt-3  " disabled " >Submit</button>
  </div>
</div> `

}
// validateInputs ContactUs
function validateInputs() {
  var nameInput = document.getElementById("nameInput");
  var emailInput = document.getElementById("emailInput");
  var phoneInput = document.getElementById("phoneInput");
  var ageInput = document.getElementById("ageInput");
  var passwordInput = document.getElementById("passwordInput");
  var repasswordInput = document.getElementById("repasswordInput");
  var emailError = document.getElementById('emailError')
  var nameError = document.getElementById('nameError')
  var phoneError = document.getElementById('phoneError')
  var ageError = document.getElementById('ageError')
  var passwordError = document.getElementById('passwordError')
  var repasswordError = document.getElementById('repasswordError')
  validName = /^[a-zA-Z ]+$/.test(nameInput.value);
  validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
  validPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
  validAge = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(ageInput.value);
  validPassword = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(passwordInput.value);
  validRepassword = repasswordInput.value === passwordInput.value;

  if (nameInput.value != null && nameInput.value != "") {
    alertContactName()
  }
  if (emailInput.value != null && emailInput.value != "") {
    alertContactEmail()
  }
  if (phoneInput.value != null && phoneInput.value != "") {
    alertContactPhone()
  }
  if (ageInput.value != null && ageInput.value != "") {
    alertContactAge()
  }
  if (passwordInput.value != null && passwordInput.value != "") {
    alertContactPassword()
  }
  if (repasswordInput.value != null && repasswordInput.value != "") {
    alertContactrePassword()
  }


  var submitBtn = document.getElementById("submitBtn");
  if (validName && validEmail && validPhone && validAge && validPassword && validRepassword) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}
// alertContactName ContactUs
function alertContactName() {
  if (validName) {
    nameError.classList.replace('d-block', 'd-none')
  }
  else {
    nameError.classList.replace('d-none', 'd-block')
  }
}
// alertContactEmail ContactUs
function alertContactEmail() {
  if (validEmail) {
    emailError.classList.replace('d-block', 'd-none')
  }
  else {
    emailError.classList.replace('d-none', 'd-block')
  }
}
// alertContactPhone ContactUs
function alertContactPhone() {
  if (validPhone) {
    phoneError.classList.replace('d-block', 'd-none')
  }
  else {
    phoneError.classList.replace('d-none', 'd-block')
  }
}
// alertContactAge ContactUs
function alertContactAge() {
  if (validAge) {
    ageError.classList.replace('d-block', 'd-none')
  }
  else {
    ageError.classList.replace('d-none', 'd-block')
  }
}
// alertContactPassword ContactUs
function alertContactPassword() {
  if (validPassword) {
    passwordError.classList.replace('d-block', 'd-none')
  }
  else {
    passwordError.classList.replace('d-none', 'd-block')
  }
}
// alertContactrePassword ContactUs
function alertContactrePassword() {
  if (validRepassword) {
    repasswordError.classList.replace('d-block', 'd-none')
  }
  else {
    repasswordError.classList.replace('d-none', 'd-block')
  }
}
//<------------------- End Contact Us------------------->

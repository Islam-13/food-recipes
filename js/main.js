const dataContainer = document.querySelector(".data-container");

function openSideNav() {
  $(".side-nav").animate({ left: 0 }, 400);

  $(".toggle-icon").removeClass("fa-align-justify");
  $(".toggle-icon").addClass("fa-x");

  $("li.nav-link").each(function (i) {
    $(this).animate({ top: 0 }, (i + 6) * 100);
  });
}

function closeSideNav() {
  $(".side-nav").animate({ left: "-256px" }, 400);

  $(".toggle-icon").removeClass("fa-x");
  $(".toggle-icon").addClass("fa-align-justify");

  $("li.nav-link").each(function (i) {
    $(this).animate({ top: "300px" }, (i + 6) * 100);
  });
}

$(".toggle-icon").click(function () {
  $(this).hasClass("fa-x") ? closeSideNav() : openSideNav();
});

async function getData(search) {
  $(".loading-page").fadeIn(100);
  const baseURL = "https://www.themealdb.com/api/json/v1/1/search.php?";
  let res = await fetch(`${baseURL}${search}`);
  res = await res.json();
  if (res.meals == null) {
    dataContainer.innerHTML = "";
    res = [];
  } else displayData(res.meals);
  $(".loading-page").fadeOut(800);
}
getData("s=");

function displayData(data) {
  let content = "";
  data.forEach((i) => {
    content += `
    <div class="col-sm-6 col-md-4 col-lg-3 cursor-pointer">
        <div onclick="getClickedMeal(${i.idMeal})"
              class="meal-box rounded overflow-hidden position-relative cursor-pointer">
            <img
                src=${i.strMealThumb}
                alt="${i.strMeal} image"
                class="w-100"/>
            <div
                class="overlay position-absolute d-flex align-items-center text-black p-2">
                <h3>${i.strMeal}</h3>
            </div>
        </div>
    </div>
    `;
  });
  dataContainer.innerHTML = content;
}

async function getClickedMeal(id) {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  res = await res.json();

  displayClickedMeal(res.meals[0]);
  $(".loading-page").fadeOut(800);
}

function displayClickedMeal(meal) {
  let content = "";
  let ingredients = "";

  for (i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");

  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  reset();

  content += `
  <button class="btn close-btn position-absolute d-flex align-items-center justify-content-center"
  onclick="closePage()" aria-label="Close">
  <i class="fa-solid fa-close fa-2xl"></i></button>
  <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2 class="mt-3 mb-0">${meal.strMeal}</h2>
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
            </div>
  `;

  dataContainer.innerHTML = content;
}

function closePage() {
  reset();
  getData("s=");
}

$(".search-name").on("keyup", function () {
  let nameVal = `s=${$(this).val()}`;
  getData(nameVal);
});

$(".search-letter").on("keyup", function (e) {
  let letterVal = "";

  $(this).val() == ""
    ? (letterVal = "f=a")
    : (letterVal = `f=${$(this).val()}`);

  getData(letterVal);
});

$(".nav-link").click(function () {
  let clickedLink = $(this).text();

  if (clickedLink == "search") searchPage();
  if (clickedLink == "categories") categoriesPage();
  if (clickedLink == "area") areasPage();
  if (clickedLink == "ingredients") ingrediantsPage();
  if (clickedLink == "contact") contactPage();
});

function searchPage() {
  reset();
  $("#search").fadeIn(1000);
}

function categoriesPage() {
  reset();
  getCategories();
}

async function getCategories() {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  res = await res.json();

  displayCategories(res.categories);
  $(".loading-page").fadeOut(800);
}

function displayCategories(arr) {
  let content = "";

  arr.forEach((i) => {
    console.log(i.strCategory);
    content += `
    <div class="col-sm-6 col-md-4 col-lg-3 cursor-pointer">
      <div onclick="getClickedCategory('${i.strCategory}')"
            class="meal-box rounded overflow-hidden position-relative cursor-pointer">
            <img
              src=${i.strCategoryThumb}
              alt="${i.strCategory} image"
              class="w-100"/>
            <div
              class="overlay position-absolute d-flex flex-column text-center align-items-center text-black p-2">
              <h3>${i.strCategory}</h3>
              <p>${i.strCategoryDescription}</p>
            </div>
        </div>
      </div>
    `;
  });
  dataContainer.innerHTML = content;
}

async function getClickedCategory(cat) {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  res = await res.json();

  displayData(res.meals.slice(0, 20));
  $(".loading-page").fadeOut(800);
}

function areasPage() {
  reset();
  getAreas();
}

async function getAreas() {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  res = await res.json();

  displayAreas(res.meals);
  $(".loading-page").fadeOut(800);
}

function displayAreas(arr) {
  let content = "";
  arr.forEach((i) => {
    content += `
    <div class="col-sm-6 col-md-4 col-lg-3 cursor-pointer text-white text-center">
        <div onclick="getClickedArea('${i.strArea}')"
              class="meal-box rounded overflow-hidden cursor-pointer">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
            <div>
                <h3 class="fw-bolder">${i.strArea}</h3>
            </div>
        </div>
    </div>
    `;
  });
  dataContainer.innerHTML = content;
}

async function getClickedArea(area) {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  res = await res.json();
  displayData(res.meals.slice(0, 20));
  $(".loading-page").fadeOut(800);
}

function ingrediantsPage() {
  reset();
  getIngrediants();
}

async function getIngrediants() {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  res = await res.json();
  res = res.meals.slice(0, 20);

  displayIngrediants(res);
  $(".loading-page").fadeOut(800);
}

function displayIngrediants(arr) {
  let content = "";
  arr.forEach((i) => {
    content += `
      <div class="col-sm-6 col-md-4 col-lg-3 cursor-pointer text-white text-center">
          <div onclick="getClickedIngredient('${i.strIngredient}')"
                class="meal-box rounded overflow-hidden cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <div>
                  <h3 class="fw-bolder">${i.strIngredient}</h3>
                  <p>${i.strDescription.split(" ").slice(0, 20).join(" ")}</p>
              </div>
          </div>
      </div>
      `;
  });
  dataContainer.innerHTML = content;
}

async function getClickedIngredient(ing) {
  $(".loading-page").fadeIn(100);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  res = await res.json();
  displayData(res.meals.slice(0, 20));
  $(".loading-page").fadeOut(800);
}

function contactPage() {
  reset();
  $("#contact").fadeIn(150);
}

function reset() {
  $("#search").fadeOut(150);
  $("#contact").fadeOut(150);
  $("input").val("");
  closeSideNav();
  dataContainer.innerHTML = "";
}

function nameValidation() {
  return /^[a-zA-Z ]{3,20}$/.test($(".nameInput").val());
}

function emailValidation() {
  return /[a-z-_.0-9]{3,20}\@[a-z]{2,8}\.[a-z]{2,3}$/.test(
    $(".emailInput").val()
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    $(".phoneInput").val()
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($(".ageInput").val());
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($(".passwordInput").val());
}

function repasswordValidation() {
  if ($(".passwordInput").val() === $(".repasswordInput").val()) return true;
}

$(".nameInput").on("blur", function () {
  nameValidation()
    ? $(".name-alert").fadeOut(600)
    : $(".name-alert").fadeIn(600);
  submitBtn();
});

$(".emailInput").on("blur", function () {
  emailValidation()
    ? $(".email-alert").fadeOut(600)
    : $(".email-alert").fadeIn(600);
  submitBtn();
});

$(".phoneInput").on("blur", function () {
  phoneValidation()
    ? $(".phone-alert").fadeOut(600)
    : $(".phone-alert").fadeIn(600);
  submitBtn();
});

$(".ageInput").on("blur", function () {
  ageValidation() ? $(".age-alert").fadeOut(600) : $(".age-alert").fadeIn(600);
  submitBtn();
});

$(".passwordInput").on("blur", function () {
  passwordValidation()
    ? $(".password-alert").fadeOut(600)
    : $(".password-alert").fadeIn(600);
  submitBtn();
});

$(".repasswordInput").on("blur", () => {
  repasswordValidation()
    ? $(".repassword-alert").fadeOut(600)
    : $(".repassword-alert").fadeIn(600);
  submitBtn();
});

function submitBtn() {
  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  )
    $(".submit-btn").removeAttr("disabled");
}


let row = document.querySelector(".row");


$(document).ready(async function () {
  await showMeals("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  $(".outer-loading").fadeOut(600, function () {
    $("body").css("overflow", "visible");
  });
});


$(".menu").click(function () {
  if ($(".nav-bar").css("left") == "0px") {
    closeNav();
  } else {
    openNav();
  }
});

function openNav() {
  $(".nav-bar").animate({
    left: "0",
  });
  $(".menu").removeClass("fa-bars");
  $(".menu").addClass("fa-xmark");

  for (let i = 0; i < 5; i++) {
    $(".nav-bar .left li")
      .eq(i)
      .animate(
        {
          top: "0px",
        },
        (i + 6) * 100
      );
  }
}

function closeNav() {
  $(".nav-bar").animate({
    left: "-16rem",
  });
  $(".menu").addClass("fa-bars");
  $(".menu").removeClass("fa-xmark");

  for (let i = 0; i < 5; i++) {
    $(".nav-bar .left li").eq(i).animate(
      {
        top: "100px",
      },
      300
    );
  }
}


async function getData(link) {
  let data = await fetch(link);
  data = await data.json();
  return data;
}


async function showMeals(link) {
  row.innerHTML = "";
  $(".inner-loading").fadeIn(300);
  let data = (await getData(link)).meals;
  let container = "";

  for (let i = 0; i < data.length; i++) {
    container += `
        <div class="col-xl-3 col-lg-4 col-md-6">
                <div onclick="showMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 w-100 h-100">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  }

  $(".inner-loading").fadeOut(300, function () {
    row.innerHTML = container;
  });
}


async function showMealDetails(mealId) {
  $(".inner-loading").fadeIn(300);
  $(".search").css("display", "none");
  row.innerHTML = "";
  let data = (
    await getData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    )
  ).meals[0];
  console.log(data);
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        data[`strMeasure${i}`]
      } ${data[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = data.strTags ? data.strTags.split(",") : [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let container = `
    <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${data.strMealThumb}"
                    alt="">
                    <h2>${data.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p>${data.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${data.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${data.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${data.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${data.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  $(".inner-loading").fadeOut(300, function () {
    row.innerHTML = container;
  });
}


async function showCategories() {
  $(".search").css("display", "none");
  row.innerHTML = "";
  $(".inner-loading").fadeIn(300);
  let data = (
    await getData("https://www.themealdb.com/api/json/v1/1/categories.php")
  ).categories;
  let container = "";

  for (let i = 0; i < data.length; i++) {
    container += `
        <div class="col-md-3">
                <div onclick="showMeals('https://www.themealdb.com/api/json/v1/1/filter.php?i=${
                  data[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2">
                    <img class="w-100" src="${
                      data[i].strCategoryThumb
                    }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${data[i].strCategory}</h3>
                        <p>${data[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  closeNav();
  $(".inner-loading").fadeOut(300, function () {
    row.innerHTML = container;
  });
}


async function showArea() {
  $(".search").css("display", "none");
  row.innerHTML = "";
  $(".inner-loading").fadeIn(300);
  let data = (
    await getData("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
  ).meals;
  let container = "";

  for (let i = 0; i < data.length; i++) {
    container += `
        <div class="col-md-3 text-white">
                <div onclick="showMeals('https://www.themealdb.com/api/json/v1/1/filter.php?a=${data[i].strArea}')" class="area rounded-2 text-center">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${data[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  closeNav();
  $(".inner-loading").fadeOut(300, function () {
    row.innerHTML = container;
  });
}


async function showIngredients() {
  $(".search").css("display", "none");
  row.innerHTML = "";
  $(".inner-loading").fadeIn(300);
  let data = (
    await getData("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
  ).meals.slice(0, 20);
  let container = "";

  for (let i = 0; i < data.length; i++) {
    container += `
        <div class="col-md-3 text-white">
                <div onclick="showMeals('https://www.themealdb.com/api/json/v1/1/filter.php?i=${
                  data[i].strIngredient
                }')" class="ingredient rounded-2 text-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${data[i].strIngredient}</h3>
                        <p>${data[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  closeNav();
  $(".inner-loading").fadeOut(300, function () {
    row.innerHTML = container;
  });
}


function showSearch() {
  $(".search").css("display", "block");
  row.innerHTML = "";
  closeNav();
}


function searchByName(e) {
  if (e.value != "") {
    showMeals(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${e.value}`
    );
  } else {
    row.innerHTML = "";
  }
}


async function searchByLetter(e) {
  if (e.value != "") {
    $(".inner-loading").fadeIn(300);
    let filteredMeals = (
      await getData(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${e.value}`
      )
    ).meals.filter((meal) => {
      return meal.strMeal.startsWith(e.value.toUpperCase());
    });

    let container = "";

    for (let i = 0; i < filteredMeals.length; i++) {
      container += `
        <div class="col-md-3">
                <div onclick="showMealDetails('${filteredMeals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                    <img class="w-100" src="${filteredMeals[i].strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 w-100 h-100">
                        <h3>${filteredMeals[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
    }

    $(".inner-loading").fadeOut(300, function () {
      row.innerHTML = container;
    });
  } else {
    row.innerHTML = "";
  }
}


function showContacts() {
  $(".search").css("display", "none");

  row.innerHTML = `<div class="contact vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-12">
                <input id="nameInput" onkeyup="validUsername()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-12">
                <input id="emailInput" onkeyup="validEmail()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-12">
                <input id="phoneInput" onkeyup="validPhone()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-12">
                <input id="ageInput" onkeyup="validAge()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-12">
                <input  id="passwordInput" onkeyup="validPassword()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-12">
                <input  id="repasswordInput" onkeyup="validRepassword(${this.value})" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 w-50 mt-3">Submit</button>
    </div>
  </div> `;

  closeNav();
}


function validEmail() {
  let result =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      $("#emailInput").val()
    );
  showAlert(result, "#emailAlert");
}


function validPhone() {
  let result = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    $("#phoneInput").val()
  );
  showAlert(result, "#phoneAlert");
}

function validUsername() {
  let result = /^[a-zA-Z ]+$/.test($("#nameInput").val());
  showAlert(result, "#nameAlert");
}


function validAge() {
  let result = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    $("#ageInput").val()
  );
  showAlert(result, "#ageAlert");
}


function validPassword() {
  let result = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    $("#passwordInput").val()
  );
  showAlert(result, "#passwordAlert");
}


function validRepassword() {
  let result = $("#repasswordInput").val() == $("#passwordInput").val();
  showAlert(result, "#repasswordAlert");
}


function showAlert(result, idName) {
  if (result) {
    $(idName).addClass("d-none");
    $(idName).removeClass("d-block");
    showSubmit();
  } else {
    $(idName).addClass("d-block");
    $(idName).removeClass("d-none");
    $("#submitBtn").attr("disabled", true);
  }
}


function showSubmit() {
  let age = false;
  let name = false;
  let email = false;
  let phone = false;
  let password = false;
  let repassword = false;

  if ($("#emailInput").val() != "" && $("#emailAlert").hasClass("d-none")) {
    email = true;
  }

  if ($("#nameInput").val() != "" && $("#nameAlert").hasClass("d-none")) {
    name = true;
  }

  if ($("#ageInput").val() != "" && $("#ageAlert").hasClass("d-none")) {
    age = true;
  }

  if ($("#phonelInput").val() != "" && $("#phoneAlert").hasClass("d-none")) {
    phone = true;
  }

  if (
    $("#passwordInput").val() != "" &&
    $("#passwordAlert").hasClass("d-none")
  ) {
    password = true;
  }

  if (
    $("#repasswordInput").val() != "" &&
    $("#repasswordAlert").hasClass("d-none")
  ) {
    repassword = true;
  }

  if (age && phone && email && name && password && repassword) {
    $("#submitBtn").attr("disabled", false);
  }
}
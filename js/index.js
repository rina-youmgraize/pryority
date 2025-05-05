let urlParam = new URLSearchParams(window.location.search);
let id = urlParam.get("id");
if (id == null || isNaN(id)) {
    window.location.href = "register.html";
}
let portfoliosArrayFromStorage = [];
if (localStorage.getItem("portfolios")) {
    portfoliosArrayFromStorage = JSON.parse(localStorage.getItem("portfolios"));
} else {
    alert(`There is NO data in Local Storage.`);
    window.history.back();
}
if (portfoliosArrayFromStorage.length == 0) {
    alert(`There is NO data in Local Storage.`);
    window.history.back();
}

let p = portfoliosArrayFromStorage.find(item => item.id == id);
if (p) {
    //put data in html elements here
    // p.fullName;
    // p.age;
    // p.title;
    // p.picture;
    // p.userName;
    // p.email;
    // p.phone;
    // p.city;    
    // p.about;
    // p.skills;
    // p.projects;
    // p.gitAddr;
    // p.linkedAddr;
    // p.showWeather;
    // p.showForex;

    if (p.showWeather == false) {
        document.getElementById("wether-container").style.display = "none";
    }
    if (p.showForex == false) {
        document.getElementById("converterCard").style.display = "none";
    }


}

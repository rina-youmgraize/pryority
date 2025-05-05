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
document.getElementById("picture").src = p.picture;

}

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.d-flex.justify-content-center.fs-2.gap-4 a');

    links.forEach(link => {
      const iconClass = link.querySelector('i').classList;
      if (iconClass.contains('bi-linkedin')) {
        link.href = 'https://www.linkedin.com/in/%D7%A8%D7%99%D7%A0%D7%94-%D7%99%D7%95%D7%A0%D7%92%D7%A8%D7%99%D7%99%D7%96-75661233a';
      } else if (iconClass.contains('bi-github')) {
        link.href = 'https://github.com/rina-youmgraize';
      }
    });
  });
class PortfolioUser {
    constructor(id, fullName, age, title, picture, userName, email, phone, city, password, about, skills, projects, gitAddr, linkedAddr, showWeather, showForex, areas) {
        this.id = id;
        this.fullName = fullName;
        this.age = age;
        this.title = title;
        this.picture = picture;
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.password = password;
        this.about = about;
        this.skills = skills;
        this.projects = projects;
        this.gitAddr = gitAddr;
        this.linkedAddr = linkedAddr;
        this.showWeather = showWeather;
        this.showForex = showForex;
        this.areas = areas;
    }
}

const sleep = (timeInSeconds) => new Promise((resolve) => setTimeout(resolve, 1000 * timeInSeconds));
let fullName = document.getElementById("fullName");
let age = document.getElementById("age");
let academinTitle = document.getElementById("academinTitle");

let userName = document.getElementById("userName");
let eMail = document.getElementById("eMail");
let phone = document.getElementById("phone");
let ciTy = document.getElementById("ciTy");
let password = document.getElementById("password");
let ConfirmPassword = document.getElementById("ConfirmPassword");
let picOption = document.getElementById("picOption");
let thePicOnSide = document.getElementById("thePic");
let spinner = document.getElementById("spinner");

let aboutTxtArea = document.getElementById("aboutTxtArea");
let skillsTxtArea = document.getElementById("skillsTxtArea");
let projsTxtArea = document.getElementById("projsTxtArea");
let gitAddr = document.getElementById("gitAddr");
let linkedInAddr = document.getElementById("linkedInAddr");
let addWeather = document.getElementById("addWeather");
let addForex = document.getElementById("addForex");

let updateBtn = document.getElementById("updateBtn");
let topTitle = document.getElementById("topTitle");

let idUser;
let urlParam = new URLSearchParams(window.location.search);
let pageStatus = urlParam.get("pageStatus");
if (pageStatus == null) {
    pageStatus = "New";
    updateBtn.innerText = "Save";
    topTitle.innerText = "Please Register to your Portfolio:";
} else {
    //has to be "Update"
    if (pageStatus != "Update") {
        pageStatus = "Update";
    }
    updateBtn.innerText = "Update";
    topTitle.innerText = "Edit your details:"
    idUser = urlParam.get("idUser");
    idUser = Number(idUser);
    loadUserDataIntoForm(idUser);
}

function loadUserDataIntoForm(idUser) {
    if (idUser == null || isNaN(idUser)) return;
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

    let p = portfoliosArrayFromStorage.find(item => item.id == idUser);
    if (p) {
        // let p = new PortfolioUser(
        //     idUser, p.fullName, p.age, p.title, p.picture, p.userName, p.email, p.phone, p.city, p.password, p.about, p.skills,
        //     p.projects, p.gitAddr, p.linkedAddr, p.showWeather, p.showForex);

        //put data in html elements here
        fullName.value = p.fullName;
        age.value = p.age;
        academinTitle.value = p.title;
        thePicOnSide.src = p.picture;
        userName.value = p.userName;
        eMail.value = p.email;
        phone.value = p.phone;
        ciTy.value = p.city;
        password.value = p.password;
        aboutTxtArea.value = p.about;
        skillsTxtArea.value = p.skills;
        projsTxtArea.value = p.projects;
        gitAddr.value = p.gitAddr;
        linkedInAddr.value = p.linkedAddr;
        addWeather.checked = p.showWeather;
        addForex.checked = p.showForex;

        //area1,2,3:
        if (Array.isArray(p.areas)) {
            if (p.areas.length > 0) {
                for (let i = 0; i < 3; i++) {
                    if (p.areas[i] != null && p.areas[i].length > 0) {
                        document.getElementById(`area${i + 1}`).value = p.areas[i];
                    }
                }
            }
        }
    }
}

function takeImg(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            resolve(reader.result);
        }
        reader.onerror = function () {
            reject(reader.error);
        }
    });
}

picOption.addEventListener(
    "change",
    async () => {
        if (picOption.files[0]) {
            let imgOn64 = await takeImg(picOption.files[0]);
            if (imgOn64.length > 0) {
                thePicOnSide.src = imgOn64;
            }
        }
    }
);

document.getElementById("cancelBtn").addEventListener(
    "click",
    () => {
        document.location.href = "./index.html";
    }
);

document.getElementById("updateBtn").addEventListener(
    "click",
    async () => {
        // fullName
        // age
        // academinTitle
        // aboutTxtArea
        // skillsTxtArea
        // projsTxtArea
        // gitAddr 
        // linkedInAddr
        // addWeather
        // addForex
        // areas

        //pageStatus ("New" / "Update")
        //idUser (global, by degault == undefined)
        if (pageStatus != "New" && (idUser == undefined || idUser == null)) {
            alert("Your User Id is NOT known to the page. Try again.");
            return;
        }
        if (fullName.value == "" || age.value == "" || academinTitle.value == "") {
            alert("Full Name, age and title fields are required!");
            return;
        }
        if (aboutTxtArea.value == "") {
            alert("Please put something in your 'About' area.");
            return;
        }
        if (userName.value == "" || eMail.value == "" || phone.value == "" || ciTy.value == "" || password.value == "") {
            alert("User Name, email address, phone number, city and password fields must be filled!");
            return;
        }
        if (ConfirmPassword.value == "") {
            alert("You should confirm your password");
            ConfirmPassword.focus();
            return;
        } else if (ConfirmPassword.value != password.value) {
            alert("The confirmed password must be exactly the same as your password.");
            ConfirmPassword.focus();
            return;
        }

        spinner.style.display = "block";
        await sleep(1);

        let portfolioFromStorage = [];
        //localstogare
        if (localStorage.getItem("portfolios")) {
            portfolioFromStorage = JSON.parse(localStorage.getItem("portfolios"));
        }

        //id
        if (pageStatus == "New") {
            if (portfolioFromStorage.length == 0) {
                idUser = 1;
            } else {
                idUser = Math.max(...portfolioFromStorage.map(item => item.id)) + 1;
            }
        } else {
            // idUser should already be set above.   
        }


        //if "new" - check if already exists by userName or email
        if (pageStatus == "New") {
            let test = portfolioFromStorage.find(item => (item.userName == userName.value || item.email == eMail.value));
            if (test) {
                spinner.style.display = "none";
                alert(`A Portfolio with this User Name or Email address already exists! Use Login area on top-right of the page.`);
                return;
            }
        }



        //deal with picture
        let imgOn64 = "";
        let defaultPicture = "./resources/user.png";
        let finalPicture = "";
        if (picOption.files[0]) {
            imgOn64 = await takeImg(picOption.files[0]);
            if (imgOn64 == "") {
                finalPicture = defaultPicture;
            } else {
                finalPicture = imgOn64;
            }
        } else {

            if (thePicOnSide.src.length > 0) {
                //let it stay the way it is.
                finalPicture = thePicOnSide.src;
            } else {
                //use default picture
                finalPicture = defaultPicture;
            }
        }

        //areas
        let areas = ["", "", ""];
        for (i = 1; i <= 3; i++) {
            let tmpArea = document.getElementById(`area${i}`).value;
            if (tmpArea.length > 0) {
                areas[i - 1] = tmpArea;
            }
        }


        let portfolio = new PortfolioUser(idUser, fullName.value, age.value, academinTitle.value, finalPicture, userName.value,
            eMail.value, phone.value, ciTy.value, password.value, aboutTxtArea.value, skillsTxtArea.value, projsTxtArea.value,
            gitAddr.value, linkedInAddr.value, addWeather.checked, addForex.checked, areas);

        if (pageStatus == "New") {
            portfolioFromStorage.push(portfolio);
        } else {
            let tempFortf = portfolioFromStorage.find(item => item.id == idUser);
            if (tempFortf) {
                //tempFortf = portfolio; NO GOOD!
                Object.assign(tempFortf, portfolio); //overwrite the object with the class object, preserving the original reference.
            } else {
                spinner.style.display = "none";
                alert(`Couldn't find Portfolio User with id ${idUser}! Can't save data!`);
                return;
            }
        }
        localStorage.setItem("portfolios", JSON.stringify(portfolioFromStorage));
        spinner.style.display = "none";
        window.location.href = `index.html?id=${idUser}`;
    }
);
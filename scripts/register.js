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

let portfoliosArrayFromStorage = [];
if (localStorage.getItem("portfolios")) {
    portfoliosArrayFromStorage = JSON.parse(localStorage.getItem("portfolios"));
}
let loginByPassword = document.getElementById("loginByPassword");
let loginByEMail = document.getElementById("loginByEMail");

function loginPlease() {
    let mail = loginByEMail.value;
    let pass = loginByPassword.value;
    if (mail == "" || pass == "") {
        return;
    }
    let test = portfoliosArrayFromStorage.find(item => (item.email == mail || item.password == pass));
    if (test) {
        //goto index
        window.location.href = `index.html?id=${test.id}`;
    } else {
        alert("No such user found with these mail address and password.");
    }
}



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
// let skillsTxtArea = document.getElementById("skillsTxtArea");
let skillsDiv = document.getElementById("skillsDiv");
// let projsTxtArea = document.getElementById("projsTxtArea");
let projsDiv = document.getElementById("projsDiv");
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
    let i = 0;
    if (idUser == null || isNaN(idUser)) return;
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
        // skillsTxtArea.value = p.skills;
        // projsTxtArea.value = p.projects;
        gitAddr.value = p.gitAddr;
        linkedInAddr.value = p.linkedAddr;
        addWeather.checked = p.showWeather;
        addForex.checked = p.showForex;

        //area1,2,3:
        if (Array.isArray(p.areas)) {
            if (p.areas.length > 0) {
                for (i = 0; i < 3; i++) {
                    if (p.areas[i] != null && p.areas[i].length > 0) {
                        document.getElementById(`area${i + 1}`).value = p.areas[i];
                    }
                }
            }
        }

        //p.skills array
        let num = 0;
        if (Array.isArray(p.skills)) {
            for (i in p.skills) {
                if (p.skills[i] != "") {
                    //add it
                    addSkill();
                    num = Number(i) + 1;
                    document.getElementById(`skill${num}`).value = p.skills[i];
                }
            }
        }

        //p.projects array
        if (Array.isArray(p.projects)) {
            num = 1;
            for (i in p.projects) {
                let oneProj = p.projects[i];
                if (oneProj.projName != "" && oneProj.projDescr != "" && oneProj.projPicUrl != "") {
                    addProj();
                    document.getElementById(`projName${num}`).value = oneProj.projName;
                    document.getElementById(`projDescr${num}`).value = oneProj.projDescr;
                    document.getElementById(`projPicUrl${num}`).value = oneProj.projPicUrl;
                    num++;
                }
            }
        }
    }
    document.getElementById("userName").focus();
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
        // skill${numSkill} by: skillsDiv.childElementCount

        //projects array:
        //document.getElementById(`projName${num}`).value = oneProj.projName;
        // document.getElementById(`projDescr${num}`).value = oneProj.projDescr;
        // document.getElementById(`projPicUrl${num}`).value = oneProj.projPicUrl;
        // projsDiv.childElementCount

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

        //areas array
        let areas = ["", "", ""];
        for (i = 1; i <= 3; i++) {
            let tmpArea = document.getElementById(`area${i}`).value;
            if (tmpArea.length > 0) {
                areas[i - 1] = tmpArea;
            }
        }

        //skills array
        let skillsArr = [];
        // skill${numSkill} by: skillsDiv.childElementCount
        for (i = 1; i <= skillsDiv.childElementCount; i++) {
            let tempSkill = document.getElementById(`skill${i}`);
            if (tempSkill) {
                if (tempSkill.value != "") {
                    skillsArr.push(tempSkill.value);
                }
            }
        }

        //projects array:
        //document.getElementById(`projName${num}`).value = oneProj.projName;
        // document.getElementById(`projDescr${num}`).value = oneProj.projDescr;
        // document.getElementById(`projPicUrl${num}`).value = oneProj.projPicUrl;
        // projsDiv.childElementCount
        let projsArr = [];
        for (i = 1; i <= projsDiv.childElementCount; i++) {
            let projName = document.getElementById(`projName${i}`).value;
            let projDescr = document.getElementById(`projDescr${i}`).value;
            let projPicUrl = document.getElementById(`projPicUrl${i}`).value;
            if (projName == "" && projDescr == "" && projPicUrl == "") {
                i--;
                //don't save empty data
            } else {
                let tmpObj = {
                    projName: projName,
                    projDescr: projDescr,
                    projPicUrl: projPicUrl
                };
                projsArr.push(tmpObj);
            }
        }

        let portfolio = new PortfolioUser(idUser, fullName.value, age.value, academinTitle.value, finalPicture, userName.value,
            eMail.value, phone.value, ciTy.value, password.value, aboutTxtArea.value, skillsArr, projsArr,
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

function deleteSkill(numOfSkill) {
    if (numOfSkill == null) return;
    if (isNaN(numOfSkill)) return;
    let divId = `immdt${numOfSkill}`;
    document.getElementById(divId).remove();
}

function deleteProj(projsImmdtDiv) {
    if (!projsImmdtDiv) return;
    projsImmdtDiv.remove();
}

function addSkill() {
    //The container div is called: skillsDiv
    let numSkill = skillsDiv.childElementCount + 1;

    //the immediate div is: skillsImmdtDiv
    let skillsImmdtDiv = document.createElement("div");
    skillsImmdtDiv.className = "immediates";
    skillsImmdtDiv.id = `immdt${numSkill}`

    //creating a new "skill" span element
    let skill = document.createElement("input");
    skill.type = "text";
    skill.className = "skillClass";

    skill.id = `skill${numSkill}`;
    skill.placeholder = "write a skill you have"

    //creating a deletion btn for that skill
    let newBtn = document.createElement("button");
    newBtn.id = `deleteSkill${numSkill}`;
    newBtn.className = "deleteSkillBtnClass btn-secondary";
    newBtn.addEventListener('click', () => { deleteSkill(numSkill) });
    newBtn.title = "Delete this skill";

    //append to skillsImmdtDiv
    skillsImmdtDiv.append(skill, newBtn)

    //append to skillsDiv
    skillsDiv.append(skillsImmdtDiv);
    skill.focus();
}

function addProj() {
    //The container div is called: projsDiv
    let numProj = projsDiv.childElementCount + 1;

    //the immediate div is: projsImmdtDiv
    let projsImmdtDiv = document.createElement("div");
    projsImmdtDiv.className = "immediates";
    projsImmdtDiv.id = `immdtProj${numProj}`

    //creating a new "project Name" span element
    let projName = document.createElement("input");
    projName.type = "text";
    projName.className = "skillClass";
    projName.id = `projName${numProj}`;
    projName.placeholder = "Project Name"

    //creating a new "project Description" span element
    let projDescr = document.createElement("input");
    projDescr.type = "text";
    projDescr.className = "skillClass";
    projDescr.id = `projDescr${numProj}`;
    projDescr.placeholder = "Project Description"

    //creating a new "project Picture URL" span element
    let projPicUrl = document.createElement("input");
    projPicUrl.type = "text";
    projPicUrl.className = "skillClass";
    projPicUrl.id = `projPicUrl${numProj}`;
    projPicUrl.placeholder = "Project's Picture URL"

    //creating a deletion btn for that skill
    let newBtn = document.createElement("button");
    newBtn.id = `deleteProj${numProj}`;
    newBtn.className = "deleteSkillBtnClass btn-secondary";
    newBtn.addEventListener('click', () => { deleteProj(projsImmdtDiv) });
    newBtn.title = "Delete this Project";

    //append to projsImmdtDiv
    projsImmdtDiv.append(projName, projDescr, projPicUrl, newBtn);

    //append to projsDiv
    projsDiv.append(projsImmdtDiv);
    projName.focus();
}



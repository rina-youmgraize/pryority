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
    // p.areas

    if (p.showWeather == false) {
        document.getElementById("wether-container").style.display = "none";
    }
    if (p.showForex == false) {
        document.getElementById("converterCard").style.display = "none";
    }
    document.getElementById("picture").src = p.picture;
    document.getElementById("titleFromData").innerText = p.title;
    document.getElementById("spanFullName").innerText = p.fullName;
    document.getElementById("aboutSectionFromData").innerText = p.about;
    document.getElementById("linkedInLink").href = p.linkedAddr;
    document.getElementById("gitLink").href = p.gitAddr;

    tempAreasCompleteString = ""
    if (Array.isArray(p.areas)) {
        for (let i in p.areas) {
            if (p.areas[i].length > 0) {
                tempAreasCompleteString += ((tempAreasCompleteString.length > 0 ? '&nbsp;&middot;&nbsp;' : '') + p.areas[i]);
            }
        }
    }
    if (tempAreasCompleteString.length == 0) {
        tempAreasCompleteString = "Portfolio:"
    }
    document.getElementById("areasString").innerHTML = tempAreasCompleteString;

    showSkills(p.skills);
}

// document.addEventListener('DOMContentLoaded', function() {
// const links = document.querySelectorAll('.d-flex.justify-content-center.fs-2.gap-4 a');

// links.forEach(link => {
//   const iconClass = link.querySelector('i').classList;
//   if (iconClass.contains('bi-linkedin')) {
//     link.href = 'https://www.linkedin.com/in/%D7%A8%D7%99%D7%A0%D7%94-%D7%99%D7%95%D7%A0%D7%92%D7%A8%D7%99%D7%99%D7%96-75661233a';
//   } else if (iconClass.contains('bi-github')) {
//     link.href = 'https://github.com/rina-youmgraize';
//   }
// });
//   });

document.getElementById("editPortfolio").addEventListener(
    'click',
    () => {
        if (!id) return;
        window.location.href = `register.html?pageStatus=Update&idUser=${id}`;
    }
);

document.getElementById("registerNew").addEventListener(
    'click',
    () => {
        window.location.href = `register.html`;
    }
);




function showSkills(skillsArr){
    if(!Array.isArray(skillsArr)) return;
    if(skillsArr.length == 0) return;
    let howManyRows = 0;
    let s = `
        <div class="card shadow border-0 rounded-4 mb-5">
            <div class="card-body p-5">
                <div class="mb-5">
                    <div class="d-flex align-items-center mb-4">
                        <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3"><i class="bi bi-tools"></i></div>
                        <h3 class="fw-bolder mb-0"><span class="text-gradient d-inline">Professional Skills</span></h3>
                    </div>    
    `;

    if(skillsArr.length < 4){
        howManyRows =1;   
    }else {
        howManyRows = Math.ceil(skillsArr.length / 3);
    }
    let i = 0;
    for(let currRow = 1; currRow <= howManyRows; currRow++){
        if(currRow < howManyRows){
            s += `<div class="row row-cols-1 row-cols-md-3 mb-4">`;
        }else{
            s += `<div class="row row-cols-1 row-cols-md-3">`;  
        }
        
        // if(currRow == 1){
        //     s += `<div class="row row-cols-1 row-cols-md-3 mb-4">`;   
        // }else{
        //     s += `<div class="row row-cols-1 row-cols-md-3">`;
        // }
        i = (currRow - 1) * 3;
        while(i < (currRow * 3)){
            if(skillsArr[i] == undefined) break;
            s += `<div class="col mb-4 mb-md-0"><div class="oneSkillClass d-flex align-items-center bg-light rounded-4 p-3 h-100">${skillsArr[i]}</div></div>`;
            // if(i < ((currRow * 3) - 1)){
            //     s += `<div class="col mb-4 mb-md-0"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">${skillsArr[i]}</div></div>`;
            // }else{
            //     s += `<div class="col"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">${skillsArr[i]}</div></div>`;
            // }
            i++;           
        }

        s += `</div>`;
    }



                                    // <div class="row row-cols-1 row-cols-md-3 mb-4">
                                    //     <div class="col mb-4 mb-md-0"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">SEO/SEM Marketing</div></div>
                                    //     <div class="col mb-4 mb-md-0"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">Statistical Analysis</div></div>
                                    //     <div class="col"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">Web Development</div></div>
                                    // </div>
                                    // <div class="row row-cols-1 row-cols-md-3">
                                    //     <div class="col mb-4 mb-md-0"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">Network Security</div></div>
                                    //     <div class="col mb-4 mb-md-0"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">Adobe Software Suite</div></div>
                                    //     <div class="col"><div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">User Interface Design</div></div>
                                    // </div>


    s += `
                </div>
            </div>
        </div>
    `;

    document.getElementById("skillsSectionContainer").innerHTML = s;
}



                        // <div class="card shadow border-0 rounded-4 mb-5">
                        //     <div class="card-body p-5">
                        //         <div class="mb-5">

                        //             <div class="d-flex align-items-center mb-4">
                        //                 <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3"><i class="bi bi-tools"></i></div>
                        //                 <h3 class="fw-bolder mb-0"><span class="text-gradient d-inline">Professional Skills</span></h3>
                        //             </div>
                                    
                                    
                        //         </div>
                        //     </div>
                        // </div>
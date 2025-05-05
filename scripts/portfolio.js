let currencies = [];

window.onload = async () => {
    if (localStorage.getItem("currencies")) {
        currencies = JSON.parse(localStorage.getItem("currencies"));
    } else {
        currencies = await getCurrenecies();
        localStorage.setItem("currencies", JSON.stringify(currencies));
    }
    //console.log(currencies);
    fillDropdowns();
}

//get latest rates data from https://api.currencyfreaks.com/v2.0/rates/latest?apikey=44a2408ef15647fa8ee09b74bfea9c87
async function getLatestRates() {
    let response = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=44a2408ef15647fa8ee09b74bfea9c87', {
        method: "GET",
        redirect: "follow"
    });
    let rawLatestRates = await response.json();
    let originalDateProp = rawLatestRates.date;
    let originalBaseProp = rawLatestRates.base;
    let originalRatesProp = rawLatestRates.rates; //it is an object
    let relevantRatesObj = {
        SEK: originalRatesProp.SEK,
        LYD: originalRatesProp.LYD,
        SGD: originalRatesProp.SGD,
        BGN: originalRatesProp.BGN,
        HTG: originalRatesProp.HTG,
        HUF: originalRatesProp.HUF,
        USD: originalRatesProp.USD,
        BOB: originalRatesProp.BOB,
        ILS: originalRatesProp.ILS,
        TRY: originalRatesProp.TRY,
        EUR: originalRatesProp.EUR,
    };
    let newObjForReturn = {
        date: originalDateProp,
        base: originalBaseProp,
        rates: relevantRatesObj
    }
    return newObjForReturn;
}

//get currency data from https://api.currencyfreaks.com/v2.0/supported-currencies
async function getCurrenecies() {
    let tmpArr = [];
    let response = await fetch('https://api.currencyfreaks.com/v2.0/supported-currencies', {
        method: "GET",
        headers: {
            'content-type': 'application/json'
        }
    });
    let rawCurrencies = await response.json();
    let codes = ["SEK", "LYD", "SGD", "BGN", "HTG", "HUF", "USD", "BOB", "ILS", "TRY", "EUR"];
    for (let i in codes) {
        let tmpObj = rawCurrencies.supportedCurrenciesMap[`${codes[i]}`];
        let minimizedObj = {
            currencyCode: tmpObj.currencyCode,
            currencyName: tmpObj.currencyName,
            countryName: tmpObj.countryName,
            icon: tmpObj.icon
        };
        tmpArr.push(minimizedObj);
    }
    return tmpArr;
}

function fillDropdowns() {
    let sFrom = "";
    let sTo = "";
    let fromCurrencyUL = document.getElementById("fromCurrencyUL");
    let toCurrencyUL = document.getElementById("toCurrencyUL");

    for (i in currencies) {
        let oneCurr = currencies[i];
        sFrom = `
            <li>
                <a class="dropdown-item d-flex align-items-center" href="#" id="from${oneCurr.currencyCode}" data-namecurr="${oneCurr.currencyName}" data-iconcurr = "${oneCurr.icon}">                    
                    <img src="${oneCurr.icon}" alt="${oneCurr.currencyCode}" width="20" height="14" class="me-2">${oneCurr.currencyName}
                </a>
            </li>
        `;
        sTo = `
            <li>
                <a class="dropdown-item d-flex align-items-center" href="#" id="to${oneCurr.currencyCode}" data-namecurr="${oneCurr.currencyName}" data-iconcurr = "${oneCurr.icon}">
                    <img src="${oneCurr.icon}" alt="${oneCurr.currencyCode}" width="20" height="14" class="me-2">${oneCurr.currencyName}
                </a>
            </li>
        `;
        fromCurrencyUL.innerHTML += sFrom;
        toCurrencyUL.innerHTML += sTo;
    }


    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // prevent navigation if using <a>

            //detect clicked id
            let clickedId = item.id;
            let sugId = clickedId.slice(0, 2);

            // Remove 'active' from all items
            document.querySelectorAll('.dropdown-item').forEach((i) => {
                if (i.id.slice(0, 2) == sugId) {
                    i.classList.remove('active');
                }
            });

            // Add 'active' to the clicked one
            this.classList.add('active');

            if (sugId == "to") {
                let selectedValueTo = clickedId.substring(2);
                document.getElementById("selectedValueTo").value = selectedValueTo;
                document.getElementById("selectedValueTo").dataset.namecurr = this.dataset.namecurr;
                document.getElementById("selectedValueTo").dataset.iconcurr = this.dataset.iconcurr;
            } else {
                let selectedValueFrom = clickedId.substring(4);
                document.getElementById("selectedValueFrom").value = selectedValueFrom;
                document.getElementById("selectedValueFrom").dataset.namecurr = this.dataset.namecurr;
                document.getElementById("selectedValueFrom").dataset.iconcurr = this.dataset.iconcurr;
            }

        });
    });
}

async function convertCurrency() {
    const valueTo = document.getElementById("selectedValueTo").value;
    const valueFrom = document.getElementById("selectedValueFrom").value;

    const nameTO = document.getElementById("selectedValueTo").dataset.namecurr;
    const nameFrom = document.getElementById("selectedValueFrom").dataset.namecurr;

    //iconcurr
    const iconTo = document.getElementById("selectedValueTo").dataset.iconcurr;
    const iconFrom = document.getElementById("selectedValueFrom").dataset.iconcurr;

    if (valueTo.trim() == "" || valueFrom.trim() == "") {
        alert("Make sure you select a currency from... and a currency to... for convertion.")
        return;
    }
    if (valueTo.trim() == valueFrom.trim()) {
        alert("Make sure you select a currency from... and a currency to... for convertion, and these must be different from one another!.")
        return;
    }

    //fetch data currencyfreaks.com
    let latestRatesObj;
    let locStorIsEnough = false
    if (localStorage.getItem("latestRates")) {
        latestRatesObj = JSON.parse(localStorage.getItem("latestRates"));
        //latestRatesObj.date //ex.: "2025-04-30 00:00:00+00"
        let storageDate = new Date(latestRatesObj.date);
        let nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);
        if (storageDate.getTime() === nowDate.getTime()) {
            locStorIsEnough = true;
        } else {
            locStorIsEnough = false;
        }
    } else {
        locStorIsEnough = false;
    }
    if (locStorIsEnough == false) {
        latestRatesObj = await getLatestRates();
        //assume it's up-to-date. 
    }
    if (latestRatesObj) {
        localStorage.setItem("latestRates", JSON.stringify(latestRatesObj));
    } else {
        announceRatesDataError();
        return;
    }

    //make the calculation and announe it
    let amount = document.getElementById("amount").value;
    amount = Number(amount);
    let rateFrom = latestRatesObj.rates[`${valueFrom}`];
    let rateTo = latestRatesObj.rates[`${valueTo}`];
    if (isNaN(rateFrom || isNaN(rateTo))) {
        announceRatesDataError();
        return;
    }
    rateFrom = Number(rateFrom);
    rateTo = Number(rateTo);
    //we have:
    //amount
    //valueFrom example: ILS
    //valueTo example: EUR
    //rateFrom example: 3.6173
    //rateTo example: 0.878
    //nameTO
    //nameFrom
    //iconFrom
    //iconTo
    //assuming base = USD
    //alert(`${valueFrom} ${nameFrom}: ${rateFrom} - ${valueTo} ${nameTO}: ${rateTo}`);
    let result;
    if (valueFrom != 'USD' && valueTo != 'USD') {
        result = Number(amount * (rateTo / rateFrom));
    } else {
        if (valueTo == 'USD') {
            result = Number(amount * (1 / rateFrom));
        } else {
            //valueFrom == 'USD'
            result = Number(amount * rateTo);
        }
    }
    announceConversionResult(amount, nameFrom, nameTO, result, iconFrom, iconTo);
}
function announceConversionResult(amount, nameFrom, nameTO, result, iconFrom, iconTo) {
    //show result nicely in div (id="result")
    //result will be showed with .toFixed(4)
    let resultDiv = document.getElementById("result");
    let s = `${amount} ${nameFrom} = <strong>${Number(result).toFixed(4)}</strong> ${nameTO}`;
    resultDiv.innerHTML = `<p id="convertedAmountLable">Converted Amount:</p>`;
    resultDiv.innerHTML += `<p id="convertedAmountString">
            <img src="${iconFrom}" class="me-2">    
            ${s}
            <img src="${iconTo}" class="me-2">
        </p>`;
    resultDiv.innerHTML += `
            <p id="poweredBy"><span>Data taken from <a href="https://currencyfreaks.com/" target="_blank">CurrencyFreaks</a></span></p>
        `;
    resultDiv.style.display = "block";
}
function announceRatesDataError() {
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p id="convertedAmountError">Latest Currency Data Error!</p>`;
    resultDiv.style.display = "block";
}
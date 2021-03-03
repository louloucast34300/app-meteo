    //const fetch = require("node-fetch");


    [heureHTML,ressentitHTML,humidityHTML,etatHTML,windHTML] = 
    [document.querySelector('.titre-heure'),document.querySelector('.titre-ressentit'),document.querySelector('.titre-humidity'),document.querySelector('.titre-etat'),document.querySelector('.titre-wind')];

    [nomHTML,tempHTML,descHTML,depHTML] = 
    [document.querySelector(".titre-nom"),document.querySelector('.titre-temp'),document.querySelector('.titre-desc'),document.querySelector('.titre-dep')];

    [buttonHTML,blocDescHTML,textHTML] = 
    [document.querySelector(".button"),document.querySelector('.description'),document.querySelector('.text')]
  

    //init
    window.onload= function(){
    buttonHTML.addEventListener('click',()=>{
        API();
    });
   };    

    const API = () =>{
        const city = document.getElementById("input").value;     
    //1ere API
    let url1 = `https://geo.api.gouv.fr/communes?nom=${city}&fields=departement&boost=population&limit=5'`;
    fetch(url1)
    .then(response => response.json())
    .then((data) => {
        let depValue = data[0].departement.code;
        const newData = [data[0].nom,data[0].departement.nom,depValue]
        let newMap = newData.map((map)=>map)

         //2eme API
        let url2 = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=API_KEY`;
        fetch(url2)
        .then(response => response.json())
        .then((data2) => {
            const symboleMeteo = [
                {
                    type:"few clouds",
                    src:"img/soleil-petit-nuage.png",
                    srcBg:"img/bg2.png",
                    srcBgNuit:"img/bg6.png"
                },
                {type:"mist",src:"img/brouillard.png",srcBg:"img/bg3.png",srcBgNuit:"img/bg8.png"},
                {type:"clear sky",src:"img/ciel-degage.png",srcBg:"img/bg1.png",srcBgNuit:"img/bg6.png"},
                {type:"thunderstorm",src:"img/orage.png",srcBg:"img/bg4.png",srcBgNuit:"img/bg7.png"},
                {type:"overcast clouds",src:"img/nuageux.png",srcBg:"img/bg3.png",srcBgNuit:"img/bg8.png"},
                {type:"scattered clouds",src:"img/soleil-petit-nuage.png",srcBg:"img/bg2.png",srcBgNuit:"img/bg8.png"},
                {type:"broken clouds",src:"img/nuageux.png",srcBg:"img/bg3.png",srcBgNuit:"img/bg7.png"},
                {type:"shower rain",src:"img/petite-pluie.png",srcBg:"img/bg9.png",srcBgNuit:"img/bg9.png"},
                {type:"rain",src:"img/forte-pluie.png",srcBg:"img/bg9.png",srcBgNuit:"img/bg9.png"},
                {type:"snow",src:"img/neige.png",srcBg:"img/bg5.png",srcBgNuit:"img/bg6.png"}
            ];
            //temps et description
            [tempValue,descValue] = [data2.main.temp,data2.weather[0].description];
            [tCelsus]=[Math.floor(tempValue - 273,15)+"°"];
            //ressentit
            [feelValue] = [data2.main.feels_like];
            [feelCelsus] = [Math.floor(feelValue- 273,15)+"°"];
            //humidité
            let humiValue = data2.main.humidity +"%"
            //vitesse du vent
            let windValue = Math.floor(data2.wind.speed * 3.6 )+ " km/h";
            //sunrise/sunset
            [sunriseValue,sunsetValue] = [data2.sys.sunrise,data2.sys.sunset]
            const actualUnixValue = Date.now();
          
            //l'heure 
            const actualHourValue = new Date();
            let resultHourValue = actualHourValue.getHours();
            let resultMinuteValue =actualHourValue.getMinutes();
            const resultTime = `${resultHourValue}:${resultMinuteValue}`
            //insertion HTML
            nomHTML.innerHTML= city;
            tempHTML.innerHTML= tCelsus;
            depHTML.innerHTML= depValue;
            heureHTML.innerHTML = resultTime;
            ressentitHTML.innerHTML = feelCelsus;
            humidityHTML.innerHTML = humiValue;
            windHTML.innerHTML=windValue;
            //bouclage des images / insertions
            for( const symbole of symboleMeteo){
                if(symbole.type === descValue){
                    blocDescHTML.innerHTML = `<h4 class="titre-desc">${descValue}</h4>\n
                    <img class="image-desc" src="${symbole.src}" alt="description du temps">`;
                    if (sunriseValue < actualUnixValue || sunsetValue > actualUnixValue){
                        document.getElementById('background').style.backgroundImage = `url(${symbole.srcBg})`;
                        etatHTML.innerHTML ="jour"
                        console.log("jour")
                    }else{
                        document.getElementById('background').style.backgroundImage = `url(${symbole.srcBgNuit})`;
                        etatHTML.innerHTML ="nuit"
                        console.log("nuit")
                    }
                    textHTML.innerHTML = `<p> Aujourd'hui : ${descValue} actuellement. La température en ce moment est de ${tCelsus} mais le ressenti est de ${feelCelsus}. Faite attention, la vitesse du vent peut atteindre jusqu'à ${windValue} </p>`
                } 
            }
            newMap.push(tCelsus,descValue,feelCelsus,humiValue,windValue);
            console.log(newMap)
        })
    })
    .catch(err => console.log("erreur", err))
}



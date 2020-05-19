var panier = [];
var panierLocalStorage;

var contact = {};
var orderId = new Map();

var total = 0;

async function slider(){ //Il s'agit simplement d'un carousel bootstrap, sans modifications particulières.
  var div = document.createElement("div");
  div.innerHTML = '<div id="carouselPresentation" class="carousel slide" data-ride="carousel"> <ol class="carousel-indicators"> <li data-target="#carouselPresentation" data-slide-to="0" class="active"></li><li data-target="#carouselPresentation" data-slide-to="1"></li><li data-target="#carouselPresentation" data-slide-to="2"></li></ol> <div class="carousel-inner"> <div class="carousel-item active"> <img src="img/slide1.jpg" class="d-block w-100" alt="slide 1"> <div class="carousel-caption d-none d-md-block"> <h5>Nouvel arrivage !</h5> <p>Des oursons en peluches à la qualité sans égal !</p></div></div><div class="carousel-item"> <img src="img/slide2.jpg" class="d-block w-100" alt="slide 2"> <div class="carousel-caption d-none d-md-block"> <h5>Promotions sur les caméras!</h5> <p>Voyez les choses en grand...</p></div></div><div class="carousel-item"> <img src="img/slide3.jpg" class="d-block w-100" alt="slide 3"> <div class="carousel-caption d-none d-md-block"> <h5>Profitez de votre interieur !</h5> <p>Equipez vous sans vous ruiner !</p></div></div></div><a class="carousel-control-prev" href="#carouselPresentation" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselPresentation" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span> </a> </div>';
  return div ;
}

async function creationArticle(api, idDivEtApi, titres) {
  // Cette fonction va nous permettre de créer les articles séléctionnables sur la page d'accueil sous forme de liste.
  var section = document.createElement("section");
  var titreCategorie = document.createElement("h2");

  section.className += "sectionArticle " + idDivEtApi;
  titreCategorie.className += "titreCategorie";

  titreCategorie.textContent = titres;

  section.appendChild(titreCategorie);

  for (var i = 0; i < api.length; i++) {
    // On parcourt l'api renseignée en paramètre

    var article = document.createElement("article");
    var titreProduit = document.createElement("h3");
    var imgProduit = document.createElement("img");
    var prix = document.createElement("p");
    var bouton = document.createElement("button");

    article.className += "caseArticle";
    titreProduit.className += "titreProduit";
    imgProduit.className += "imgProduitAccueil";
    prix.className += "prixProduit";
    bouton.className += "boutonEnSavoirPlus";

    titreProduit.textContent = api[i].name;
    prix.textContent = api[i].price / 100 + "€";
    bouton.textContent = "En savoir plus";

    imgProduit.setAttribute("src", api[i].imageUrl);
    bouton.setAttribute( //Chaque bouton "En savoir plus" appelera la fonction details().
      "onclick",
      "details('" + api[i]._id + "', '" + idDivEtApi + "')"
    );

    article.appendChild(titreProduit);
    article.appendChild(imgProduit);
    article.appendChild(prix);
    article.appendChild(bouton);

    section.appendChild(article);
  }

  return section;
}

async function creationDetails(api, _id, idDivEtApi) {
  // Cette fonction va nous permettre de créer une vue affichant les détails de l'article sur lequel on vient de cliquer.

  var section = document.createElement("section");
  var titreProduit = document.createElement("h2");
  var imgProduit = document.createElement("img");
  var descr = document.createElement("p");
  var prix = document.createElement("p");
  var select = document.createElement("select");
  var bouton = document.createElement("button");

  section.className += "sectionDetail";
  titreProduit.className += "titreProduitDetail";
  imgProduit.className += "imgProduitDetail";
  descr.className += "descrDetail";
  prix.className += "prixDetail";
  select.className += "selectDetail";
  bouton.className += "panier";

  titreProduit.textContent = api.name;
  descr.textContent = api.description;
  prix.textContent = api.price / 100 + "€";
  bouton.textContent = "Ajouter au panier";

  imgProduit.setAttribute("src", api.imageUrl);
  bouton.setAttribute( //Chaque bouton "Ajouter au panier" appelera la fonction ajouterAuPanier().
    "onclick",
    "ajouterAuPanier('" + api._id + "', '" + idDivEtApi + "')"
  );

  // Création de la liste déroulante, en fonction de l'api à laquelle appartient l'article :

  if (idDivEtApi == "teddies") {
    // Si l'api correspond à "http://localhost:3000/api/teddies" :
    for (var i = 0; i < api.colors.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", api.colors[i]);
      option.textContent = api.colors[i];
      select.appendChild(option);
    }
  } else if (idDivEtApi == "cameras") {
    // Si l'api correspond à "http://localhost:3000/api/cameras" :
    for (var i = 0; i < api.lenses.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", api.lenses[i]);
      option.textContent = api.lenses[i];
      select.appendChild(option);
    }
  } else if (idDivEtApi == "furniture") {
    // Si l'api correspond à "http://localhost:3000/api/furniture" :
    for (var i = 0; i < api.varnish.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", api.varnish[i]);
      option.textContent = api.varnish[i];
      select.appendChild(option);
    }
  }

  section.appendChild(titreProduit);
  section.appendChild(imgProduit);
  section.appendChild(descr);
  section.appendChild(select);
  section.appendChild(prix);
  section.appendChild(bouton);

  return section;
}

async function creationPanier() { // Cette fonction va créer une vue affichant le panier.

  var section = document.createElement("section");
  var titreSection = document.createElement("h2");
  var prixTotal = document.createElement("p");

  total = 0; // Cette variable contiendra le prix total du panier.

  section.className += "sectionPanier";
  titreSection.className += "titreSectionPanier";
  prixTotal.className += "prixTotal";

  titreSection.textContent = "Mon panier";

  section.appendChild(titreSection);

  value = panier;

  // On vérifie que le panier contient quelque chose :

  if(value.length == 0){ //Si le panier est vide, on prévient l'utilisateur.

    var p = document.createElement("p");
    var article = document.createElement("article");

    article.className += "articlePanierVide";
    p.className += "pPanierVide";

    p.textContent = "Rien à afficher, votre panier est vide !";

    article.appendChild(p);
    section.appendChild(article);

  }else{ //Si il contient quelque chose :

    for (var i = 0; i < value.length; i++) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          var response = JSON.parse(this.responseText);
  
          var articlePanier = document.createElement("article");
          var titreProduit = document.createElement("h3");
          var prixProduit = document.createElement("p");
  
          articlePanier.className += "articlePanier";
          titreProduit.className += "titreProduitPanier";
          prixProduit.className += "prixProduitPanier";
  
          titreProduit.textContent = response.name;
          prixProduit.textContent = response.price / 100 + "€";
  
          total += response.price; // On incrémente la variable total en ajoutant le prix de l'article value[i].response.
          prixTotal.textContent = "Prix Total : " + total / 100 + "€";
  
          articlePanier.appendChild(titreProduit);
          articlePanier.appendChild(prixProduit);
          section.appendChild(articlePanier);
        }
      };
      request.open("GET", value[i]);
      request.send();
    }

    // Création des boutons qui vont appeler le formulaire ou vider le panier (Etant contenu dans le else, ces directives ne s'appliquent que si le panier n'est pas vide) :

    var aside = document.createElement("aside");
    aside.className += "asideAppelFormulaire";

    var p = document.createElement("p");
    p.className += "pAsideForm";

    var button = document.createElement("button");
    button.className += "buttonAppelFormulaire";

    var button2 = document.createElement("button");
    button2.className += "buttonSupressionPanier";

    p.textContent = "Finalisez ma commande :";
    button.textContent = "Valider votre panier";
    button.setAttribute(
      "data-toggle",
      "modal"
    );

    button.setAttribute(
      "data-target",
      ".validationFormModal"
    );

    button2.textContent = "Vider le panier";
    button2.setAttribute(
      "onclick",
      "viderPanier()"
    );

    // Creation du formulaire dans une modale (Utlisation de classes Bootstrap, pas de vérification en HTML) (Idem qu'au dessus, le formulaire est contenu dans le else. Le HTML si dessous ne sera donc créée que si la panier est rempli.):

    var form = document.createElement("div");
    form.innerHTML = `<div class="modal fade validationFormModal" tabindex="-1" role="dialog" aria-labelledby="formModal" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="headerModal">Validation de la commande</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <form name="validationCommande" action=""> <div class="form-group"> <input type="text" name="nom" class="form-control" id="nom" required placeholder="Entrez votre nom"> <div class="invalid-feedback"> Le champ "nom" est vide ou invalide ! </div></div><div class="form-group"> <input type="text" name="prénom" class="form-control" id="prenom" required placeholder="Entrez votre prénom"> <div class="invalid-feedback"> Le champ "prénom" est vide ou invalide ! </div></div><div class="form-group"> <input type="text" name="adresse" class="form-control" id="adresse" required placeholder="Entrez votre adresse"> <div class="invalid-feedback"> Le champ "adresse" est vide ou invalide ! </div></div><div class="form-group"> <input type="text" name="ville" class="form-control" id="ville" required placeholder="Renseignez votre ville"> <div class="invalid-feedback"> Le champ "ville" est vide ou invalide ! </div></div><div class="form-group"> <input type="email" name="email" class="form-control" id="mail" required placeholder="Entrez votre email"> <div class="invalid-feedback"> Le champ "email" est vide ou invalide ! </div></div><p>Tout les champs sont obligatoire.<br> Ce formulaire ne prend pas en charge les accents.</p></form> </div><div class="modal-footer"> <button onclick="validateForm()" class="validationBouton"> Valider</button> </div></div></div></div>`;


    aside.appendChild(p);
    aside.appendChild(button);
    aside.appendChild(button2);
    section.appendChild(aside);
    section.appendChild(form);
  }
  section.appendChild(prixTotal);
  return section;
}

async function triArticle() {

  // orderId est remise à 0 pour ne pas redonné les orderId des pécédentes commandes.

  orderId = new Map();

  // Creation du (des) tableaux qui serviront à la création de product_id :

  var teddies = [];
  var cameras = [];
  var furniture = [];

  for (var i = 0; i < panier.length; i++) { // Pour chaque URL contenue dans le panier :
    result = panier[i].split("/"); // On la découpe pour obtenir un tableau de chaînes de caractères.

    // On vérifie si la catégorie de l'article et on stocke son id au tableau correspondant (result[4] correspond au nom de l'API alors que result[5] correspond à un id) :

    if (result[4] == "teddies"){
      teddies.push(result[5]);
    }
    if (result[4] == "cameras"){
      cameras.push(result[5]);
    }
    if (result[4] == "furniture"){
      furniture.push(result[5]);
    }
  }

  if(teddies.length>0){
    envoiForm(teddies, "teddies");
  }

  if(cameras.length>0){
    envoiForm(cameras, "cameras");
  }

  if(furniture.length>0){
    envoiForm(furniture, "furniture");
  }

  /*console.log(orderId);*/
}

async function envoiForm(api, stringNomApi){

  // On récupère les champs du formulaire :

  var nom = document.forms["validationCommande"]["nom"].value;
  var prenom = document.forms["validationCommande"]["prenom"].value;
  var adresse = document.forms["validationCommande"]["adresse"].value;
  var ville = document.forms["validationCommande"]["ville"].value;
  var email = document.forms["validationCommande"]["email"].value;

  // Création de la variable qui englobera l'objet contact et le tableau products :

  var send = {
    contact :
   {
     firstName: nom,
     lastName: prenom,
     address: adresse,
     city: ville,
     email: email
   },
    products :[api]
   }

   console.log(send);

  // Envoi des requêtes POST :


  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/api/" + stringNomApi + "/order");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(send));

  // On récupère la réponse du serveur :

  request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
      var response = JSON.parse(this.responseText);
      orderId.set(stringNomApi, response.orderId);

      creationPageConfirmation()
      .then(function (data) {

        if(document.querySelector("body").className == "modal-open"){ // Sans ces lignes...
          document.querySelector("body").removeAttribute("class"); // ...la modale contenant...
          document.querySelector("body").removeAttribute("style"); // ...le formulaire...
          document.querySelector(".modal-backdrop").remove();      // ...ne se fermerait pas correctement.
        }
    
        document.getElementById("app").innerHTML = "";
    
        document.getElementById("app").appendChild(data);
      })
      .catch(function (err) {
        console.log(err);
      });

      document.getElementById("compteur").textContent = "";
      
    }
  }
}

async function creationPageConfirmation(){
  var section = document.createElement("section");
  var titre = document.createElement("h2");
  var p = document.createElement("p");
  var p2 = document.createElement("p");
  var prixTotal = document.createElement("p");
  var article = document.createElement("article");

  section.className += "sectionConfirmation";
  titre.className += "titreConfirmation";
  p.className += "pConfirmation";
  p2.className += "pConfirmation";
  prixTotal.className += "prixTotalConfirmation";
  article.className += "articleConfirmation";

  titre.textContent = "Commande confirmee !";
  p.textContent = "Merci de nous avoir fait confiance !";
  p2.textContent = "Voici vos identifiants de commande :";
  prixTotal.innerHTML = `Prix Total : <span>`+ total/100 +`€ </span>`

  section.appendChild(titre);
  section.appendChild(p);
  section.appendChild(p2);

  orderId.forEach(function(cle, valeur) {

    var pId = document.createElement("p");
    pId.className += "pConfirmationId";
    pId.textContent = "ID de commande sur Ori" + valeur + " : " + cle;

    article.appendChild(pId);
  });

  section.appendChild(article);
  section.appendChild(prixTotal);

  //Une fois la commande passée, on vide le panier.
  localStorage.clear();
  panier = [];  

  return section;
}

async function get(urlApi, idDivEtApi, titres) {
  // On va ici créer une requette GET pour l'API renseignée dans urlApi. Les autres variables seront passées à creationArticle().

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      var response = JSON.parse(this.responseText);

      creationArticle(response, idDivEtApi, titres)
        .then(function (data) {
          document.getElementById("app").appendChild(data);
        })
        .catch(function (err) {
          console.log(err);
        });

    }
  };
  request.open("GET", urlApi);
  request.send();
}

function accueil() {
  document.getElementById("app").innerHTML = "";
  slider()
  .then(function (data) {
    document.getElementById("app").appendChild(data);
  })
  .catch(function (err) {
    console.log(err);
  });
  get("http://localhost:3000/api/teddies", "teddies", "OriTeddies");
  get("http://localhost:3000/api/cameras", "cameras", "OriCameras");
  get("http://localhost:3000/api/furniture", "furniture", "OriFurnitures");
}

function asideCookies(){
  var aside = document.createElement("aside");
  var p = document.createElement("p");
  var svg = document.createElement("div");
  var bouton = document.createElement("button");

  aside.className += "asideCookies";
  p.className += "pCookies";
  svg.className += "svgCookies";
  bouton.className += "boutonCookies";

  svg.innerHTML =`<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 416.991 416.991" style="enable-background:new 0 0 416.991 416.991;" xml:space="preserve"><g><g><path style="fill:#D4B783;" d="M344.649,204.32c-7.807,3.62-16.314,5.501-25.067,5.503c-10.392,0.001-20.665-2.759-29.711-7.982c-16.886-9.749-27.772-27.175-29.52-46.218c-19.143-1.749-36.518-12.726-46.216-29.523c-9.747-16.882-10.465-37.41-2.462-54.773c-12.251-8.607-20.792-21.491-23.926-36.143c-41.698,1.338-79.982,16.399-110.502,40.79c7.997,7.752,12.731,18.522,12.731,30.139c0,14.868-7.772,27.946-19.461,35.412c-6.518,4.163-14.248,6.588-22.539,6.588c-5.841,0-11.538-1.211-16.78-3.498c-0.026,0.027-0.052,0.053-0.078,0.08c-1.962,5.439-3.673,10.997-5.136,16.655C22.086,176.423,20,192.219,20,208.496c0,103.937,84.559,188.496,188.495,188.496c41.112,0,79.18-13.243,110.192-35.67c0.654-0.587,1.493-1.204,2.467-1.842c11.615-8.688,22.217-18.658,31.549-29.74c-10.812-7.738-17.66-20.402-17.66-34.193c0-9.15,2.95-17.619,7.937-24.526c7.339-10.164,19.105-16.916,32.449-17.425c0.523-0.029,1.057-0.049,1.615-0.049c0.404,0,0.807,0.014,1.21,0.026c1.405-8.275,2.272-16.73,2.548-25.333C366.147,225.109,353.26,216.57,344.649,204.32z M132.435,334.871c-13.093,0-24.803-6.025-32.512-15.445c-6.215-7.325-9.976-16.795-9.976-27.131c0-23.159,18.841-42,42-42c13.093,0,24.804,6.025,32.512,15.445c6.215,7.325,9.976,16.795,9.976,27.131C174.435,316.03,155.595,334.871,132.435,334.871z M160.194,183.688c-13.093,0-24.803-6.025-32.512-15.445c-6.215-7.325-9.976-16.795-9.976-27.131c0-23.159,18.841-42,42-42c13.093,0,24.803,6.025,32.512,15.445c6.215,7.325,9.976,16.795,9.976,27.131C202.194,164.846,183.354,183.688,160.194,183.688z M246.963,314.835c-16.814,0-31.855-7.727-41.767-19.815c-7.929-9.401-12.721-21.53-12.721-34.762c0-29.776,24.225-54,54-54c16.814,0,31.855,7.727,41.767,19.815c7.929,9.401,12.721,21.53,12.721,34.762C300.963,290.611,276.738,314.835,246.963,314.835z"/><path style="fill:#89634A;" d="M159.706,163.111c12.131,0,22-9.869,22-22c0-12.131-9.869-22-22-22c-12.131,0-22,9.869-22,22C137.706,153.242,147.576,163.111,159.706,163.111z"/><path style="fill:#89634A;" d="M131.948,314.295c12.131,0,22-9.869,22-22c0-12.131-9.869-22-22-22c-12.131,0-22,9.869-22,22C109.948,304.426,119.817,314.295,131.948,314.295z"/><path style="fill:#89634A;" d="M69.977,106.111c0-6.503-2.838-12.494-7.563-16.596c-9.154,11.218-17.041,23.505-23.448,36.643c2.809,1.265,5.866,1.954,9.011,1.954C60.108,128.111,69.977,118.242,69.977,106.111z"/><path style="fill:#89634A;" d="M355.043,295.546c0,7.423,3.79,14.218,9.724,18.234c8.124-12.02,14.894-25.024,20.101-38.79c-2.469-0.943-5.101-1.444-7.825-1.444C364.913,273.546,355.043,283.415,355.043,295.546z"/><path style="fill:#89634A;" d="M246.475,294.259c18.748,0,34-15.253,34-34c0-18.748-15.252-34-34-34c-18.748,0-34,15.252-34,34C212.475,279.006,227.727,294.259,246.475,294.259z"/></g><g><path style="fill:#89634A;" d="M192.218,114.556c5.926,7.242,9.488,16.489,9.488,26.555c0,23.159-18.841,42-42,42c-12.822,0-24.314-5.782-32.024-14.869c7.708,9.42,19.419,15.445,32.512,15.445c23.159,0,42-18.841,42-42C202.194,131.351,198.434,121.881,192.218,114.556z"/><path style="fill:#89634A;" d="M173.948,292.295c0,23.159-18.841,42-42,42c-12.822,0-24.314-5.782-32.024-14.869c7.709,9.42,19.419,15.445,32.512,15.445c23.159,0,42-18.841,42-42c0-10.337-3.761-19.806-9.976-27.131C170.385,272.982,173.948,282.229,173.948,292.295z"/><path style="fill:#89634A;" d="M300.475,260.259c0,29.776-24.225,54-54,54c-16.543,0-31.365-7.485-41.279-19.238c9.911,12.087,24.952,19.815,41.767,19.815c29.775,0,54-24.224,54-54c0-13.232-4.792-25.361-12.721-34.762C295.882,235.391,300.475,247.297,300.475,260.259z"/><path d="M159.706,183.111c23.159,0,42-18.841,42-42c0-10.066-3.562-19.313-9.488-26.555c-7.708-9.42-19.418-15.445-32.512-15.445c-23.159,0-42,18.841-42,42c0,10.337,3.761,19.806,9.976,27.131C135.393,177.329,146.884,183.111,159.706,183.111z M159.706,119.111c12.131,0,22,9.869,22,22c0,12.131-9.869,22-22,22c-12.131,0-22-9.869-22-22C137.706,128.98,147.576,119.111,159.706,119.111z"/><path d="M131.948,334.295c23.159,0,42-18.841,42-42c0-10.066-3.562-19.313-9.488-26.555c-7.708-9.42-19.419-15.445-32.512-15.445c-23.159,0-42,18.841-42,42c0,10.337,3.761,19.806,9.976,27.131C107.634,328.513,119.125,334.295,131.948,334.295z M131.948,270.295c12.131,0,22,9.869,22,22c0,12.131-9.869,22-22,22c-12.131,0-22-9.869-22-22C109.948,280.164,119.817,270.295,131.948,270.295z"/><path d="M416.97,206.596l-0.013-0.831c-0.064-5.279-4.222-9.598-9.494-9.864c-14.875-0.751-28.007-9.639-34.27-23.193c-1.245-2.694-3.623-4.696-6.489-5.465c-2.867-0.769-5.927-0.224-8.353,1.487c-6.706,4.73-14.927,7.335-23.146,7.336c-6.964,0-13.857-1.854-19.935-5.363c-13.458-7.77-21.242-22.803-19.83-38.299c0.269-2.956-0.789-5.879-2.888-7.977c-2.1-2.1-5.033-3.154-7.977-2.889c-1.195,0.109-2.411,0.164-3.614,0.164c-14.272,0-27.562-7.662-34.683-19.996c-7.77-13.458-6.994-30.369,1.976-43.084c1.711-2.425,2.257-5.485,1.488-8.352c-0.768-2.867-2.77-5.245-5.464-6.49c-13.548-6.262-22.434-19.387-23.189-34.254c-0.268-5.269-4.583-9.424-9.858-9.492l-0.816-0.013C209.777,0.01,209.137,0,208.496,0C93.531,0,0.001,93.531,0.001,208.496s93.53,208.496,208.495,208.496s208.495-93.531,208.495-208.496C416.991,207.861,416.981,207.229,416.97,206.596z M62.414,89.515c4.725,4.102,7.563,10.093,7.563,16.596c0,12.131-9.869,22-22,22c-3.145,0-6.202-0.689-9.011-1.954C45.373,113.02,53.26,100.733,62.414,89.515z M364.768,313.781c-5.935-4.016-9.724-10.811-9.724-18.234c0-12.131,9.869-22,22-22c2.725,0,5.356,0.501,7.825,1.444C379.662,288.757,372.892,301.761,364.768,313.781z M390.948,255.926c-4.067-1.428-8.354-2.227-12.695-2.354c-0.403-0.012-0.806-0.026-1.21-0.026c-0.542,0-1.077,0.029-1.615,0.049c-13.344,0.509-25.11,7.26-32.449,17.425c-4.987,6.906-7.937,15.376-7.937,24.526c0,13.791,6.848,26.454,17.66,34.193c-9.332,11.082-19.935,21.052-31.549,29.74c-0.822,0.615-1.635,1.24-2.467,1.842c-31.012,22.428-69.08,35.67-110.192,35.67C104.559,396.991,20,312.433,20,208.496c0-16.276,2.085-32.073,5.983-47.148c1.463-5.657,3.174-11.215,5.136-16.655c0.012-0.032,0.022-0.065,0.034-0.098c0.014,0.006,0.029,0.011,0.044,0.018c5.242,2.287,10.938,3.498,16.78,3.498c8.291,0,16.021-2.425,22.539-6.588c11.688-7.466,19.461-20.544,19.461-35.412c0-11.617-4.733-22.387-12.731-30.139c-0.451-0.437-0.906-0.869-1.377-1.286c32.732-32.446,77.26-53.009,126.502-54.589c3.157,14.763,11.764,27.746,24.107,36.418c-8.064,17.495-7.341,38.179,2.48,55.19c9.771,16.925,27.278,27.985,46.567,29.748c1.761,19.188,12.729,36.747,29.744,46.57c9.114,5.262,19.466,8.043,29.936,8.042c8.82-0.001,17.392-1.897,25.258-5.544c8.676,12.343,21.661,20.947,36.427,24.102C396.436,228.84,394.398,242.665,390.948,255.926z"/><path d="M246.475,314.259c29.775,0,54-24.224,54-54c0-12.961-4.593-24.868-12.233-34.185c-9.911-12.087-24.952-19.815-41.767-19.815c-29.775,0-54,24.224-54,54c0,13.232,4.792,25.361,12.721,34.762C215.11,306.774,229.932,314.259,246.475,314.259z M246.475,226.259c18.748,0,34,15.252,34,34c0,18.747-15.252,34-34,34c-18.748,0-34-15.253-34-34C212.475,241.511,227.727,226.259,246.475,226.259z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`;
  p.textContent = "Nous utilisons les cookies afin de fournir les services et fonctionnalités proposées sur notre site et d'améliorer l'expérience de nos utilisateurs.";
  bouton.textContent = "J'ai compris !";
  bouton.setAttribute(
    "onclick",
    "fermerAsideCookies()"
  );

  aside.appendChild(svg);
  aside.appendChild(p);
  aside.appendChild(bouton);

  document.querySelector("body").appendChild(aside);
}

function fermerAsideCookies(){
  document.querySelector(".asideCookies").remove();
}

function details(_id, idDivEtApi) {
  document.getElementById("app").innerHTML = "";
  var api = "http://localhost:3000/api/" + idDivEtApi + "/" + _id;
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      var response = JSON.parse(this.responseText);
      creationDetails(response, _id, idDivEtApi)
        .then(function (data) {
          document.getElementById("app").appendChild(data);
        })

        .catch(function (err) {
          console.log(err);
        });
    }
  };
  request.open("GET", api);
  request.send();
}

function ajouterAuPanier(_id, idDivEtApi) {
  panier.push("http://localhost:3000/api/" + idDivEtApi + "/" + _id);
  panierLocalStorage = JSON.stringify(panier);
  localStorage.setItem("panier", panierLocalStorage);

  document.getElementById("compteur").textContent = panier.length;

  alert("Article ajouté au panier !");
}

function viderPanier(){
  localStorage.clear();
  panier = [];
  alert("Votre panier est à présent vide !");
  document.getElementById("compteur").textContent = "";
  monPanier();
  //window.location.reload();
}

function monPanier() {
  document.getElementById("app").innerHTML = "";
  creationPanier()
    .then(function (data) {
      document.getElementById("app").appendChild(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function mentionsLegales() {
  document.getElementById("app").innerHTML = "";
  var section = document.createElement("section");
  section.className += "sectionMentionsLegales";
  section.innerHTML = `<h2>Mentions légales</h2></br>Merci de lire avec attention les différentes modalités d’utilisation du présent site avant d’y parcourir ses pages. En vous connectant sur ce site, vous acceptez sans réserves les présentes modalités. Aussi, conformément à l’article n°6 de la Loi n°2004-575 du 21 Juin 2004 pour la confiance dans l’économie numérique, les responsables du présent site internet <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a> sont :</br></br><p><b>Editeur du Site : </b></p> Napoléon le cochon <br>Numéro de SIRET : 000 000 000 00001 <br><br> <b>Responsable editorial :</b> <br>Piotr la Girafe <br>14 rue des moineaux, Zootopia <br>Téléphone : 06 01 02 03 04 <br> Fax : 02 31 01 02 03 <br>Email : lorem@ipsum.com <br>Site Web : <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a></br></br><p><b>Hébergement :</b></p>Hébergeur : Github, San Francisco <br> Site Web : <a href="http://https://github.com">https://github.com</a></br></br><p><b>Développement : </b></p>Spider-Man <br> Adresse : New-York City <br>Site Web : <a href="http://www.lorem-ipsum.com">www.lorem-ipsum.com</a></br></br><p><b>Conditions d’utilisation : </b></p><p>Le site accessible par les url suivants : http://https://iki1337.github.io/orinoco/ est exploité dans le respect de la législation française. L'utilisation de ce site est régie par les présentes conditions générales. En utilisant le site, vous reconnaissez avoir pris connaissance de ces conditions et les avoir acceptées. Celles-ci pourront êtres modifiées à tout moment et sans préavis par la société Natural net. Natural net ne saurait être tenu pour responsable en aucune manière d’une mauvaise utilisation du service. </p></br><p><b>Services fournis : </b></p><p>L'ensemble des activités de la société ainsi que ses informations sont présentés sur notre site <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a>.</p><p>Napoléon le cochon s’efforce de fournir sur le site https://iki1337.github.io/orinoco/ des informations aussi précises que possible. les renseignements figurant sur le site <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a> ne sont pas exhaustifs et les photos non contractuelles. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne. Par ailleurs, tous les informations indiquées sur le site https://iki1337.github.io/orinoco/<span style="color: #000000;"><b> </b></span>sont données à titre indicatif, et sont susceptibles de changer ou d’évoluer sans préavis. </p></br></br><p><b>Limitation contractuelles sur les données : </b></p>Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l’année, mais peut toutefois contenir des inexactitudes ou des omissions. Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email, à l’adresse lorem@ipsum.com, en décrivant le problème de la manière la plus précise possible (page posant problème, type d’ordinateur et de navigateur utilisé, …).Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En conséquence, ne saurait être tenu responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur ou d'une quelconque perte de données consécutives au téléchargement. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jourLes liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de Napoléon le cochon.</br></br><p><b>Propriété intellectuelle :</b></p>Tout le contenu du présent sur le site <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a>, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de la société à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Napoléon le cochon. Cette représentation ou reproduction, par quelque procédé que ce soit, constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle. Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la responsabilité civile et pénale du contrefacteur. En outre, les propriétaires des Contenus copiés pourraient intenter une action en justice à votre encontre.</br></br><p><b>Déclaration à la CNIL : </b></p>Conformément à la loi 78-17 du 6 janvier 1978 (modifiée par la loi 2004-801 du 6 août 2004 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel) relative à l'informatique, aux fichiers et aux libertés, ce site n'a pas fait l'objet d'une déclaration auprès de la Commission nationale de l'informatique et des libertés (<a href="http://www.cnil.fr/">www.cnil.fr</a>).</br></br><p><b>Litiges : </b></p>Les présentes conditions du site <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a> sont régies par les lois françaises et toute contestation ou litiges qui pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des tribunaux dont dépend le siège social de la société. La langue de référence, pour le règlement de contentieux éventuels, est le français.</br></br><p><b>Données personnelles :</b></p>De manière générale, vous n’êtes pas tenu de nous communiquer vos données personnelles lorsque vous visitez notre site Internet <a href="http://https://iki1337.github.io/orinoco/">https://iki1337.github.io/orinoco/</a>.Cependant, ce principe comporte certaines exceptions. En effet, pour certains services proposés par notre site, vous pouvez être amenés à nous communiquer certaines données telles que : votre nom, votre fonction, le nom de votre société, votre adresse électronique, et votre numéro de téléphone. Tel est le cas lorsque vous remplissez le formulaire qui vous est proposé en ligne, dans la rubrique « contact ». Dans tous les cas, vous pouvez refuser de fournir vos données personnelles. Dans ce cas, vous ne pourrez pas utiliser les services du site, notamment celui de solliciter des renseignements sur notre société, ou de recevoir les lettres d’information.Enfin, nous pouvons collecter de manière automatique certaines informations vous concernant lors d’une simple navigation sur notre site Internet, notamment : des informations concernant l’utilisation de notre site, comme les zones que vous visitez et les services auxquels vous accédez, votre adresse IP, le type de votre navigateur, vos temps d'accès. De telles informations sont utilisées exclusivement à des fins de statistiques internes, de manière à améliorer la qualité des services qui vous sont proposés. Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.`;
  document.getElementById("app").appendChild(section);
}

function validateForm(){ // Cette fonction va vérifier les champs du formulaire. Si à l'issue des conditions suivantes, les champs sont tous valides, alors on appelle la fonction envoiFormulaire(). Autrement, l'utilisateur sera mit au courant de l'invalidité de ses données.
  var nom = document.forms["validationCommande"]["nom"];
  var prenom = document.forms["validationCommande"]["prenom"];
  var adresse = document.forms["validationCommande"]["adresse"];
  var ville = document.forms["validationCommande"]["ville"];
  var email = document.forms["validationCommande"]["email"];

  // Ces valeurs passeront à true si le champ correspondant est valide.

  var nomValide = false;
  var prenomValide = false;
  var adresseValide = false;
  var villeValide = false;
  var emailValide = false;

  // On verifie que les champs du formulaire soient conformes au format demandé et qu'ils ne soient pas vides.
  // On utilisera ici des Regex pour la vérification de chaque champs.
  
  if (/^([a-zA-Z]){2,15}$/.test(nom.value)) {
    nomValide = true;
    nom.className = "form-control is-valid";
  }else{
    nomValide = false;
    nom.className = "form-control is-invalid";
  }

  if (/^([a-zA-Z]){2,15}$/.test(prenom.value)) {
    prenomValide = true;
    prenom.className = "form-control is-valid";
  }else{
    prenomValide = false;
    prenom.className = "form-control is-invalid";
  }
  
  if (/^([a-zA-Z1-9 ]){2,30}$/.test(adresse.value)) {
    adresseValide = true;
    adresse.className = "form-control is-valid";
  }else{
    adresseValide = false;
    adresse.className = "form-control is-invalid";
  }
  
  if (/^([a-zA-Z]){2,15}$/.test(ville.value)) {
    villeValide = true;
    ville.className = "form-control is-valid";
  }else{
    villeValide = false;
    ville.className = "form-control is-invalid";
  }

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
    emailValide = true;
    email.className = "form-control is-valid";
  }else{
    emailValide = false;
    email.className = "form-control is-invalid";
  }

  if(nomValide && prenomValide && adresseValide && villeValide && emailValide){ // Si tout les champs sont validés, alors on appelle la fonction envoiFormulaire();
    triArticle();
  }
  
}

accueil();
var value = JSON.parse(localStorage.getItem("panier")); // On synchronise le contenu du panier de la session avec celui du panier en mémoire dans le localStorage dès le lancement de l'application. Cela évite que le contenu de la page panier ne s'efface dès qu'on ajoute un nouvel article lors de la prochaine session.
if (value != null) {
  panier = value;
}
if(panier.length != 0){
  document.getElementById("compteur").textContent = panier.length;
}
setTimeout(function(){asideCookies();}, 5000);
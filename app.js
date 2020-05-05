var panier = [];
var panierLocalStorage;

var total = 0;

async function creationArticle(api, idDivEtApi, titres) {
  // Cette fonction va nous permettre de créer les articles séléctionnables sur la page d'accueil sous forme de liste.
  var section = document.createElement("section");
  var titreCategorie = document.createElement("h2");

  section.className += idDivEtApi;
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
    prix.textContent = api[i].price;
    bouton.textContent = "En savoir plus";

    imgProduit.setAttribute("src", api[i].imageUrl);
    bouton.setAttribute(
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
  prix.textContent = api.price;
  bouton.textContent = "Ajouter au panier";

  imgProduit.setAttribute("src", api.imageUrl);
  bouton.setAttribute(
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

async function creationPanier() {
  // Cette fonction va créer une vue affichant le panier.

  var section = document.createElement("section");
  var titreSection = document.createElement("h2");
  var prixTotal = document.createElement("p");

  total = 0; // Cette variable contiendra le prix total du panier.

  section.className += "sectionPanier";
  titreSection.className += "titreSectionPanier";
  prixTotal.className += "prixTotal";

  titreSection.textContent = "Mon panier";

  section.appendChild(titreSection);

  if (value == null) {
    // Si on ne synchronise pas la variable value en lui attribuant la valeur de panier dès maintenant, elle ne se synchronisera que lors de la prochaine session et cette fonction provoquera un avertissement dans la console.
    value = panier;
  }

  for (var i = 0; i < value.length; i++) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);

        var titreProduit = document.createElement("p");
        var prixProduit = document.createElement("p");

        titreProduit.className += "titreProduitPanier";
        prixProduit.className += "prixProduitPanier";

        titreProduit.textContent = response.name;
        prixProduit.textContent = response.price;

        total += response.price; // On incrémente la variable total en ajoutant le prix de l'article value[i].response.
        prixTotal.textContent = "Prix Total : " + total;

        section.appendChild(titreProduit);
        section.appendChild(prixProduit);
      }
    };
    request.open("GET", value[i]);
    request.send();
  }
  section.appendChild(prixTotal);
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
  get("http://localhost:3000/api/teddies", "teddies", "Oursons en peluche");
  get("http://localhost:3000/api/cameras", "cameras", "Cameras");
  get("http://localhost:3000/api/furniture", "furniture", "Fournitures");
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

accueil();
var value = JSON.parse(localStorage.getItem("panier")); // On synchronise le contenu du panier de la session avec celui du panier en mémoire dans le localStorage dès le lancement de l'application. Cela évite que le contenu de la page panier ne s'efface dès qu'on ajoute un nouvel article lors de la prochaine session.
if (value != null) {
  panier = value;
}
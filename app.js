var panier = [];
var panierLocalStorage;

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
  prix.textContent = api.price / 100 + "€";
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

  if (value == null) {
    // Si on ne synchronise pas la variable value en lui attribuant la valeur de panier dès maintenant, elle ne se synchronisera que lors de la prochaine session et cette fonction provoquera un avertissement dans la console.
    value = panier;
  }

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

    // Création des boutons qui vont appeler le formulaire ou vider le panier :

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

    // Creation du formulaire dans une modal (Utlisisation de classes Bootstrap, pas de vérification en HTML) :

    var form = document.createElement("div");
    form.innerHTML = `<div class="modal fade validationFormModal" tabindex="-1" role="dialog" aria-labelledby="formModal" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="headerModal">Validation de la commande</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <form name="validationCommande" action=""> <div class="form-group"> <input type="text" name="nom" class="form-control" id="nom" required placeholder="Entrez votre nom"> <div class="invalid-feedback"> Le champ "nom" ne peut pas être vide ! </div></div><div class="form-group"> <input type="text" name="prénom" class="form-control" id="prenom" required placeholder="Entrez votre prénom"> <div class="invalid-feedback"> Le champ "prénom" ne peut pas être vide ! </div></div><div class="form-group"> <input type="text" name="adresse" class="form-control" id="adresse" required placeholder="Entrez votre adresse"> <div class="invalid-feedback"> Le champ "adresse" ne peut pas être vide ! </div></div><div class="form-group"> <input type="text" name="ville" class="form-control" id="ville" required placeholder="Renseignez votre ville"> <div class="invalid-feedback"> Le champ "ville" ne peut pas être vide ! </div></div><div class="form-group"> <input type="email" name="email" class="form-control" id="mail" required placeholder="Entrez votre email"> <div class="invalid-feedback"> L'email renseigné n'est pas valide ! </div></div><p>Tout les champs sont obligatoires.</p></form> </div><div class="modal-footer"> <button onclick="validateForm()" class="validationBouton"> Valider</button> </div></div></div></div>`;


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

  // Creation du (des) tableaux qui serviront à la création de product_id :

  var teddies = [];
  var cameras = [];
  var furniture = [];

  for (var i = 0; i < panier.length; i++) { // Pour chaque URL contenue dans le panier :
    result = panier[i].split("/"); // On la découpe pour obtenir un tableau de chaînes de caractères.

    // On vérifie si la catégorie de l'article et on stocke son id au tableau correspondant :

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

  envoiForm(teddies, "teddies");
  envoiForm(cameras, "cameras");
  envoiForm(furniture, "furniture");

}

function envoiForm(api, stringNomApi){
  // Création de l'objet contact :

  var nom = document.forms["validationCommande"]["nom"].value;
  var prenom = document.forms["validationCommande"]["prenom"].value;
  var adresse = document.forms["validationCommande"]["adresse"].value;
  var ville = document.forms["validationCommande"]["ville"].value;
  var email = document.forms["validationCommande"]["email"].value;

  var contact = [
    {
      firstName: nom,
      lastName: prenom,
      adress: adresse,
      city: ville,
      email: email
    }
  ];

  // Création du tableau de strings intitulé product_id :

  var products = api;

  // Création de la variable qui englobera ces deux objets :

  var send ={contact, products};

  // Envoi des requêtes POST :

  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/api/" + stringNomApi + "/order");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(send));
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
  alert("Article ajouté au panier !");
}

function viderPanier(){
  localStorage.clear();
  alert("Votre panier est à présent vide !");
  window.location.reload();
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

  // On verifie que les champs du formulaire soient conformes au format demandé, ou au minimum qu'ils ne soient pas vides. .
  
  if (nom.value == "") {
    nomValide = false;
    nom.className = "form-control is-invalid";
  }else{
    nomValide = true;
    nom.className = "form-control is-valid";
  }

  if (prenom.value == "") {
    prenomValide = false;
    prenom.className = "form-control is-invalid";
  }else{
    prenomValide = true;
    prenom.className = "form-control is-valid";
  }
  
  if (adresse.value == "") {
    adresseValide = false;
    adresse.className = "form-control is-invalid";
  }else{
    adresseValide = true;
    adresse.className = "form-control is-valid";
  }
  
  if (ville.value == "") {
    villeValide = false;
    ville.className = "form-control is-invalid";
  }else{
    villeValide = true;
    ville.className = "form-control is-valid";
  }

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){ // Utilisation d'un regex pour vérifier le format de l'email.
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
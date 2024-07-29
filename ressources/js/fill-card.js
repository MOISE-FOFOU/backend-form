document.addEventListener("DOMContentLoaded", () => {
    const staffArray = {}; // Objet pour stocker les résultats de l'API par poste
    const mainContent = document.getElementById("cards-content");

    // Fonction pour effectuer la requête AJAX
    function getStaff() {
        fetch("/Getenseignant")
            .then(response => response.json())
            .then(data => {
                // Regrouper les données par poste
                data.forEach(person => {
                    if (!(person.grade in staffArray)) {
                        staffArray[person.grade] = []; // Initialiser un tableau vide pour chaque poste
                    }
                    staffArray[person.grade].push(person);
                });

                // Créer les cards pour chaque poste
                createCards();
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du personnel :", error);
            });
    }

    // Fonction pour créer les cards à partir des données
    function createCards() {
        // Supprimer le contenu existant
        mainContent.innerHTML = "";

        // Parcourir les postes dans staffArray
        for (const grade in staffArray) {
            if (staffArray.hasOwnProperty(grade)) {
                const personnes = staffArray[grade];
                const cardHTML = `
                    <div class="card-single">
                        <div>
                            <h1>${personnes.length}</h1>
                            <span>${grade}</span>
                        </div>
                        <div>
                            <span class="fas fa-users"></span>
                        </div>
                    </div>
                `;
                mainContent.innerHTML += cardHTML;
            }
        }
    }

    // Appel de la fonction pour récupérer le personnel au chargement de la page
    getStaff();
});

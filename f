Voici le guide pas à pas pour construire ton dashboard dans Qlik Sense, en partant du principe que ton script a déjà été chargé avec succès.
​Étape 1 : Créer le bandeau de filtres réutilisable
​Au lieu de recréer les filtres sur chaque page, on va les enregistrer en Élément principal (Master Item).
​1. Ouvre ton application et clique sur Créer une feuille, puis nomme-la 1. Suivi des Audits.
​2. Clique sur le bouton Éditer la feuille (en haut à droite).
​3. Dans le menu de gauche, clique sur Graphiques, puis glisse l'objet Volet de filtres tout en haut de ta feuille (étire-le sur toute la largeur, sur 2 ou 3 lignes de hauteur).
​4. Clique sur Ajouter une dimension dans ce volet et ajoute ces 5 champs un par un :  
​Lead_Auditor_Project_Atomic (Renomme l'étiquette en Auditeur dans le panneau de droite)  
​Process_Domain_Final_A (Étiquette : Processus)  
​Programme_Line_Atomic (Étiquette : Business Unit)  
​APL_Department_Full_Name (Étiquette : APL)  
​Audit Year (Étiquette : Année)  
​5. Pour le réutiliser partout : fais un clic droit sur ce bandeau de filtres → Ajouter aux éléments principaux → nomme-le Filtres Globaux.
​Étape 2 : Construire la Feuille 1 (Suivi des Audits)
​Toujours sur ta première feuille (1. Suivi des Audits) :
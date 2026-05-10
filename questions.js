/* ═══════════════════════════════════════════════
   QUIZ DATA
   Exposed as window.QUIZ_DATA so it can be loaded
   via <script src="questions.js"> from both
   file:// (local) and Vercel (https) without fetch.
═══════════════════════════════════════════════ */
window.QUIZ_DATA = {
  metadata: {
    difficulty_levels: {
      1: 'Facile',
      2: 'Moyen',
      3: 'Difficile'
    }
  },

  math: [
    { difficulty: 2, question: 'Combien font 5 + 7 ?',                  options: ['10', '11', '12', '13'],                                  answer: '12' },
    { difficulty: 2, question: 'Combien font 9 × 3 ?',                  options: ['18', '27', '21', '24'],                                  answer: '27' },
    { difficulty: 2, question: 'Quel nombre vient après 99 ?',          options: ['100', '101', '98', '110'],                               answer: '100' },
    { difficulty: 2, question: 'Combien font 15 - 8 ?',                 options: ['5', '6', '7', '8'],                                      answer: '7' },
    { difficulty: 2, question: 'Combien de côtés a un triangle ?',      options: ['2', '3', '4', '5'],                                      answer: '3' },
    { difficulty: 2, question: 'Combien font 6 × 6 ?',                  options: ['30', '36', '42', '48'],                                  answer: '36' },
    { difficulty: 2, question: 'Quel est le double de 14 ?',            options: ['24', '26', '28', '30'],                                  answer: '28' },
    { difficulty: 2, question: 'Combien font 100 ÷ 10 ?',               options: ['5', '10', '20', '50'],                                   answer: '10' },
    { difficulty: 2, question: 'Quel chiffre manque : 2, 4, 6, ?, 10',  options: ['7', '8', '9', '12'],                                     answer: '8' },
    { difficulty: 2, question: 'Combien font 25 + 25 ?',                options: ['40', '45', '50', '55'],                                  answer: '50' },
    { difficulty: 2, question: 'Quel est le plus petit nombre ?',       options: ['3', '8', '1', '5'],                                      answer: '1' },
    { difficulty: 2, question: 'Combien de minutes y a-t-il dans une heure ?', options: ['30', '45', '60', '90'],                          answer: '60' },
    { difficulty: 2, question: 'Combien font 7 + 8 ?',                  options: ['14', '15', '16', '17'],                                  answer: '15' },
    { difficulty: 2, question: 'Quel est le triple de 5 ?',             options: ['10', '15', '20', '25'],                                  answer: '15' },
    { difficulty: 2, question: 'Combien font 81 ÷ 9 ?',                 options: ['7', '8', '9', '10'],                                     answer: '9' }
  ],

  lecture: [
    { difficulty: 2, question: 'Quel mot est un animal ?',                                    options: ['Chaise', 'Lion', 'Table', 'Livre'],                                  answer: 'Lion' },
    { difficulty: 2, question: 'Quelle lettre vient après B ?',                                options: ['A', 'C', 'D', 'E'],                                                  answer: 'C' },
    { difficulty: 2, question: 'Quel mot commence par la lettre M ?',                          options: ['Maison', 'Banane', 'Livre', 'Chat'],                                 answer: 'Maison' },
    { difficulty: 2, question: 'Quel mot rime avec « chat » ?',                                options: ['Rat', 'Livre', 'Pomme', 'Voiture'],                                  answer: 'Rat' },
    { difficulty: 2, question: 'Quel est le contraire de « grand » ?',                         options: ['Petit', 'Rapide', 'Long', 'Lourd'],                                  answer: 'Petit' },
    { difficulty: 2, question: 'Combien y a-t-il de voyelles dans « bateau » ?',               options: ['2', '3', '4', '5'],                                                  answer: '4' },
    { difficulty: 2, question: 'Quel mot est une couleur ?',                                   options: ['Rouge', 'Piano', 'Montagne', 'Poisson'],                             answer: 'Rouge' },
    { difficulty: 2, question: 'Quel mot est correctement écrit ?',                            options: ['Ecole', 'École', 'Aicole', 'Éccole'],                                answer: 'École' },
    { difficulty: 2, question: 'Quel mot désigne un fruit ?',                                  options: ['Banane', 'Chaussure', 'Nuage', 'Train'],                             answer: 'Banane' },
    { difficulty: 2, question: 'Quelle phrase est une question ?',                             options: ['Je mange une pomme.', 'Où vas-tu ?', 'Le chat dort.', 'Il fait beau.'], answer: 'Où vas-tu ?' },
    { difficulty: 2, question: 'Quel mot contient la lettre « z » ?',                          options: ['Maison', 'Pizza', 'Lapin', 'Stylo'],                                 answer: 'Pizza' },
    { difficulty: 2, question: 'Quel mot est au pluriel ?',                                    options: ['Chat', 'Livre', 'Chiens', 'Maison'],                                 answer: 'Chiens' },
    { difficulty: 2, question: 'Quel mot est un verbe ?',                                      options: ['Courir', 'Banane', 'Bleu', 'Table'],                                 answer: 'Courir' },
    { difficulty: 2, question: 'Quel mot commence par une voyelle ?',                          options: ['Orange', 'Banane', 'Chat', 'Livre'],                                 answer: 'Orange' },
    { difficulty: 2, question: 'Quel signe termine une phrase déclarative ?',                  options: ['?', '!', '.', ':'],                                                  answer: '.' }
  ],

  geographie: [
    { difficulty: 1, question: 'Quelle est la capitale de la France ?',                        options: ['Madrid', 'Paris', 'Rome', 'Berlin'],                                 answer: 'Paris' },
    { difficulty: 1, question: 'Quel est le plus grand océan du monde ?',                      options: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'],                     answer: 'Pacifique' },
    { difficulty: 1, question: 'Dans quel continent se trouve le Brésil ?',                    options: ['Afrique', 'Europe', 'Amérique du Sud', 'Asie'],                      answer: 'Amérique du Sud' },
    { difficulty: 2, question: 'Quel pays a la forme d’une botte ?',                           options: ['Espagne', 'Italie', 'Portugal', 'Grèce'],                            answer: 'Italie' },
    { difficulty: 2, question: 'Quel désert est le plus grand du monde chaud ?',               options: ['Sahara', 'Gobi', 'Kalahari', 'Atacama'],                             answer: 'Sahara' },
    { difficulty: 3, question: 'Quel est le plus long fleuve du monde ?',                      options: ['Nil', 'Amazonie', 'Mississippi', 'Yangtsé'],                         answer: 'Nil' },
    { difficulty: 3, question: 'Quelle montagne est la plus haute du monde ?',                 options: ['Mont Blanc', 'Everest', 'K2', 'Kilimandjaro'],                       answer: 'Everest' },
    { difficulty: 2, question: 'Quel pays est célèbre pour les pyramides de Gizeh ?',          options: ['Mexique', 'Égypte', 'Inde', 'Turquie'],                              answer: 'Égypte' },
    { difficulty: 2, question: 'Combien y a-t-il de continents sur Terre ?',                   options: ['5', '6', '7', '8'],                                                  answer: '7' },
    { difficulty: 2, question: 'Quelle est la capitale du Japon ?',                            options: ['Séoul', 'Pékin', 'Tokyo', 'Bangkok'],                                answer: 'Tokyo' },
    { difficulty: 2, question: 'Quel animal est symbole de l’Australie ?',                     options: ['Lion', 'Kangourou', 'Ours', 'Tigre'],                                answer: 'Kangourou' },
    { difficulty: 2, question: 'Quel pays est traversé par la Tour de Pise ?',                 options: ['Italie', 'France', 'Espagne', 'Autriche'],                           answer: 'Italie' },
    { difficulty: 2, question: 'Quelle mer sépare l’Europe et l’Afrique ?',                    options: ['Mer Rouge', 'Méditerranée', 'Mer Noire', 'Mer du Nord'],             answer: 'Méditerranée' },
    { difficulty: 2, question: 'Quelle est la capitale du Canada ?',                           options: ['Toronto', 'Ottawa', 'Montréal', 'Vancouver'],                        answer: 'Ottawa' },
    { difficulty: 2, question: 'Quel pays est connu pour ses moulins et ses tulipes ?',        options: ['Belgique', 'Pays-Bas', 'Danemark', 'Suisse'],                        answer: 'Pays-Bas' }
  ],

  astronomie: [
    { difficulty: 2, question: 'Quelle planète est la plus proche du Soleil ?',                options: ['Mars', 'Mercure', 'Vénus', 'Jupiter'],                               answer: 'Mercure' },
    { difficulty: 2, question: 'Comment s’appelle notre galaxie ?',                            options: ['Andromède', 'Voie lactée', 'Orion', 'Titan'],                        answer: 'Voie lactée' },
    { difficulty: 2, question: 'Quelle planète est surnommée la planète rouge ?',              options: ['Mars', 'Saturne', 'Neptune', 'Mercure'],                             answer: 'Mars' },
    { difficulty: 2, question: 'Quel objet éclaire la Terre le jour ?',                        options: ['La Lune', 'Mars', 'Le Soleil', 'Vénus'],                             answer: 'Le Soleil' },
    { difficulty: 1, question: 'Combien de planètes y a-t-il dans le système solaire ?',       options: ['7', '8', '9', '10'],                                                 answer: '8' },
    { difficulty: 2, question: 'Quelle planète possède de grands anneaux ?',                   options: ['Terre', 'Mars', 'Saturne', 'Mercure'],                               answer: 'Saturne' },
    { difficulty: 2, question: 'Comment appelle-t-on le satellite naturel de la Terre ?',      options: ['Titan', 'La Lune', 'Europe', 'Io'],                                  answer: 'La Lune' },
    { difficulty: 2, question: 'Quelle planète est la plus grande du système solaire ?',       options: ['Jupiter', 'Terre', 'Mars', 'Vénus'],                                 answer: 'Jupiter' },
    { difficulty: 2, question: 'Que voit-on souvent dans le ciel la nuit ?',                   options: ['Des étoiles', 'Des poissons', 'Des arbres', 'Des voitures'],         answer: 'Des étoiles' },
    { difficulty: 3, question: 'Quel astronaute a marché le premier sur la Lune ?',            options: ['Thomas Pesquet', 'Neil Armstrong', 'Yuri Gagarine', 'Buzz Aldrin'], answer: 'Neil Armstrong' },
    { difficulty: 2, question: 'Quelle planète est connue pour être très chaude ?',            options: ['Vénus', 'Neptune', 'Mars', 'Saturne'],                               answer: 'Vénus' },
    { difficulty: 2, question: 'Quel objet utilise-t-on pour observer les étoiles ?',          options: ['Microscope', 'Télescope', 'Boussole', 'Thermomètre'],                answer: 'Télescope' },
    { difficulty: 2, question: 'Comment appelle-t-on une pierre venant de l’espace ?',         options: ['Météorite', 'Volcan', 'Cristal', 'Nuage'],                           answer: 'Météorite' },
    { difficulty: 2, question: 'Quelle planète est surnommée la planète bleue ?',              options: ['Mars', 'La Terre', 'Mercure', 'Jupiter'],                            answer: 'La Terre' },
    { difficulty: 2, question: 'Que tourne autour de la Terre ?',                              options: ['Le Soleil', 'La Lune', 'Mars', 'Saturne'],                           answer: 'La Lune' }
  ],

  surprise: [
    { difficulty: 2, question: 'Quel animal dit « miaou » ?',                                  options: ['Chien', 'Chat', 'Vache', 'Cheval'],                                  answer: 'Chat' },
    { difficulty: 2, question: 'Quelle couleur obtient-on en mélangeant bleu et jaune ?',      options: ['Vert', 'Orange', 'Rouge', 'Violet'],                                 answer: 'Vert' },
    { difficulty: 2, question: 'Combien de jours y a-t-il dans une semaine ?',                 options: ['5', '6', '7', '8'],                                                  answer: '7' },
    { difficulty: 2, question: 'Quel instrument a des touches noires et blanches ?',           options: ['Guitare', 'Piano', 'Tambour', 'Flûte'],                              answer: 'Piano' },
    { difficulty: 2, question: 'Quel super-héros porte souvent une cape rouge ?',              options: ['Batman', 'Spider-Man', 'Superman', 'Iron Man'],                      answer: 'Superman' },
    { difficulty: 2, question: 'Quel animal est le plus grand du monde ?',                     options: ['Éléphant', 'Baleine bleue', 'Girafe', 'Requin'],                     answer: 'Baleine bleue' },
    { difficulty: 2, question: 'Quel est le sport préféré des pirates ?',                      options: ['Surf', 'Football', 'Voile', 'Tennis'],                               answer: 'Voile' },
    { difficulty: 2, question: 'Quel objet donne l’heure ?',                                   options: ['Télévision', 'Horloge', 'Livre', 'Lampe'],                           answer: 'Horloge' },
    { difficulty: 2, question: 'Quelle saison vient après le printemps ?',                     options: ['Hiver', 'Automne', 'Été', 'Saison des pluies'],                      answer: 'Été' },
    { difficulty: 2, question: 'Quel animal a une longue trompe ?',                            options: ['Lion', 'Éléphant', 'Girafe', 'Ours'],                                answer: 'Éléphant' },
    { difficulty: 2, question: 'Quel aliment fabrique-t-on avec du lait ?',                    options: ['Pain', 'Fromage', 'Riz', 'Pâtes'],                                   answer: 'Fromage' },
    { difficulty: 2, question: 'Quelle fête célèbre-t-on avec un gâteau et des bougies ?',     options: ['Noël', 'Halloween', 'Anniversaire', 'Pâques'],                       answer: 'Anniversaire' },
    { difficulty: 2, question: 'Quel véhicule vole dans le ciel ?',                            options: ['Voiture', 'Train', 'Avion', 'Bateau'],                               answer: 'Avion' },
    { difficulty: 2, question: 'Quel animal pond des œufs ?',                                  options: ['Poule', 'Chat', 'Chien', 'Lapin'],                                   answer: 'Poule' },
    { difficulty: 2, question: 'Quelle boisson est chaude le matin pour beaucoup d’adultes ?', options: ['Café', 'Jus d’orange', 'Eau', 'Limonade'],                           answer: 'Café' }
  ],

  animaux: [
    // ─── FACILE (25) ───
    // Sons d'animaux
    { id: 'animaux-001', difficulty: 1, question: 'Quel animal dit « miaou » ?',         options: ['Chien', 'Chat', 'Vache', 'Cheval'],   answer: 'Chat',     image: 'assets/images/animaux/animaux-001.jpg' },
    { id: 'animaux-002', difficulty: 1, question: 'Quel animal dit « ouaf » ?',          options: ['Chat', 'Chien', 'Mouton', 'Canard'],  answer: 'Chien',    image: 'assets/images/animaux/animaux-002.jpg' },
    { id: 'animaux-003', difficulty: 1, question: 'Quel animal dit « meuh » ?',          options: ['Cheval', 'Mouton', 'Vache', 'Cochon'], answer: 'Vache',   image: 'assets/images/animaux/animaux-003.jpg' },
    { id: 'animaux-004', difficulty: 1, question: 'Quel animal dit « coin coin » ?',     options: ['Poule', 'Canard', 'Pigeon', 'Cygne'], answer: 'Canard',   image: 'assets/images/animaux/animaux-004.jpg' },
    { id: 'animaux-005', difficulty: 1, question: 'Quel animal dit « bêêê » ?',          options: ['Mouton', 'Chèvre', 'Cochon', 'Lapin'], answer: 'Mouton',  image: 'assets/images/animaux/animaux-005.jpg' },
    // Apparence
    { id: 'animaux-006', difficulty: 1, question: 'Quel animal a un très long cou ?',    options: ['Éléphant', 'Girafe', 'Tigre', 'Singe'], answer: 'Girafe', image: 'assets/images/animaux/animaux-006.jpg' },
    { id: 'animaux-007', difficulty: 1, question: 'Quel animal a une longue trompe ?',   options: ['Lion', 'Éléphant', 'Girafe', 'Ours'], answer: 'Éléphant', image: 'assets/images/animaux/animaux-007.jpg' },
    { id: 'animaux-008', difficulty: 1, question: 'Quel animal a des rayures noires et blanches ?', options: ['Lion', 'Tigre', 'Zèbre', 'Léopard'], answer: 'Zèbre', image: 'assets/images/animaux/animaux-008.jpg' },
    { id: 'animaux-009', difficulty: 1, question: 'Quel animal a une grande crinière ?', options: ['Lion', 'Tigre', 'Loup', 'Renard'],   answer: 'Lion',     image: 'assets/images/animaux/animaux-009.jpg' },
    { id: 'animaux-010', difficulty: 1, question: 'Quel animal aime grignoter des carottes ?', options: ['Chat', 'Chien', 'Lapin', 'Souris'], answer: 'Lapin', image: 'assets/images/animaux/animaux-010.jpg' },
    // Image-question (4) — l'image EST la question
    { id: 'animaux-011', difficulty: 1, question: 'Quel animal vois-tu ?',               options: ['Lion', 'Tigre', 'Léopard', 'Guépard'], answer: 'Lion',   image: 'assets/images/animaux/animaux-011.jpg' },
    { id: 'animaux-012', difficulty: 1, question: 'Quel animal vois-tu ?',               options: ['Cheval', 'Zèbre', 'Âne', 'Vache'],   answer: 'Zèbre',    image: 'assets/images/animaux/animaux-012.jpg' },
    { id: 'animaux-013', difficulty: 1, question: 'Quel animal vois-tu ?',               options: ['Éléphant', 'Hippopotame', 'Rhinocéros', 'Bison'], answer: 'Éléphant', image: 'assets/images/animaux/animaux-013.jpg' },
    { id: 'animaux-014', difficulty: 1, question: 'Quel animal vois-tu ?',               options: ['Panda', 'Ours', 'Koala', 'Renard'],  answer: 'Panda',    image: 'assets/images/animaux/animaux-014.jpg' },
    // Image-options (3) — 4 photos, choisis la bonne
    { id: 'animaux-015', difficulty: 1, question: 'Clique sur le chat.',                 options: ['Chat', 'Chien', 'Lapin', 'Hamster'], answer: 'Chat',     optionImages: ['assets/images/animaux/animaux-015-a.jpg','assets/images/animaux/animaux-015-b.jpg','assets/images/animaux/animaux-015-c.jpg','assets/images/animaux/animaux-015-d.jpg'] },
    { id: 'animaux-016', difficulty: 1, question: 'Quel animal vit dans l\'eau ?',       options: ['Poisson', 'Chien', 'Oiseau', 'Singe'], answer: 'Poisson', optionImages: ['assets/images/animaux/animaux-016-a.jpg','assets/images/animaux/animaux-016-b.jpg','assets/images/animaux/animaux-016-c.jpg','assets/images/animaux/animaux-016-d.jpg'] },
    { id: 'animaux-017', difficulty: 1, question: 'Quel animal vole ?',                   options: ['Oiseau', 'Poisson', 'Chat', 'Tortue'], answer: 'Oiseau', optionImages: ['assets/images/animaux/animaux-017-a.jpg','assets/images/animaux/animaux-017-b.jpg','assets/images/animaux/animaux-017-c.jpg','assets/images/animaux/animaux-017-d.jpg'] },
    // Habitats / familles
    { id: 'animaux-018', difficulty: 1, question: 'Quel animal pond des œufs ?',         options: ['Poule', 'Chat', 'Chien', 'Lapin'],   answer: 'Poule',    image: 'assets/images/animaux/animaux-018.jpg' },
    { id: 'animaux-019', difficulty: 1, question: 'Quel est le bébé du chien ?',         options: ['Chaton', 'Chiot', 'Poussin', 'Veau'], answer: 'Chiot',   image: 'assets/images/animaux/animaux-019.jpg' },
    { id: 'animaux-020', difficulty: 1, question: 'Quel est le bébé du chat ?',          options: ['Chiot', 'Chaton', 'Lapereau', 'Poulain'], answer: 'Chaton', image: 'assets/images/animaux/animaux-020.jpg' },
    { id: 'animaux-021', difficulty: 1, question: 'Quel animal aime le miel ?',          options: ['Lion', 'Ours', 'Tigre', 'Loup'],     answer: 'Ours',     image: 'assets/images/animaux/animaux-021.jpg' },
    { id: 'animaux-022', difficulty: 1, question: 'Quel animal saute très haut et vit en Australie ?', options: ['Kangourou', 'Loup', 'Panda', 'Renard'], answer: 'Kangourou', image: 'assets/images/animaux/animaux-022.jpg' },
    { id: 'animaux-023', difficulty: 1, question: 'Quel animal porte sa maison sur son dos ?', options: ['Escargot', 'Fourmi', 'Oiseau', 'Tigre'], answer: 'Escargot', image: 'assets/images/animaux/animaux-023.jpg' },
    { id: 'animaux-024', difficulty: 1, question: 'Quel animal a une longue queue et grimpe aux arbres ?', options: ['Singe', 'Éléphant', 'Vache', 'Cochon'], answer: 'Singe', image: 'assets/images/animaux/animaux-024.jpg' },
    { id: 'animaux-025', difficulty: 1, question: 'Quel animal a une carapace dure ?',   options: ['Lapin', 'Tortue', 'Chien', 'Poule'], answer: 'Tortue',   image: 'assets/images/animaux/animaux-025.jpg' },

    // ─── MOYEN (50) ───
    // Bébés et familles
    { id: 'animaux-026', difficulty: 2, question: 'Quel est le bébé de la vache ?',      options: ['Veau', 'Poulain', 'Agneau', 'Chevreau'], answer: 'Veau',  image: 'assets/images/animaux/animaux-026.jpg' },
    { id: 'animaux-027', difficulty: 2, question: 'Quel est le bébé du mouton ?',        options: ['Veau', 'Agneau', 'Poulain', 'Chiot'], answer: 'Agneau',  image: 'assets/images/animaux/animaux-027.jpg' },
    { id: 'animaux-028', difficulty: 2, question: 'Quel est le bébé du cheval ?',        options: ['Poulain', 'Veau', 'Agneau', 'Faon'], answer: 'Poulain',  image: 'assets/images/animaux/animaux-028.jpg' },
    { id: 'animaux-029', difficulty: 2, question: 'Quel est le bébé de la poule ?',      options: ['Caneton', 'Poussin', 'Oison', 'Pigeonneau'], answer: 'Poussin', image: 'assets/images/animaux/animaux-029.jpg' },
    { id: 'animaux-030', difficulty: 2, question: 'Comment s\'appelle la femelle du cheval ?', options: ['Vache', 'Jument', 'Brebis', 'Chèvre'], answer: 'Jument', image: 'assets/images/animaux/animaux-030.jpg' },
    { id: 'animaux-031', difficulty: 2, question: 'Comment s\'appelle le mâle de la poule ?', options: ['Coq', 'Canard', 'Dindon', 'Paon'], answer: 'Coq', image: 'assets/images/animaux/animaux-031.jpg' },
    { id: 'animaux-032', difficulty: 2, question: 'Comment s\'appelle le mâle de la vache ?', options: ['Cheval', 'Taureau', 'Buffle', 'Bouc'], answer: 'Taureau', image: 'assets/images/animaux/animaux-032.jpg' },
    // Sons et cris
    { id: 'animaux-033', difficulty: 2, question: 'Quel oiseau dit « cocorico » le matin ?', options: ['Coq', 'Pigeon', 'Hibou', 'Pie'], answer: 'Coq', image: 'assets/images/animaux/animaux-033.jpg' },
    { id: 'animaux-034', difficulty: 2, question: 'Quel insecte fait « bzzz » ?',        options: ['Papillon', 'Abeille', 'Coccinelle', 'Fourmi'], answer: 'Abeille', image: 'assets/images/animaux/animaux-034.jpg' },
    { id: 'animaux-035', difficulty: 2, question: 'Quel animal dit « coa coa » ?',       options: ['Crapaud', 'Grenouille', 'Lézard', 'Poisson'], answer: 'Grenouille', image: 'assets/images/animaux/animaux-035.jpg' },
    // Image-question (4)
    { id: 'animaux-036', difficulty: 2, question: 'Quel animal vois-tu ?',               options: ['Pieuvre', 'Méduse', 'Étoile de mer', 'Crabe'], answer: 'Pieuvre', image: 'assets/images/animaux/animaux-036.jpg' },
    { id: 'animaux-037', difficulty: 2, question: 'Quel animal vois-tu ?',               options: ['Papillon', 'Libellule', 'Abeille', 'Coccinelle'], answer: 'Papillon', image: 'assets/images/animaux/animaux-037.jpg' },
    { id: 'animaux-038', difficulty: 2, question: 'Quel oiseau vois-tu ?',                options: ['Aigle', 'Hibou', 'Faucon', 'Corbeau'], answer: 'Hibou', image: 'assets/images/animaux/animaux-038.jpg' },
    { id: 'animaux-039', difficulty: 2, question: 'Quel animal vois-tu ?',                options: ['Pingouin', 'Manchot', 'Mouette', 'Albatros'], answer: 'Manchot', image: 'assets/images/animaux/animaux-039.jpg' },
    // Image-options (6)
    { id: 'animaux-040', difficulty: 2, question: 'Quel animal a une carapace ?',        options: ['Tortue', 'Lapin', 'Renard', 'Cerf'], answer: 'Tortue', optionImages: ['assets/images/animaux/animaux-040-a.jpg','assets/images/animaux/animaux-040-b.jpg','assets/images/animaux/animaux-040-c.jpg','assets/images/animaux/animaux-040-d.jpg'] },
    { id: 'animaux-041', difficulty: 2, question: 'Quel animal a 8 pattes ?',            options: ['Araignée', 'Fourmi', 'Mouche', 'Coccinelle'], answer: 'Araignée', optionImages: ['assets/images/animaux/animaux-041-a.jpg','assets/images/animaux/animaux-041-b.jpg','assets/images/animaux/animaux-041-c.jpg','assets/images/animaux/animaux-041-d.jpg'] },
    { id: 'animaux-042', difficulty: 2, question: 'Quel animal a des taches ?',          options: ['Léopard', 'Lion', 'Loup', 'Ours'], answer: 'Léopard', optionImages: ['assets/images/animaux/animaux-042-a.jpg','assets/images/animaux/animaux-042-b.jpg','assets/images/animaux/animaux-042-c.jpg','assets/images/animaux/animaux-042-d.jpg'] },
    { id: 'animaux-043', difficulty: 2, question: 'Quel animal a des plumes ?',          options: ['Perroquet', 'Lapin', 'Poisson', 'Serpent'], answer: 'Perroquet', optionImages: ['assets/images/animaux/animaux-043-a.jpg','assets/images/animaux/animaux-043-b.jpg','assets/images/animaux/animaux-043-c.jpg','assets/images/animaux/animaux-043-d.jpg'] },
    { id: 'animaux-044', difficulty: 2, question: 'Quel animal vit dans la mer ?',       options: ['Dauphin', 'Lion', 'Singe', 'Girafe'], answer: 'Dauphin', optionImages: ['assets/images/animaux/animaux-044-a.jpg','assets/images/animaux/animaux-044-b.jpg','assets/images/animaux/animaux-044-c.jpg','assets/images/animaux/animaux-044-d.jpg'] },
    { id: 'animaux-045', difficulty: 2, question: 'Quel animal vit à la ferme ?',        options: ['Vache', 'Lion', 'Tigre', 'Éléphant'], answer: 'Vache', optionImages: ['assets/images/animaux/animaux-045-a.jpg','assets/images/animaux/animaux-045-b.jpg','assets/images/animaux/animaux-045-c.jpg','assets/images/animaux/animaux-045-d.jpg'] },
    // Diet / behavior
    { id: 'animaux-046', difficulty: 2, question: 'Que mange le panda ?',                options: ['Bambou', 'Viande', 'Poisson', 'Insectes'], answer: 'Bambou', image: 'assets/images/animaux/animaux-046.jpg' },
    { id: 'animaux-047', difficulty: 2, question: 'Que mange le lion ?',                  options: ['Herbe', 'Viande', 'Fruits', 'Bambou'], answer: 'Viande', image: 'assets/images/animaux/animaux-047.jpg' },
    { id: 'animaux-048', difficulty: 2, question: 'Que fabriquent les abeilles ?',       options: ['Du lait', 'Du miel', 'De la laine', 'Du chocolat'], answer: 'Du miel', image: 'assets/images/animaux/animaux-048.jpg' },
    { id: 'animaux-049', difficulty: 2, question: 'Combien de pattes a une araignée ?',  options: ['4', '6', '8', '10'],                 answer: '8',        image: 'assets/images/animaux/animaux-049.jpg' },
    { id: 'animaux-050', difficulty: 2, question: 'Quel animal est célèbre pour sa mémoire ?', options: ['Éléphant', 'Souris', 'Lapin', 'Chat'], answer: 'Éléphant', image: 'assets/images/animaux/animaux-050.jpg' },
    // Wildlife habits
    { id: 'animaux-051', difficulty: 2, question: 'Quel oiseau parle parfois comme nous ?', options: ['Perroquet', 'Pigeon', 'Mouette', 'Moineau'], answer: 'Perroquet', image: 'assets/images/animaux/animaux-051.jpg' },
    { id: 'animaux-052', difficulty: 2, question: 'Quel animal vit dans une ruche ?',     options: ['Abeille', 'Fourmi', 'Papillon', 'Mouche'], answer: 'Abeille', image: 'assets/images/animaux/animaux-052.jpg' },
    { id: 'animaux-053', difficulty: 2, question: 'Quel animal vit dans un terrier ?',    options: ['Lapin', 'Chat', 'Pigeon', 'Poisson'], answer: 'Lapin', image: 'assets/images/animaux/animaux-053.jpg' },
    { id: 'animaux-054', difficulty: 2, question: 'Quel animal cherche des glands en automne ?', options: ['Écureuil', 'Lapin', 'Oiseau', 'Renard'], answer: 'Écureuil', image: 'assets/images/animaux/animaux-054.jpg' },
    { id: 'animaux-055', difficulty: 2, question: 'Quel animal cousin du chien hurle à la lune ?', options: ['Loup', 'Renard', 'Tigre', 'Lion'], answer: 'Loup', image: 'assets/images/animaux/animaux-055.jpg' },
    { id: 'animaux-056', difficulty: 2, question: 'Quel animal a une queue rousse et est très rusé ?', options: ['Renard', 'Lapin', 'Cerf', 'Sanglier'], answer: 'Renard', image: 'assets/images/animaux/animaux-056.jpg' },
    // Body features
    { id: 'animaux-057', difficulty: 2, question: 'Quel animal a des piquants sur le dos ?', options: ['Hérisson', 'Lapin', 'Renard', 'Écureuil'], answer: 'Hérisson', image: 'assets/images/animaux/animaux-057.jpg' },
    { id: 'animaux-058', difficulty: 2, question: 'Quel animal est rose et se tient sur une patte ?', options: ['Cigogne', 'Flamant rose', 'Pélican', 'Cygne'], answer: 'Flamant rose', image: 'assets/images/animaux/animaux-058.jpg' },
    { id: 'animaux-059', difficulty: 2, question: 'Quel insecte est rouge avec des points noirs ?', options: ['Coccinelle', 'Abeille', 'Papillon', 'Fourmi'], answer: 'Coccinelle', image: 'assets/images/animaux/animaux-059.jpg' },
    { id: 'animaux-060', difficulty: 2, question: 'Quel animal noir et blanc ressemble à un cheval ?', options: ['Zèbre', 'Âne', 'Cerf', 'Chameau'], answer: 'Zèbre', image: 'assets/images/animaux/animaux-060.jpg' },
    { id: 'animaux-061', difficulty: 2, question: 'Quel animal traverse le désert avec une bosse ?', options: ['Cheval', 'Chameau', 'Vache', 'Buffle'], answer: 'Chameau', image: 'assets/images/animaux/animaux-061.jpg' },
    { id: 'animaux-062', difficulty: 2, question: 'Quel poisson est dangereux et a beaucoup de dents ?', options: ['Sardine', 'Requin', 'Saumon', 'Truite'], answer: 'Requin', image: 'assets/images/animaux/animaux-062.jpg' },
    { id: 'animaux-063', difficulty: 2, question: 'Quel animal très intelligent saute hors de l\'eau ?', options: ['Dauphin', 'Méduse', 'Étoile de mer', 'Crevette'], answer: 'Dauphin', image: 'assets/images/animaux/animaux-063.jpg' },
    { id: 'animaux-064', difficulty: 2, question: 'Quel grand reptile vit dans la rivière ?', options: ['Crocodile', 'Tortue', 'Lézard', 'Serpent'], answer: 'Crocodile', image: 'assets/images/animaux/animaux-064.jpg' },
    { id: 'animaux-065', difficulty: 2, question: 'Quel animal est connu pour être très paresseux ?', options: ['Paresseux', 'Singe', 'Lapin', 'Renard'], answer: 'Paresseux', image: 'assets/images/animaux/animaux-065.jpg' },
    { id: 'animaux-066', difficulty: 2, question: 'Quel oiseau ne peut pas voler et nage très bien ?', options: ['Manchot', 'Aigle', 'Pigeon', 'Hibou'], answer: 'Manchot', image: 'assets/images/animaux/animaux-066.jpg' },
    { id: 'animaux-067', difficulty: 2, question: 'Quel animal a une queue qui peut se détacher ?', options: ['Lézard', 'Serpent', 'Tortue', 'Grenouille'], answer: 'Lézard', image: 'assets/images/animaux/animaux-067.jpg' },
    { id: 'animaux-068', difficulty: 2, question: 'Quel petit rongeur fait du fromage dans les histoires ?', options: ['Souris', 'Lapin', 'Hérisson', 'Écureuil'], answer: 'Souris', image: 'assets/images/animaux/animaux-068.jpg' },
    { id: 'animaux-069', difficulty: 2, question: 'Quel insecte a 4 belles ailes colorées ?', options: ['Papillon', 'Abeille', 'Mouche', 'Fourmi'], answer: 'Papillon', image: 'assets/images/animaux/animaux-069.jpg' },
    { id: 'animaux-070', difficulty: 2, question: 'Quel grand singe vit en Afrique ?',        options: ['Gorille', 'Lémurien', 'Orang-outan', 'Ouistiti'], answer: 'Gorille', image: 'assets/images/animaux/animaux-070.jpg' },
    { id: 'animaux-071', difficulty: 2, question: 'Quel animal australien dort presque tout le temps ?', options: ['Koala', 'Kangourou', 'Émeu', 'Wombat'], answer: 'Koala', image: 'assets/images/animaux/animaux-071.jpg' },
    { id: 'animaux-072', difficulty: 2, question: 'Quel animal blanc et noir vit en Chine ?', options: ['Panda', 'Tigre', 'Ours brun', 'Léopard'], answer: 'Panda', image: 'assets/images/animaux/animaux-072.jpg' },
    { id: 'animaux-073', difficulty: 2, question: 'Quel animal a un long museau et vit dans la boue ?', options: ['Cochon', 'Vache', 'Cheval', 'Chèvre'], answer: 'Cochon', image: 'assets/images/animaux/animaux-073.jpg' },
    { id: 'animaux-074', difficulty: 2, question: 'Quel animal a des bois sur la tête ?',     options: ['Cerf', 'Cheval', 'Lion', 'Loup'], answer: 'Cerf', image: 'assets/images/animaux/animaux-074.jpg' },
    { id: 'animaux-075', difficulty: 2, question: 'Quel reptile glisse au sol sans pattes ?', options: ['Serpent', 'Lézard', 'Crocodile', 'Tortue'], answer: 'Serpent', image: 'assets/images/animaux/animaux-075.jpg' },

    // ─── DIFFICILE (25) ───
    { id: 'animaux-076', difficulty: 3, question: 'Quel est l\'animal terrestre le plus rapide ?', options: ['Guépard', 'Lion', 'Cheval', 'Loup'], answer: 'Guépard', image: 'assets/images/animaux/animaux-076.jpg' },
    { id: 'animaux-077', difficulty: 3, question: 'Quel mammifère peut voler ?',         options: ['Chauve-souris', 'Aigle', 'Papillon', 'Pigeon'], answer: 'Chauve-souris', image: 'assets/images/animaux/animaux-077.jpg' },
    { id: 'animaux-078', difficulty: 3, question: 'Quel animal change de couleur pour se cacher ?', options: ['Caméléon', 'Crocodile', 'Panda', 'Dauphin'], answer: 'Caméléon', image: 'assets/images/animaux/animaux-078.jpg' },
    { id: 'animaux-079', difficulty: 3, question: 'Quel ours vit au pôle Nord ?',        options: ['Ours polaire', 'Panda', 'Ours brun', 'Koala'], answer: 'Ours polaire', image: 'assets/images/animaux/animaux-079.jpg' },
    { id: 'animaux-080', difficulty: 3, question: 'Quel animal possède 8 bras ?',         options: ['Pieuvre', 'Crabe', 'Étoile de mer', 'Méduse'], answer: 'Pieuvre', image: 'assets/images/animaux/animaux-080.jpg' },
    // Image-question (2)
    { id: 'animaux-081', difficulty: 3, question: 'Quel animal vois-tu ?',               options: ['Caméléon', 'Iguane', 'Gecko', 'Lézard'], answer: 'Caméléon', image: 'assets/images/animaux/animaux-081.jpg' },
    { id: 'animaux-082', difficulty: 3, question: 'Quel oiseau vois-tu ?',               options: ['Colibri', 'Moineau', 'Pinson', 'Mésange'], answer: 'Colibri', image: 'assets/images/animaux/animaux-082.jpg' },
    // Image-options (1)
    { id: 'animaux-083', difficulty: 3, question: 'Quel animal est un mammifère marin ?', options: ['Dauphin', 'Requin', 'Pieuvre', 'Méduse'], answer: 'Dauphin', optionImages: ['assets/images/animaux/animaux-083-a.jpg','assets/images/animaux/animaux-083-b.jpg','assets/images/animaux/animaux-083-c.jpg','assets/images/animaux/animaux-083-d.jpg'] },
    // Records and facts
    { id: 'animaux-084', difficulty: 3, question: 'Quel est le plus grand animal du monde ?', options: ['Éléphant', 'Baleine bleue', 'Girafe', 'Requin'], answer: 'Baleine bleue', image: 'assets/images/animaux/animaux-084.jpg' },
    { id: 'animaux-085', difficulty: 3, question: 'Quel est l\'animal le plus haut du monde ?', options: ['Éléphant', 'Girafe', 'Ours', 'Chameau'], answer: 'Girafe', image: 'assets/images/animaux/animaux-085.jpg' },
    { id: 'animaux-086', difficulty: 3, question: 'Quel oiseau est le plus petit du monde ?', options: ['Colibri', 'Moineau', 'Mésange', 'Hirondelle'], answer: 'Colibri', image: 'assets/images/animaux/animaux-086.jpg' },
    { id: 'animaux-087', difficulty: 3, question: 'Quel grand félin a des rayures oranges et noires ?', options: ['Tigre', 'Lion', 'Léopard', 'Guépard'], answer: 'Tigre', image: 'assets/images/animaux/animaux-087.jpg' },
    { id: 'animaux-088', difficulty: 3, question: 'Quel mammifère marin chasse en groupe ?', options: ['Orque', 'Baleine', 'Requin', 'Méduse'], answer: 'Orque', image: 'assets/images/animaux/animaux-088.jpg' },
    // Bébés
    { id: 'animaux-089', difficulty: 3, question: 'Comment s\'appelle le bébé du loup ?', options: ['Louveteau', 'Renardeau', 'Chiot', 'Lionceau'], answer: 'Louveteau', image: 'assets/images/animaux/animaux-089.jpg' },
    { id: 'animaux-090', difficulty: 3, question: 'Comment s\'appelle le bébé de l\'éléphant ?', options: ['Éléphanteau', 'Veau', 'Poulain', 'Lionceau'], answer: 'Éléphanteau', image: 'assets/images/animaux/animaux-090.jpg' },
    { id: 'animaux-091', difficulty: 3, question: 'Comment s\'appelle le bébé de la grenouille ?', options: ['Têtard', 'Larve', 'Alevin', 'Poussin'], answer: 'Têtard', image: 'assets/images/animaux/animaux-091.jpg' },
    // Behaviors
    { id: 'animaux-092', difficulty: 3, question: 'Quel animal hiverne dans une grotte ?',  options: ['Ours', 'Loup', 'Renard', 'Lapin'], answer: 'Ours', image: 'assets/images/animaux/animaux-092.jpg' },
    { id: 'animaux-093', difficulty: 3, question: 'Quel oiseau chasse la nuit ?',           options: ['Chouette', 'Pigeon', 'Aigle', 'Mouette'], answer: 'Chouette', image: 'assets/images/animaux/animaux-093.jpg' },
    { id: 'animaux-094', difficulty: 3, question: 'Quel poisson peut donner des chocs électriques ?', options: ['Anguille électrique', 'Saumon', 'Sardine', 'Thon'], answer: 'Anguille électrique', image: 'assets/images/animaux/animaux-094.jpg' },
    // Less common species
    { id: 'animaux-095', difficulty: 3, question: 'Quel animal du désert porte une bosse de graisse ?', options: ['Dromadaire', 'Cheval', 'Renard', 'Cerf'], answer: 'Dromadaire', image: 'assets/images/animaux/animaux-095.jpg' },
    { id: 'animaux-096', difficulty: 3, question: 'Quel animal aussi appelé « roi de la savane » ?', options: ['Lion', 'Tigre', 'Léopard', 'Hyène'], answer: 'Lion', image: 'assets/images/animaux/animaux-096.jpg' },
    { id: 'animaux-097', difficulty: 3, question: 'Quel petit animal a une mâchoire qui claque ?',  options: ['Crabe', 'Crevette', 'Méduse', 'Étoile de mer'], answer: 'Crabe', image: 'assets/images/animaux/animaux-097.jpg' },
    { id: 'animaux-098', difficulty: 3, question: 'Quel oiseau est le plus grand du monde ?',  options: ['Autruche', 'Aigle', 'Cigogne', 'Pélican'], answer: 'Autruche', image: 'assets/images/animaux/animaux-098.jpg' },
    { id: 'animaux-099', difficulty: 3, question: 'Quel reptile peut vivre plus de 100 ans ?', options: ['Tortue', 'Serpent', 'Lézard', 'Crocodile'], answer: 'Tortue', image: 'assets/images/animaux/animaux-099.jpg' },
    { id: 'animaux-100', difficulty: 3, question: 'Quel animal a la peau couverte d\'écailles brillantes ?', options: ['Poisson', 'Lapin', 'Oiseau', 'Chat'], answer: 'Poisson', image: 'assets/images/animaux/animaux-100.jpg' }
  ],

  arabe: [
    { difficulty: 1, question: 'Comment dit-on « bonjour » en arabe ?',                         options: ['Merci', 'Salam', 'Ma’a salama', 'Afwan'],                            answer: 'Salam' },
    { difficulty: 1, question: 'Quelle lettre arabe est la première de l’alphabet ?',           options: ['ب', 'ت', 'أ', 'د'],                                                   answer: 'أ' },
    { difficulty: 1, question: 'Comment dit-on « maman » en arabe ?',                           options: ['أب', 'أم', 'أخت', 'جد'],                                              answer: 'أم' },
    { difficulty: 1, question: 'Quel mot arabe signifie « merci » ?',                           options: ['شكرا', 'سلام', 'نعم', 'لا'],                                          answer: 'شكرا' },
    { difficulty: 1, question: 'Comment dit-on « oui » en arabe ?',                             options: ['لا', 'ربما', 'نعم', 'مع السلامة'],                                    answer: 'نعم' },
    { difficulty: 2, question: 'Quelle lettre vient après « ب » ?',                             options: ['ت', 'ث', 'ج', 'ح'],                                                   answer: 'ت' },
    { difficulty: 2, question: 'Comment dit-on « livre » en arabe ?',                           options: ['قلم', 'كتاب', 'مدرسة', 'بيت'],                                        answer: 'كتاب' },
    { difficulty: 2, question: 'Quel mot arabe signifie « école » ?',                           options: ['سيارة', 'شجرة', 'مدرسة', 'قمر'],                                      answer: 'مدرسة' },
    { difficulty: 2, question: 'Comment dit-on « eau » en arabe ?',                             options: ['ماء', 'نار', 'هواء', 'شمس'],                                          answer: 'ماء' },
    { difficulty: 2, question: 'Quel mot arabe signifie « maison » ?',                          options: ['باب', 'بيت', 'قلم', 'ولد'],                                           answer: 'بيت' },
    { difficulty: 3, question: 'Combien de lettres contient l’alphabet arabe ?',                options: ['26', '27', '28', '29'],                                              answer: '28' },
    { difficulty: 3, question: 'Quel mot arabe signifie « lune » ?',                            options: ['شمس', 'نجمة', 'قمر', 'سماء'],                                         answer: 'قمر' },
    { difficulty: 3, question: 'Comment dit-on « stylo » en arabe ?',                           options: ['قلم', 'كتاب', 'كرسي', 'ولد'],                                         answer: 'قلم' },
    { difficulty: 3, question: 'Quel mot arabe signifie « soleil » ?',                          options: ['قمر', 'شمس', 'أرض', 'ليل'],                                           answer: 'شمس' },
    { difficulty: 3, question: 'Comment dit-on « au revoir » en arabe ?',                       options: ['سلام', 'مرحبا', 'مع السلامة', 'شكرا'],                                answer: 'مع السلامة' }
  ]
};

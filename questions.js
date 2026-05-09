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
    { difficulty: 1, question: 'Quel animal dit « ouaf » ?',                                   options: ['Chat', 'Chien', 'Vache', 'Canard'],                                  answer: 'Chien' },
    { difficulty: 1, question: 'Quel animal aime le miel ?',                                    options: ['Ours', 'Lion', 'Lapin', 'Cheval'],                                   answer: 'Ours' },
    { difficulty: 1, question: 'Quel animal a un très long cou ?',                              options: ['Éléphant', 'Girafe', 'Tigre', 'Singe'],                              answer: 'Girafe' },
    { difficulty: 1, question: 'Quel animal vit dans l’eau ?',                                  options: ['Poisson', 'Chat', 'Cheval', 'Poule'],                                answer: 'Poisson' },
    { difficulty: 1, question: 'Quel animal est le roi de la jungle ?',                         options: ['Lion', 'Lapin', 'Zèbre', 'Panda'],                                   answer: 'Lion' },
    { difficulty: 2, question: 'Quel animal porte sa maison sur son dos ?',                     options: ['Escargot', 'Fourmi', 'Oiseau', 'Tigre'],                             answer: 'Escargot' },
    { difficulty: 2, question: 'Quel animal saute très haut et vit en Australie ?',             options: ['Kangourou', 'Loup', 'Panda', 'Renard'],                              answer: 'Kangourou' },
    { difficulty: 2, question: 'Quel animal noir et blanc ressemble à un cheval ?',             options: ['Zèbre', 'Âne', 'Cerf', 'Chameau'],                                   answer: 'Zèbre' },
    { difficulty: 2, question: 'Quel animal fabrique du miel ?',                                options: ['Abeille', 'Papillon', 'Mouche', 'Araignée'],                         answer: 'Abeille' },
    { difficulty: 2, question: 'Quel animal est célèbre pour sa mémoire ?',                     options: ['Éléphant', 'Souris', 'Lapin', 'Chat'],                               answer: 'Éléphant' },
    { difficulty: 3, question: 'Quel est le plus rapide des animaux terrestres ?',              options: ['Guépard', 'Lion', 'Cheval', 'Loup'],                                 answer: 'Guépard' },
    { difficulty: 3, question: 'Quel mammifère peut voler ?',                                   options: ['Chauve-souris', 'Aigle', 'Papillon', 'Pigeon'],                      answer: 'Chauve-souris' },
    { difficulty: 3, question: 'Quel animal change de couleur pour se cacher ?',                options: ['Caméléon', 'Crocodile', 'Panda', 'Dauphin'],                         answer: 'Caméléon' },
    { difficulty: 3, question: 'Quel animal vit au pôle Nord ?',                                options: ['Ours polaire', 'Kangourou', 'Tigre', 'Girafe'],                      answer: 'Ours polaire' },
    { difficulty: 3, question: 'Quel animal possède huit bras ?',                               options: ['Pieuvre', 'Crabe', 'Étoile de mer', 'Méduse'],                       answer: 'Pieuvre' }
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

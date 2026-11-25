# NOXCUSE — stratégie de contenu (TikTok, Reels, Shorts)

## Ce qui marche pour les apps (recherche, nov. 2026)
- **Les 3 premières secondes décident de tout** : l'algorithme regarde si on reste. Le texte d'accroche est à l'écran dès la première image, et il crée une tension tout de suite (« Quand t'as skip la salle de sport… »).
- **Authentique et en volume plutôt que léché** : les apps qui percent testent beaucoup de vidéos simples (POV, diaporamas, face caméra) et gardent celles qui marchent.
- **Le format POV et l'humour du quotidien** : tout le monde a déjà séché la salle. On montre la conséquence drôle, pas une pub.
- **Les vues ne sont pas des téléchargements** : chaque vidéo finit par une action claire (« Crée ta team ») et le lien est dans la bio.

## Vidéo 1 — « POV : t'as skip la salle » (`noxcuse-pov-skip.mp4`, 19,5 s, 1080 × 1920)
1. 0–2 s : « Quand t'as skip la salle de sport… » + la notif « SKIP. Alex a choisi le canap'. » qui fait vibrer le téléphone.
2. 2–5 s : « …et que toute ta team le sait. » Les messages des potes s'empilent.
3. 5–9 s : la carte SKIP tombe comme un tampon, le Canap' sourit (sans bruit).
4. 9–13 s : « La semaine d'après : » la barre se charge, 200 kg.
5. 13–16 s : « PR DE LA TEAM. » Le Canap' est écrasé.
6. 16–19 s : « NO / XCUSE. » « Tes potes comptent sur toi. Le Canap' aussi. » « Crée ta team · App Store ».

**Son** : bruitages seulement (tintement de notif façon téléphone + vibration, tampons, clang des disques ; pas de rire du Canap'), pas de musique. Le tintement est un son original : le vrai son de l'iPhone appartient à Apple. Pour le vrai son de l'iPhone : prends `noxcuse-pov-skip-sans-notifs.mp4` (vibrations gardées, tintements retirés) et pose le son « iPhone notification » de la bibliothèque TikTok / CapCut à 0,35 s, 2,9 s, 3,5 s, 4,1 s et 17,3 s. Sons refaits par `python3 scripts/mix_sfx.py audio` (depuis `scripts/`). Légende proposée :
> Ta team voit tout 👀 Le Canap' aussi. #muscu #salledesport #gymtok #motivation #potes

## Vidéo 2 — « Comment ça marche » (`noxcuse-comment-ca-marche.mp4`, 27 s, 1080 × 1920)
But : qu'on comprenne l'app en une vidéo et qu'on ait envie de la télécharger. Même règle : bruitages seulement.
1. 0–3 s : « Ce mois-ci, t'avais prévu 4 séances de muscu. » puis « T'EN AS FAIT 1. » en tampon (1 case cochée, 3 croix). Tout le monde se reconnaît.
2. 3–6 s : « Seul, tu lâches. » (une silhouette grise) → « Avec tes potes, tu y vas. » (Toi en orange, Alex, Sam, Lou apparaissent).
3. 6–10 s : ÉTAPE 1 « Crée ta team. » 2 à 4 potes, chacun son objectif (3 / sem., 4 / sem.…).
4. 10–15 s : ÉTAPE 2 « Va à la salle. » Carte sombre, point de la salle qui pulse, chrono qui file jusqu'à 45:00, « +20 KG » et « Séance validée » + notif. « L'app le voit toute seule. Ta team voit « venu », jamais où t'es. »
5. 15–19 s : ÉTAPE 3 « Charge la barre. » Les disques se chargent (clang), 100 kg, notif « Sam vient de charger 20 kg 💪 ».
6. 19–22 s : « Et si tu skip ? » La carte SKIP tombe, le Canap' croque ses chips (bruit de chips). « Toute ta team reçoit ta carte. Dimanche, 20 h. »
7. 22–27 s : « NO / XCUSE. » « La muscu entre potes. Sans excuse. » « Un pote paie, toute la team joue. » « Télécharge · App Store ».

Légende proposée :
> Tu vas plus à la salle quand tes potes comptent sur toi. Crée ta team, charge la barre, et évite la carte SKIP 🛋️ Lien en bio. #muscu #salledesport #gymtok #motivation #potes

Sources : `video-explainer/index.html`, sons `python3 scripts/mix_explainer.py audio` (depuis `scripts/`).

## Vidéo 4 — « Zéro excuse » (`noxcuse-zero-excuse.mp4`, 28,5 s, la plus dynamique)
Rythme rapide (une idée toutes les 2-3 s), transitions balayées avec « whoosh », coups de caméra sur chaque tampon, bruitages seulement.
1. 0–3,8 s : « Tes excuses : » « IL PLEUT. » « J'SUIS CREVÉ·E. » « DEMAIN, PROMIS. » barrées en orange une à une, puis « NO / XCUSE. » en tampon sur fond orange.
2. 3,8–6 s : « TA TEAM. TON OBJECTIF. ZÉRO EXCUSE. » + Toi, Alex, Sam, Lou.
3. 6–9,6 s : ÉTAPE 1 « Crée ta team. » Le code d'invitation s'écrit, les potes rejoignent.
4. 9,6–13,4 s : ÉTAPE 2 « Va à la salle. » Ton avatar entre dans la zone, le chrono s'emballe jusqu'à 45:00, « Séance validée · +20 kg » + notif.
5. 13,4–16,6 s : ÉTAPE 3 « Charge la barre. » 4 disques (clang), 160 kg, notif « Sam vient de charger 20 kg 💪 ».
6. 16,6–19 s : « Ton pote traîne ? » Un doigt touche SPOT, notif « Sam te spot : bouge à la salle ! ».
7. 19–22,2 s : « Et si tu skip ? » La carte SKIP tombe, le Canap' croque ses chips.
8. 22,2–24,4 s : « Tout le monde a tenu ? » « PR DE LA TEAM. » Le Canap' est écrasé.
9. 24,4–28,5 s : « NO / XCUSE. » « La muscu entre potes. » « Un pote paie, toute la team joue. » « Télécharge · App Store ».

Légende proposée :
> Il pleut. T'es crevé·e. Demain promis… Ta team n'y croit pas 😏 Crée ta team, charge la barre, évite la carte SKIP. Lien en bio. #muscu #salledesport #gymtok #motivation #potes

Sources : `video-fun/index.html`, sons `python3 scripts/mix_fun.py audio` (depuis `scripts/`).

## Vidéo 5 — « Le concept » (`noxcuse-le-concept.mp4`, 55 s, le concept en détail)
Même style que « Zéro excuse » (transitions balayées, tampons, bruitages seulement), ralentie de 1,3× pour laisser le temps de lire (repères ci-dessous avant ralentissement), et tout le jeu y passe :
1. 0–3,4 s : « Lundi, je reprends. » « Combien de fois t'as dit ça ? » Le compteur file jusqu'à « 47 fois », puis « NO / XCUSE. ».
2. 3,4–6 s : LE CONCEPT : « Tes potes. Une barre. Un canap' qui te guette. » (le Canap' apparaît).
3. 1 · La team : code d'invitation, 2 à 4 potes qui rejoignent.
4. 2 · L'objectif : choix 2 / 3 / 4 / 5 séances par semaine, chacun le sien.
5. 3 · La salle : 40 min sur place = séance validée toute seule ; « Ta team voit « venu ». Jamais où t'es. »
6. 4 · La barre : 1 séance = 1 disque, la barre commune se charge, notif.
7. 5 · Le chat : « on y va ce soir ? », « 18 h, je suis chaud 🔥 », « le Canap' me regarde 👀 ».
8. 6 · La pression : la barre tremble (« plus que 2 jours pour 2 séances »), un doigt spotte Alex.
9. Dimanche 20 h : la carte SKIP tombe, le Canap' croque ses chips, « tu peux même la partager ».
10. Joker blessure : 1 par mois, pas de carte, série gardée.
11. PR de la team : le Canap' écrasé.
12. Progression : série de semaines, niveau perso (Machine), Ceinture du mois.
13. Fin : « NO / XCUSE. », « La muscu entre potes. », « Un pote paie, toute la team joue. », « Télécharge · App Store ».

Légende proposée :
> Le concept en 40 secondes 👇 Ta team, ton objectif, une barre à charger ensemble… et une carte SKIP pour celui qui sèche. Lien en bio. #muscu #salledesport #gymtok #motivation #potes

Sources : `video-concept/index.html`, sons `python3 scripts/mix_concept.py audio` (depuis `scripts/`).

## Vidéo 7 — « Quand ton canap' t'écrit comme ton ex 😭 » (`noxcuse-canap-ex.mp4`, 27,5 s, format TikTok)
La mascotte qui parle comme une personne (format qui marche très bien sur TikTok). Bruitages seulement.
1. Accroche : « Quand ton canap' t'écrit comme ton ex 😭 ».
2. Conversation avec « Le Canap' 🛋️ » (en ligne) : « t'es où ? 🥺 », « on était bien hier soir… toi, moi, une série », toi : « je vais à la salle », « la salle elle te connaît même pas », « j'ai gardé ta place chaude 🔥 », notif « Sam te spot : bouge à la salle ! », toi : « désolé, ma team m'attend », « c'est qui cette « team » ?? 😤 ».
3. « Pendant ce temps, à la salle : » la barre se charge, « Séance validée · +20 kg pour la team 💪 ».
4. « t'as changé… 💔 », le Canap' écrasé, « Le Canap' ne s'en remet pas. »
5. « Quitte ton canap'. Pas ta team. », NO / XCUSE., « Dispo sur l'App Store ».

Description (4 hashtags) :
> Il a pas supporté la rupture 💔😭 Tag le pote qui est encore en couple avec son canap'. NOXCUSE, dispo sur l'App Store (lien en bio).
> #muscu #gymtok #salledesport #noxcuse

Sources : `video-ex/index.html`, sons `python3 scripts/mix_ex.py audio` (depuis `scripts/`).

## Vidéo 6 — « Les 4 potes qu'on a TOUS dans sa team » (`noxcuse-les-4-potes.mp4`, 28 s, format TikTok)
Format liste à commenter (« Et toi, t'es lequel ? »), textes façon TikTok (bulles blanches), zones de l'interface TikTok laissées libres (bas et droite), bruitages seulement.
1. Le motivé 🔥 : notif « Sam vient de charger 20 kg » à 6 h 12, la barre se charge, « 3/3 dès mercredi ».
2. Le « demain promis » : 3 messages « demain promis » dans le chat, un doigt le spotte, notif « Sam te spot ».
3. Le roi de l'excuse : « Il pleut », « Mal au dos », « C'est la Toussaint » barrés, la carte SKIP tombe, le Canap' croque.
4. Celui qui paie pour toute la team 👑 : « Offert par Toi » pour les 3 potes, « 1 abonnement = toute la team (jusqu'à 4) ».
5. « Et toi, t'es lequel ? 👇 », NO / XCUSE., « Dispo sur l'App Store ».

Description (4 hashtags) :
> T'es lequel ? 👇 Tag ta team 😂 NOXCUSE, l'app pour aller à la salle entre potes. Dispo sur l'App Store, lien en bio.
> #muscu #gymtok #salledesport #noxcuse

Sources : `video-tiktok/index.html`, sons `python3 scripts/mix_tiktok.py audio` (depuis `scripts/`).

## Vidéo 3 — avec de vraies personnes (kit à monter dans CapCut, dossier `kit/`)
Je ne peux ni filmer ni fabriquer de vraies personnes : tu tournes 4 plans avec tes potes (téléphone en vertical, 2 à 4 s chacun), et le kit fournit tout le reste, avec les sons.
- `0-maquette-du-montage.mp4` : le montage complet avec des cases « ta vidéo filmée ici » pour voir le rythme (21 s).
- `1-accroche-fond-vert.mp4`, `2-notif-fond-vert.mp4`, `3-messages-fond-vert.mp4`, `5-plus20-fond-vert.mp4` : à poser **par-dessus** tes plans. CapCut : Superposition → Incrustation (chroma key) → pipette sur le vert.
- `4-carte.mp4`, `6-fin.mp4` : plein écran, entre tes plans.

| # | Ce que tu filmes | Ce que tu poses dessus |
|---|---|---|
| 1 | Toi affalé sur le canap', téléphone en main, un paquet de chips (dimanche soir, lumière tamisée). | « DIMANCHE, 19 H 58. / IL ME MANQUE 1 SÉANCE. » |
| 2 | Gros plan sur ta tête quand le téléphone vibre : tu lis, tu te décomposes. | La notif « SKIP. Alex a choisi le canap'. » (vibration + tintement). Pour le vrai son iPhone, mets le son « iPhone notification » de la bibliothèque CapCut à la place. |
| 3 | Tes potes (chez eux ou ensemble) qui éclatent de rire en regardant leur téléphone. | Les messages « la carte est sortie 😭 », « t'étais où ??? », « le Canap' te remercie 🛋️ ». |
| 4 | — | La carte SKIP plein écran (tampons + chips croquées). |
| 5 | Le lendemain : toi qui pousses la porte de la salle, puis qui charges une barre, déterminé. | « LUNDI, 7 H. », la barre qui se charge, « +20 KG. ». |
| 6 | — | La fin : « NO / XCUSE. », « Ton abo inclut ta team. », « Lien dans la bio ↑ ». |

Conseils de tournage : visages et réactions exagérés, pas de musique de fond pendant le tournage (les bruitages du kit suffisent), chacun d'accord pour être filmé et publié. Le prénom sur la notif et la carte est « Alex » : donne-moi un autre pseudo et je régénère le kit.

Légende proposée :
> Dimanche 19 h 58, il me manquait 1 séance. Mes potes ont reçu ça 💀 #muscu #salledesport #gymtok #potes

Sources : `video-kit/index.html` (une page, `#accroche`, `#notif`…), sons `python3 scripts/mix_kit.py audio` (depuis `scripts/`).

## Le son des notifs (recherche, nov. 2026)
- Le son que tout le monde reconnaît : **Tri-tone**, créé en 1999 par Kelly Jacklin pour SoundJam MP (« 158-marimba »). C'est un **marimba**, 3 notes enchaînées vite : la note de base, la quinte, l'octave.
- Depuis iOS 17, le son par défaut des notifs d'apps est **Rebound** : 2 notes plus douces avec un peu d'écho. Beaucoup l'ont trouvé trop discret, et iOS 17.2 permet de remettre Tri-tone (Réglages → Sons et vibrations → Alertes par défaut). Les vraies notifs NOXCUSE jouent donc Rebound sur la plupart des iPhone récents.
- Les vidéos utilisent maintenant un son **dans l'esprit de Tri-tone** (marimba, 3 notes rapides montantes, petit écho), synthétisé par nos soins (`audio/notif.wav`, `kit/son-notif.m4a`). Ce n'est pas le fichier d'Apple, qui n'est pas libre de droits. Pour le vrai, prends `noxcuse-pov-skip-sans-notifs.mp4` et le son « iPhone notification » de la bibliothèque CapCut / TikTok.

Sources : 9to5mac.com (iOS 17, Rebound), digitaltrends.com (iOS 17.2), engadget.com et fastcompany.com (histoire de Tri-tone).

## 10 accroches à tourner ensuite (une par jour, mêmes éléments de l'app)
1. « POV : ton pote a 0 séance et c'est dimanche 19 h 58. »
2. « Le message que ta team reçoit quand tu sèches. » (la carte SKIP en gros plan)
3. « J'ai mis mes potes au défi : celui qui skip prend la carte. » (face caméra)
4. « Le Canap' réagit à ta semaine. » (les 5 humeurs du Canap')
5. « 3 excuses que le Canap' ne valide pas. » (diaporama)
6. « Ton pote te spot à 18 h : » (la notif « Sam te spot : bouge à la salle ! »)
7. « La barre qui tremble, c'est quand il te reste 2 jours pour 2 séances. »
8. « Classement des cartes SKIP les plus humiliantes. » (les cartes premium)
9. « Duo : 12 semaines sans skip. Voilà notre série. »
10. « Avant / après : ma régularité sans team vs avec team. »

## Rythme et mesures
- 1 vidéo par jour pendant 3 semaines, sur TikTok, Reels et Shorts (même fichier).
- Garder ce qui dépasse la médiane de rétention à 3 s, refaire des variantes de l'accroche gagnante.
- Mesurer installations et invitations acceptées, pas seulement les vues (PostHog à brancher).
- Faire tourner les potes : une vidéo par semaine où un vrai pote reçoit sa carte SKIP (réaction filmée).

Sources : superscale.ai (UGC TikTok 2026), viral.app (accroches TikTok vs Instagram), stormy.ai (playbook Coconote), miracamp.com (contenu fitness viral).

## Vidéo 8 — « Top 5 des excuses pour skip la salle de sport » (`noxcuse-top-excuses.mp4`, 26,6 s, format TikTok)

1. Accroche : « Top 5 des excuses pour skip la salle de sport 🙄 (ta team les connaît toutes) ».
2. #5 « Il pleut. » → Sam : « La salle a un toit. » → tampon REFUSÉ.
3. #4 « Je commence lundi. » → Alex : « T'as dit ça lundi dernier. » → REFUSÉ.
4. #3 « J'ai pas mes affaires. » → Lou : « Ton sac est dans ta voiture depuis mars. » → REFUSÉ.
5. #2 « J'ai trop de taf. » → Sam : « 40 min. Ton boss survivra. » → REFUSÉ.
6. #1 « Le Canap' me retient 🛋️ » → l'affiche SK / IP tombe, notif « SKIP. Toi, tu as choisi le canap'. », « Et toute ta team reçoit la carte. »
7. Fin : « Ta team refuse tes excuses. Le Canap' les adore. » NO XCUSE. Dispo sur l'App Store.

Légende : « Laquelle t'as déjà sortie ? 👇 Avec NOXCUSE, ta team les refuse toutes. » Hashtags : #salledesport #motivation #gymtok #muscu
Format pensé pour les commentaires (« laquelle t'as déjà sortie ») : épingle la meilleure réponse.
Sources : `video-excuses/index.html`, sons `python3 scripts/mix_excuses.py audio` (depuis `scripts/`).

## Vidéo 9 — « Dimanche 17 h. Il te manque 1 séance 😰 » (`noxcuse-dimanche-17h.mp4`, 28,4 s, format TikTok)

Format suspense, contre la montre :
1. « DIMANCHE 17:00 », « Il te manque 1 séance 😰 », 2 disques sur 3, « Deadline : 20 h. Sinon, carte SKIP. »
2. L'horloge file, les notifs tombent : rappel du Canap', « Sam te spot », « Lou te spot ». « Ta team te lâche pas. »
3. Le Canap' : « juste un épisode… » → Rester (tampon NON) / Y aller. « Sac. Clés. Salle. »
4. À la salle : le chrono file jusqu'à 40:00, séance validée, le 3e disque s'allume.
5. « DIMANCHE 20:00 » : « SKIP. Alex a choisi le canap'. » « Cette fois, c'est pas toi 😮‍💨 »
6. Fin : « Chaque dimanche à 20 h, quelqu'un prend la carte. » NO XCUSE. Dispo sur l'App Store.

Légende : « Dimanche 17 h, il te manque une séance. Tu fais quoi ? 👇 » Hashtags : #salledesport #motivation #gymtok #muscu
Sources : `video-dimanche/index.html`, sons `python3 scripts/mix_dimanche.py audio` (depuis `scripts/`).

## Vidéo 10 — « Seul vs en team » (`noxcuse-seul-vs-team.mp4`, 27 s, format TikTok)

Écran partagé, jour par jour :
1. « La même semaine. La même salle. Seul vs en team ».
2. Deux colonnes. SEUL : LUN séance, puis « Flemme. », « Demain. », « Il pleut. », « Afterwork », « Le canap'. », « Lundi je reprends » → 1/3, carte SKIP. EN TEAM : séance, « Sam te spot », séance, repos, séance, « Avec Alex », « Bilan : PR » → 4/3, +80 kg.
3. « La motivation, ça lâche. Tes potes, non. » Le Canap' écrasé par la barre. « Le Canap' préfère quand t'es seul. »
4. Fin : « Monte ta team. Charge la barre. » NO XCUSE. Dispo sur l'App Store.

Légende : « T'es quelle colonne ? 👈👉 Tague le pote qui te fait aller à la salle. » Hashtags : #salledesport #motivation #gymtok #muscu
Sources : `video-seul/index.html`, sons `python3 scripts/mix_seul.py audio` (depuis `scripts/`).

## Vidéo 11 — « Rush » (`noxcuse-rush.mp4`, 17 s, format TikTok, très rythmée)

Montage nerveux : un plan par temps (0,42 s, ~143 bpm), zoom + secousse + flash à chaque coupe, fonds noir / orange / papier qui alternent. Le rythme est fait uniquement de bruitages (tic, coups, clap, clang de disque, notifs), sans musique.
T'AS / SKIP / LA SALLE DE SPORT ? → le Canap' « te remercie » → TA / TEAM / VOIT / TOUT. → notif SKIP → STOP. → 2, 3, 4 POTES → 1 BARRE → 20, 40, 60, 80 KG (un clang par disque) → « Sam te spot » → GO. → 40:00 séance validée → +20 KG. → PR DE LA TEAM 🏆 → Canap' écrasé → ZÉRO / EXCUSE. → NO XCUSE. Dispo sur l'App Store.

Légende : « 17 secondes pour plus jamais skip. Envoie-la à ton binôme 👀 » Hashtags : #salledesport #motivation #gymtok #muscu
Sources : `video-rush/index.html`, sons : `audio/rush-shots.json` (temps des plans, à régénérer si on change le montage) puis `python3 scripts/mix_rush.py audio` (depuis `scripts/`).

## Vidéo 12 — « Lien dans la bio » (`noxcuse-lien-bio.mp4`, 16,8 s, format TikTok, appel à l'action)

Faite pour transformer les vues en téléchargements (23/11 : 19 impressions, 4 vues de page, 1 téléchargement).
TES POTES DISENT QU'ILS VONT À LA SALLE DE SPORT. → VRAIMENT ? → la liste de la team (Fait / À la salle / Pas encore) « Maintenant, tu vérifies 👀 » → notif « Lou risque le skip » → SKIP. → le Canap' « Toute la team reçoit la carte » → 1 ABO. / 4 POTES. / TES POTES JOUENT GRATOS. → recherche « NOXCUSE » dans l'App Store → LIEN DANS LA BIO ↑ NOXCUSE.

Légende : « Lien dans la bio 🔗 Un abo, ta team joue avec toi. » Hashtags : #salledesport #motivation #gymtok #muscu
Avant de publier : compte TikTok passé en « Compte professionnel » et lien App Store dans la bio ; commentaire épinglé « NOXCUSE sur l'App Store, lien en bio 🔗 ».
Sources : `video-bio/index.html`, sons : `audio/bio-shots.json` puis `python3 scripts/mix_bio.py audio` (depuis `scripts/`).

## Vidéo 13 — « Tuto en 5 étapes » (`noxcuse-tuto-5-etapes.mp4`, 20,5 s, format TikTok, appel à l'action)

COMMENT ON VA À LA SALLE DE SPORT À 4 SANS JAMAIS SKIP → 1 Choisis ta salle → 2 Ton objectif (3 / sem.) → 3 Invite tes potes (code + partage, « ton abo les couvre, jusqu'à 4 ») → 4 Va à la salle, l'app valide toute seule (carte + notif) → 5 Dimanche 20 h, qui a skip prend la carte → C'EST TOUT. → LIEN DANS LA BIO ↑ NOXCUSE.

Légende : « 5 étapes et ta team ne skip plus jamais. Lien dans la bio 🔗 » Hashtags : #salledesport #motivation #gymtok #muscu
Sources : `video-tuto/index.html`, sons : `audio/tuto-shots.json` puis `python3 scripts/mix_tuto.py audio` (depuis `scripts/`).

## Vidéo 14 — version IA réaliste (`video-ia/`)

Le kit « vraies personnes » avec des plans générés par IA (Kling ou Gemini / Veo) à la place des plans filmés : `video-ia/GUIDE-VIDEO-IA.md` (prompts des personnages et des 5 plans, montage CapCut, étiquette IA, descriptions TikTok / Insta) et `video-ia/noxcuse-kit-video-ia.zip` (guide + 6 clips + son). La fin du kit (`kit/6-fin.mp4`) dit maintenant « Ton abo inclut ta team. » et « Lien dans la bio ↑ », hors de la zone couverte par TikTok.
Montage (`video-ia/noxcuse-skip-ia.mp4`, 20,5 s) avec 4 plans Kling, habillage transparent `video-ia/edit/index.html` (orange de la charte #FF6A3D) assemblé par `scripts/edit_ia.sh` (zoom lent sur chaque plan, zoom sec à la notif, sons `scripts/mix_ia.py`). Les plans Kling sont en HDR (HLG, BT.2020) : sans conversion, l'iPhone lit tout le montage en HDR et l'orange vire au rouge ; le script les relit en SDR et sort une vidéo BT.709 étiquetée. Plan canapé coupé avant le sourire.

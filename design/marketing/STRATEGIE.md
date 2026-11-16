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
| 6 | — | La fin : « NO / XCUSE. », « Un pote paie, toute la team joue. », « Télécharge · App Store ». |

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

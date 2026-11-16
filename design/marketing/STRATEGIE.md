# NOXCUSE — stratégie de contenu (TikTok, Reels, Shorts)

## Ce qui marche pour les apps (recherche, nov. 2026)
- **Les 3 premières secondes décident de tout** : l'algorithme regarde si on reste. Le texte d'accroche est à l'écran dès la première image, et il crée une tension tout de suite (« Quand t'as skip la salle de sport… »).
- **Authentique et en volume plutôt que léché** : les apps qui percent testent beaucoup de vidéos simples (POV, diaporamas, face caméra) et gardent celles qui marchent.
- **Le format POV et l'humour du quotidien** : tout le monde a déjà séché la salle. On montre la conséquence drôle, pas une pub.
- **Les vues ne sont pas des téléchargements** : chaque vidéo finit par une action claire (« Crée ta team ») et le lien est dans la bio.

## Vidéo 1 — « POV : t'as skip la salle » (`noxcuse-pov-skip.mp4`, 19,5 s, 1080 × 1920)
1. 0–2 s : « Quand t'as skip la salle de sport… » + la notif « SKIP. Alex a choisi le canap'. » qui fait vibrer le téléphone.
2. 2–5 s : « …et que toute ta team le sait. » Les messages des potes s'empilent.
3. 5–9 s : la carte SKIP tombe comme un tampon, le Canap' ricane.
4. 9–13 s : « La semaine d'après : » la barre se charge, 200 kg.
5. 13–16 s : « PR DE LA TEAM. » Le Canap' est écrasé.
6. 16–19 s : « NO / XCUSE. » « Tes potes comptent sur toi. Le Canap' aussi. » « Crée ta team · App Store ».

**Son** : bruitages seulement (tintement de notif façon téléphone + vibration, tampons, clang des disques, ricanement du Canap'), pas de musique. Le tintement est un son original : le vrai son de l'iPhone appartient à Apple. Dans TikTok / CapCut, tu peux le remplacer par un son de notif de leur bibliothèque. Sons refaits par `python3 scripts/mix_sfx.py audio` (depuis `scripts/`). Légende proposée :
> Ta team voit tout 👀 Le Canap' aussi. #muscu #salledesport #gymtok #motivation #potes

## Vidéo 2 — « Comment ça marche » (`noxcuse-comment-ca-marche.mp4`, 27 s, 1080 × 1920)
But : qu'on comprenne l'app en une vidéo et qu'on ait envie de la télécharger. Même règle : bruitages seulement.
1. 0–3 s : « Ce mois-ci, t'avais prévu 4 séances de muscu. » puis « T'EN AS FAIT 1. » en tampon (1 case cochée, 3 croix). Tout le monde se reconnaît.
2. 3–6 s : « Seul, tu lâches. » (une silhouette grise) → « Avec tes potes, tu y vas. » (Toi en orange, Alex, Sam, Lou apparaissent).
3. 6–10 s : ÉTAPE 1 « Crée ta team. » 2 à 4 potes, chacun son objectif (3 / sem., 4 / sem.…).
4. 10–15 s : ÉTAPE 2 « Va à la salle. » Carte sombre, point de la salle qui pulse, chrono qui file jusqu'à 45:00, « +20 KG » et « Séance validée » + notif. « L'app le voit toute seule. Ta team voit « venu », jamais où t'es. »
5. 15–19 s : ÉTAPE 3 « Charge la barre. » Les disques se chargent (clang), 100 kg, notif « Sam vient de charger 20 kg 💪 ».
6. 19–22 s : « Et si tu skip ? » La carte SKIP tombe, le Canap' ricane. « Toute ta team reçoit ta carte. Dimanche, 20 h. »
7. 22–27 s : « NO / XCUSE. » « La muscu entre potes. Sans excuse. » « Un pote paie, toute la team joue. » « Télécharge · App Store ».

Légende proposée :
> Tu vas plus à la salle quand tes potes comptent sur toi. Crée ta team, charge la barre, et évite la carte SKIP 🛋️ Lien en bio. #muscu #salledesport #gymtok #motivation #potes

Sources : `video-explainer/index.html`, sons `python3 scripts/mix_explainer.py audio` (depuis `scripts/`).

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

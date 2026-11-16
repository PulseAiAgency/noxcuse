"""Soundtrack of « Comment ça marche » (noxcuse-comment-ca-marche.mp4). Usage: python3 mix_explainer.py <audio_dir>"""
import sys

from sfx import Mix, pop, tick

m = Mix(27, sys.argv[1])
thud, clang = (m.file(n) for n in ("thud.wav", "plate-clang.wav"))
m.at(1.1, thud)                                  # « T'EN AS FAIT 1. » stamp
m.at(1.6, pop(700))                              # the one session done
for i in (1, 2, 3):                              # the three skipped ones
    m.at(1.6 + i * 0.25, tick())
m.at(3.5, pop(300), 0.6)                         # alone
for i, t in enumerate((4.9, 5.15, 5.4)):         # friends pop in
    m.at(t, pop(500 + i * 120))
for i in range(4):                               # team rows slide in
    m.at(7.2 + i * 0.35, pop(620 + i * 60), 0.6)
m.notif(13.0)                                    # session validated
for i in range(5):                               # plates loading
    m.at(15.0 + i * 0.4, clang, 0.8)
m.notif(17.2)                                    # « Sam vient de charger 20 kg »
m.at(18.9, thud); m.at(19.3, thud)               # SK / IP
m.at(22.3, thud); m.at(22.65, thud)              # NO / XCUSE
m.at(24.2, m.chime, 0.9)                         # CTA
m.write("sfx-explainer.wav")

"""Soundtrack of « Le concept » (noxcuse-le-concept.mp4), sound effects only. Usage: python3 mix_concept.py <audio_dir>"""
import sys

from sfx import Mix, click, munch, pop, tick, whoosh

m = Mix(42, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

m.at(0.1, thud, 0.8)                                  # « Lundi, je reprends. »
t, gap = 1.1, 0.12                                     # counter racing to 47
while t < 2.3:
    m.at(t, tick(), 0.5); t += gap; gap = max(0.03, gap * 0.85)
m.at(2.3, pop(900), 0.9)
m.at(2.6, thud, 1.1); m.at(2.85, thud, 1.1)            # NO / XCUSE.
for s in (3.4, 6.0, 9.0, 12.0, 16.4, 19.6, 22.4, 26.0, 29.6, 31.8, 34.4, 37.6):
    m.at(s - 0.04, whoosh(), 0.8)
for i, s in enumerate((3.45, 3.95, 4.45)):
    m.at(s, thud, 0.6 + 0.15 * i)
m.at(4.9, pop(380), 0.7)                               # the Canap' peeks in
for i in range(9):
    m.at(6.45 + i * 0.072, tick(), 0.6)                # invite code typed
for i in range(3):
    m.at(7.3 + i * 0.4, pop(700 + i * 80), 0.8)        # friends join
for i in range(4):
    m.at(9.3 + i * 0.1, pop(500 + i * 70), 0.6)        # goal chips
m.at(10.5, click()); m.at(10.52, pop(880), 0.8)        # tap on 3
t, gap = 13.3, 0.16                                    # chrono to 40:00
while t < 14.9:
    m.at(t, tick(), 0.45); t += gap; gap = max(0.035, gap * 0.88)
m.notif(15.0)                                          # session validated
for i in range(4):
    m.at(16.8 + i * 0.35, clang, 0.8)                  # plates
m.notif(18.5)                                          # « Sam vient de charger 20 kg »
for i, s in enumerate((20.0, 20.7, 21.4)):
    m.at(s, pop(820 + i * 90), 0.8)                    # chat bubbles
m.at(24.3, click()); m.notif(24.7)                     # spot
m.at(26.15, thud); m.at(26.45, thud)                   # SK / IP
munch(m, 26.9, bites=5, gap=0.3)                       # the Canap' munches its chips
m.at(29.9, thud, 0.9)                                  # joker card
m.at(32.35, thud); m.at(32.9, thud, 1.2); m.at(32.93, clap)   # PR, Canap' crushed
for i, s in enumerate((34.9, 35.3, 35.7)):
    m.at(s, pop(600 + i * 120), 0.8)                   # perks
m.at(37.7, thud); m.at(38.0, thud)                     # NO / XCUSE.
m.at(39.5, m.chime, 0.9)                               # CTA
m.write("sfx-concept.wav")

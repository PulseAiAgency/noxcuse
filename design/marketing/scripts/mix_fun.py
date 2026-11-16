"""Soundtrack of « Zéro excuse » (noxcuse-zero-excuse.mp4), sound effects only. Usage: python3 mix_fun.py <audio_dir>"""
import sys

from sfx import Mix, click, munch, pop, tick, whoosh

m = Mix(28.5, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

for s in (0.35, 0.95, 1.55):            # excuses slam in, then get crossed out
    m.at(s, pop(420), 0.8)
    m.at(s + 0.3, whoosh(0.18), 0.7)
m.at(2.55, thud, 1.1); m.at(2.8, thud, 1.1)   # NO / XCUSE.
for s in (3.8, 6.0, 9.6, 13.4, 16.6, 19.0, 22.2, 24.4):
    m.at(s - 0.04, whoosh(), 0.8)                 # scene swipes
for i, s in enumerate((3.85, 4.35, 4.85)):         # Ta team. Ton objectif. Zéro excuse.
    m.at(s, thud, 0.6 + 0.15 * i)
for i in range(4):                                 # the crew pops in
    m.at(5.15 + i * 0.12, pop(560 + i * 90), 0.6)
for i in range(9):                                 # invite code typed
    m.at(6.5 + i * 0.078, tick(), 0.6)
for i in range(3):                                 # friends join
    m.at(7.5 + i * 0.4, pop(700 + i * 80), 0.8)
t, gap = 11.0, 0.16                                # chrono racing to 45:00, ticks speeding up
while t < 12.5:
    m.at(t, tick(), 0.45)
    t += gap
    gap = max(0.035, gap * 0.88)
m.notif(12.6)                                      # session validated
for i in range(4):                                 # plates
    m.at(13.8 + i * 0.35, clang, 0.8)
m.notif(15.5)                                      # « Sam vient de charger 20 kg »
m.at(17.5, click(), 1.0)                           # tap on SPOT
m.notif(17.85)                                     # « Sam te spot »
m.at(19.15, thud); m.at(19.45, thud)               # SK / IP
munch(m, 19.9, bites=5, gap=0.3)                   # the Canap' munches its chips
m.at(22.8, thud)                                   # PR DE LA TEAM
m.at(23.35, thud, 1.2); m.at(23.38, clap)          # Canap' crushed
m.at(24.5, thud); m.at(24.8, thud)                 # NO / XCUSE.
m.at(26.3, m.chime, 0.9)                           # CTA
m.write("sfx-fun.wav")

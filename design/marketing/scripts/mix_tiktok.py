"""Soundtrack of « Les 4 potes » (noxcuse-les-4-potes.mp4), sound effects only. Usage: python3 mix_tiktok.py <audio_dir>"""
import sys

from sfx import Mix, click, munch, pop, whoosh

m = Mix(28, sys.argv[1])
thud, clang = m.file("thud.wav"), m.file("plate-clang.wav")

for i, s in enumerate((0.05, 0.5, 0.95)):           # hook lines pop in
    m.at(s, pop(520 + i * 90), 0.9)
for i in range(4):                                    # the crew
    m.at(1.4 + i * 0.15, pop(640 + i * 70), 0.6)
for s in (2.8, 7.6, 13.0, 18.4, 23.2):
    m.at(s - 0.04, whoosh(), 0.8)                     # scene swipes
m.notif(3.4)                                          # 1. le motivé: 6 h 12 notif
for i in range(3):
    m.at(4.4 + i * 0.35, clang, 0.8)                  # plates
m.at(5.7, pop(900), 0.8)
for i, s in enumerate((8.0, 8.7, 9.4)):               # 2. demain promis ×3
    m.at(s, pop(760 + i * 60), 0.8)
m.at(11.0, click())                                   # tap on SPOT
m.notif(11.4)                                         # « Sam te spot »
for s in (14.0, 14.55, 15.1):                         # 3. excuses slammed then struck
    m.at(s, thud, 0.6)
    m.at(s + 0.25, whoosh(0.18), 0.6)
m.at(15.9, thud); m.at(16.2, thud)                    # SK / IP
munch(m, 16.6, bites=5, gap=0.3)                      # the Canap' munches its chips
for i in range(4):                                    # 4. the team rows
    m.at(18.8 + i * 0.12, pop(600 + i * 60), 0.5)
for i in range(3):                                    # « Offert par Toi » ×3
    m.at(20.0 + i * 0.35, m.chime, 0.45)
m.at(21.3, pop(880), 0.8)
m.at(23.3, pop(500), 0.9)                             # « Et toi, t'es lequel ? »
m.at(24.0, thud); m.at(24.3, thud)                    # NO / XCUSE.
m.at(25.0, m.chime, 0.9)                              # App Store
m.write("sfx-tiktok.wav")

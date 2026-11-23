"""Soundtrack of « Le Canap' t'écrit comme ton ex » (noxcuse-canap-ex.mp4), sound effects only.
Usage: python3 mix_ex.py <audio_dir>"""
import sys

from sfx import Mix, pop, whoosh

m = Mix(27.5, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

for i, s in enumerate((0.05, 0.45, 0.85)):          # hook lines
    m.at(s, pop(520 + i * 90), 0.9)
m.at(1.2, pop(380), 0.7)                             # the Canap' pops up
for s in (2.5, 14.6, 19.0, 22.6):
    m.at(s - 0.04, whoosh(), 0.8)
received = (3.3, 4.6, 7.4, 8.8, 12.8)                # the Canap's messages (low pop)
sent = (6.1, 11.4)                                    # your answers (high pop)
for s in received:
    m.at(s, pop(420), 0.8)
for s in sent:
    m.at(s, pop(1100), 0.8)
m.notif(10.1)                                         # « Sam te spot »
for i in range(4):
    m.at(15.4 + i * 0.4, clang, 0.8)                  # plates
m.notif(17.4)                                         # session validated
m.at(19.3, pop(420), 0.8)                             # « t'as changé… »
m.at(20.05, thud, 1.2); m.at(20.08, clap)             # the Canap' crushed
m.at(22.7, pop(520), 0.8); m.at(23.0, pop(640), 0.8)
m.at(23.4, thud); m.at(23.7, thud)                    # NO / XCUSE.
m.at(24.4, m.chime, 0.9)                              # App Store
m.write("sfx-ex.wav")

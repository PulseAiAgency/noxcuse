"""Soundtrack of « Top 5 des excuses » (noxcuse-top-excuses.mp4), sound effects only.
Usage: python3 mix_excuses.py <audio_dir>"""
import sys

from sfx import Mix, pop, whoosh

T0, LEN = 2.8, 3.3
S6 = T0 + LEN * 4
S7 = S6 + 5.6
m = Mix(S7 + 5, sys.argv[1])
thud, clap = (m.file(n) for n in ("thud.wav", "chalk-clap.wav"))

for i, s in enumerate((0.05, 0.5, 0.95, 1.5)):        # hook lines
    m.at(s, pop(520 + i * 90), 0.9)
m.at(1.8, pop(380), 0.7)                               # the Canap' pops up
for i in range(4):                                     # each excuse
    a = T0 + i * LEN
    m.at(a - 0.04, whoosh(), 0.8)
    m.at(a + 0.1, thud, 0.7)                           # #5, #4…
    m.at(a + 0.55, pop(1100), 0.8)                     # your excuse
    m.at(a + 1.35, pop(420), 0.8)                      # the team's answer
    m.at(a + 2.25, thud, 1.1); m.at(a + 2.27, clap, 0.6)  # REFUSÉ stamp
m.at(S6 - 0.04, whoosh(), 0.8)
m.at(S6 + 0.1, thud, 0.8); m.at(S6 + 0.55, pop(1100), 0.8)
m.at(S6 + 1.6, thud); m.at(S6 + 1.9, thud)             # SK / IP
m.at(S6 + 2.3, pop(380), 0.7)
m.notif(S6 + 3.0)                                      # SKIP push
m.at(S7 - 0.04, whoosh(), 0.8)
m.at(S7 + 0.1, pop(520), 0.8); m.at(S7 + 0.4, pop(640), 0.8)
m.at(S7 + 0.75, thud); m.at(S7 + 1.05, thud)           # NO / XCUSE.
m.at(S7 + 1.7, m.chime, 0.9)                           # App Store
m.write("sfx-excuses.wav")

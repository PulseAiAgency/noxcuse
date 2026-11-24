"""Soundtrack of « Seul vs en team » (noxcuse-seul-vs-team.mp4), sound effects only.
Usage: python3 mix_seul.py <audio_dir>"""
import sys

from sfx import Mix, pop, whoosh

D0, STEP = 3.6, 1.55
S2 = D0 + STEP * 7 + 2.6
S3 = S2 + 4.6
RES = D0 + STEP * 7 + 0.2
OK_TEAM = (0, 2, 4, 5)
SPOT = 1
m = Mix(S3 + 5, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

m.at(0.05, pop(520), 0.8); m.at(0.5, pop(640), 0.8); m.at(1.0, thud)
m.at(1.5, pop(380), 0.7)
for s in (2.8, S2, S3):
    m.at(s - 0.04, whoosh(), 0.8)
for i in range(7):
    a = D0 + i * STEP
    m.at(a, pop(700 if i == 0 else 360), 0.6)          # alone: dull
    if i in OK_TEAM:
        m.at(a + 0.45, clang, 0.7)                     # with the team: a plate
    elif i == SPOT:
        m.notif(a + 0.45, 0.8)
    else:
        m.at(a + 0.45, pop(820), 0.6)
m.at(RES, pop(300), 0.9); m.at(RES + 0.4, thud); m.at(RES + 0.42, clap, 0.6)
m.at(S2 + 0.15, pop(520), 0.8); m.at(S2 + 0.6, pop(640), 0.8)
m.at(S2 + 1.3, thud, 1.2); m.at(S2 + 1.33, clap)       # the Canap' crushed
m.at(S2 + 2.2, pop(520), 0.8)
m.at(S3 + 0.1, pop(520), 0.8); m.at(S3 + 0.4, pop(640), 0.8)
m.at(S3 + 0.75, thud); m.at(S3 + 1.05, thud)
m.at(S3 + 1.7, m.chime, 0.9)
m.write("sfx-seul.wav")

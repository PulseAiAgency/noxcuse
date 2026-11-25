"""Soundtrack of the AI-shot edit (video-ia/noxcuse-skip-ia.mp4), sound effects only.
Cuts: canape 0, potes 4.1, carte 7.9, porte 11.5, barre 13.7, fin 16.5, end 20.5.
Usage: python3 mix_ia.py <audio_dir>"""
import sys

from sfx import Mix, munch, pop, whoosh

A, B, C, D, E, F = 0.0, 4.1, 7.9, 11.5, 13.7, 16.5
m = Mix(20.5, sys.argv[1])
thud, clang = m.file("thud.wav"), m.file("plate-clang.wav")

m.at(A + 0.1, pop(480), 0.7); m.at(A + 0.5, pop(620), 0.7)   # hook
m.notif(A + 1.9)                                              # SKIP notification
for s in (B, C, D, E, F):
    m.at(s - 0.08, whoosh(0.22), 0.7)
m.at(B + 0.05, pop(520), 0.6)
for i, t in enumerate((0.45, 1.15, 1.85)):                    # group messages
    m.at(B + t, pop(880 + i * 90), 0.8)
m.at(C + 0.1, thud); m.at(C + 0.45, thud)                     # SK / IP
munch(m, C + 1.2, bites=5)
m.at(D + 0.1, pop(520), 0.7); m.at(D + 0.8, pop(640), 0.7)
m.notif(E + 0.3)                                              # session validated
m.at(E + 1.1, clang, 0.9); m.at(E + 1.12, thud, 0.8)          # +20 KG.
m.at(F + 0.1, thud); m.at(F + 0.45, thud); m.at(F + 1.7, m.chime, 0.9)
m.write("sfx-ia.wav")

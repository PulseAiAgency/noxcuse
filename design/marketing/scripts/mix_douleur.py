"""Soundtrack of « 21 h, t'avais prévu la salle » (noxcuse-21h.mp4), sound effects only.
Cuts: soir 0, douleur 3.2, bascule 9.2, porte 12.2, barre 14.6, fin 17.4, end 20.8.
Usage: python3 mix_douleur.py <audio_dir>"""
import sys

from sfx import Mix, pop, tick, whoosh

A, B, C, D, E, F = 0.0, 3.2, 9.2, 12.2, 14.6, 17.4
m = Mix(20.8, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

for k in range(6):                                     # the clock ticks on the couch
    m.at(A + 0.2 + k * 0.5, tick(), 0.35)
m.at(A + 0.15, pop(420), 0.6); m.at(A + 1.0, pop(520), 0.6)
for s in (B, C, D, E, F):
    m.at(s - 0.08, whoosh(0.22), 0.6)
for t in (0.05, 1.45, 2.85):                           # each painful line lands
    m.at(B + t, thud, 0.55)
for i, t in enumerate((4.3, 4.85, 5.4)):               # « Lundi je reprends. » x3, fading
    m.at(B + t, pop(380 - i * 40), 0.6 - i * 0.15)
m.at(C + 0.1, thud, 0.9); m.at(C + 1.2, pop(700), 0.7) # the turn
m.at(D + 0.1, pop(520), 0.7); m.at(D + 0.7, pop(640), 0.7)
m.notif(E + 0.25)                                      # session validated
m.at(E + 1.2, clang, 0.9); m.at(E + 1.22, clap, 0.5)   # 3 weeks in a row
m.at(F + 0.1, thud, 0.8); m.at(F + 0.7, thud, 0.9); m.at(F + 1.4, m.chime, 0.7)
m.write("sfx-douleur.wav")

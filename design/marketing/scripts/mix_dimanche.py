"""Soundtrack of « Dimanche 17 h » (noxcuse-dimanche-17h.mp4), sound effects only.
Usage: python3 mix_dimanche.py <audio_dir>"""
import sys

from sfx import Mix, pop, tick, whoosh

m = Mix(28.4, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

m.at(0.1, pop(520), 0.8); m.at(0.4, thud)              # DIMANCHE / 17:00
m.at(1.0, pop(640), 0.8); m.at(2.2, pop(760), 0.8)
for k in range(8):                                     # the clock ticks
    m.at(1.8 + k * 0.5, tick(), 0.6)
for s in (3.2, 8.4, 12.6, 18.6, 23.4):
    m.at(s - 0.04, whoosh(), 0.8)
m.notif(3.7); m.notif(5.0); m.notif(5.9)               # reminder + 2 spots
m.at(6.9, pop(520), 0.8)
m.at(8.6, pop(420), 0.8); m.at(9.2, pop(600), 0.7); m.at(9.4, pop(700), 0.7)
m.at(10.6, thud, 1.1); m.at(10.62, clap, 0.6)          # NON
m.at(11.0, pop(1100), 0.9); m.at(11.5, pop(760), 0.8)
for k in range(13):                                    # the chrono flies
    m.at(13.0 + k * 0.25, tick(), 0.5)
m.notif(16.3); m.at(17.0, clang, 0.9)                  # validated, 3rd plate
m.at(18.75, thud, 1.1)                                 # 20:00
m.notif(19.5)                                          # SKIP for Alex
m.at(20.2, pop(380), 0.7); m.at(21.2, pop(520), 0.8)
m.at(23.5, pop(520), 0.8); m.at(23.8, pop(640), 0.8)
m.at(24.15, thud); m.at(24.45, thud)                   # NO / XCUSE.
m.at(25.1, m.chime, 0.9)                               # App Store
m.write("sfx-dimanche.wav")

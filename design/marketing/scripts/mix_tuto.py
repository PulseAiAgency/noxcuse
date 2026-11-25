"""Soundtrack of « Tuto en 5 étapes » (noxcuse-tuto-5-etapes.mp4): no music, a beat made only of sound effects.
Every cut lands on a beat; each shot carries its own hit (thud, clap, clang, notification).
Usage: python3 mix_rush.py <audio_dir>  (reads <audio_dir>/tuto-shots.json, dumped from the page)"""
import json
import sys

from sfx import Mix, pop, tick, whoosh

info = json.load(open(f"{sys.argv[1]}/tuto-shots.json"))
beat, end = info["beat"], info["d"]
m = Mix(end, sys.argv[1])
thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))

last = info["shots"][-1][0]
t = info["shots"][0][0]
k = 0
while t < last - 0.01:                                 # the pulse: tick on every beat, off-beat hat
    m.at(t, tick(), 0.55 if k % 2 == 0 else 0.35)
    m.at(t + beat / 2, tick(), 0.18)
    t += beat
    k += 1
for at, snd in info["shots"]:
    m.at(at - 0.05, whoosh(0.12), 0.35)
    if snd == "thud":
        m.at(at, thud, 0.9)
    elif snd == "clap":
        m.at(at, thud, 0.8); m.at(at + 0.01, clap, 0.8)
    elif snd == "clang":
        m.at(at, clang, 0.85)
    elif snd == "notif":
        m.notif(at)
    elif snd == "pop":
        m.at(at, pop(640), 0.9)
    elif snd == "crush":
        m.at(at + 0.28, thud, 1.2); m.at(at + 0.3, clap)
    elif snd == "typing":
        for k in range(7):                             # N-O-X-C-U-S-E typed
            m.at(at + 0.3 + k * 0.143, pop(1500 + k * 40), 0.35)
        m.at(at + 1.45, pop(700), 0.9)                 # the result card
    elif snd == "goal":
        m.at(at, pop(640), 0.8); m.at(at + 0.8, pop(1100), 0.9)   # « 3 » picked
    elif snd == "geo":
        m.at(at, pop(520), 0.8); m.notif(at + 1.0); m.at(at + 1.1, clang, 0.6)
    elif snd == "poster":
        m.at(at + 0.2, thud, 1.1); m.at(at + 0.22, clap, 0.6)
    elif snd == "end":
        m.at(at, thud, 1.2); m.at(at + 0.6, m.chime, 0.9)
m.write("sfx-tuto.wav")

"""Sounds of the real-people video kit (one wav per clip). Usage: python3 mix_kit.py <audio_dir>"""
import sys

from sfx import Mix, munch, pop

CLIPS = {"accroche": 3, "notif": 3, "messages": 4, "carte": 4, "plus20": 3, "fin": 4}


def build(name, dur):
    m = Mix(dur, sys.argv[1])
    thud, clang = m.file("thud.wav"), m.file("plate-clang.wav")
    if name == "accroche":
        m.at(0.1, pop(480), 0.7); m.at(0.9, pop(620), 0.7)
    elif name == "notif":
        m.notif(0.3)
    elif name == "messages":
        for i, t in enumerate((0.3, 1.1, 1.9)):
            m.at(t, pop(880 + i * 90), 0.8)
    elif name == "carte":
        m.at(0.15, thud); m.at(0.55, thud)
        munch(m, 1.3, bites=5)
    elif name == "plus20":
        for i in range(4):
            m.at(0.6 + i * 0.25, clang, 0.8)
        m.at(1.5, thud)
    elif name == "fin":
        m.at(0.1, thud); m.at(0.45, thud); m.at(2.0, m.chime, 0.9)
    m.write(f"kit-{name}.wav")


for clip, d in CLIPS.items():
    build(clip, d)

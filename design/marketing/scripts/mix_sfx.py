"""Soundtrack of « POV : t'as skip la salle » (noxcuse-pov-skip.mp4). Usage: python3 mix_sfx.py <audio_dir>

Writes two mixes: sfx-mix.wav (with the notification chimes) and sfx-mix-sans-notifs.wav
(vibration kept, chimes removed) to drop a notification sound from TikTok / CapCut's library.
"""
import sys

from sfx import Mix, buzz, notif_chime, save

NOTIFS = (0.35, 2.9, 3.5, 4.1)  # the four notifications landing on the lock screen
CTA = 17.3


def build(with_chimes):
    m = Mix(19.5, sys.argv[1])
    thud, clang, clap = (m.file(n) for n in ("thud.wav", "plate-clang.wav", "chalk-clap.wav"))
    for t in NOTIFS:
        if with_chimes:
            m.notif(t)
        else:
            m.at(t, buzz())
    m.at(5.35, thud); m.at(5.75, thud)              # SK / IP stamps
    for i in range(5):                                # plates loading on the bar
        m.at(10.2 + i * 0.5, clang, 0.8)
    m.at(13.45, thud)                                 # PR DE LA TEAM stamp
    m.at(14.35, thud, 1.1); m.at(14.38, clap, 0.9)    # Canap' crushed, chalk cloud
    m.at(15.9, thud); m.at(16.25, thud)               # NO / XCUSE stamps
    if with_chimes:
        m.at(CTA, m.chime, 0.9)
    return m


save(build(True).dir / "notif.wav", notif_chime())
build(True).write("sfx-mix.wav")
build(False).write("sfx-mix-sans-notifs.wav")

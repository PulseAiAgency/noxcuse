#!/usr/bin/env bash
# Assembles the AI-shot video: 4 Kling clips + transparent overlays rendered from video-ia/edit/index.html.
# Usage: scripts/edit_ia.sh <clips_dir with c1..c4.mp4> <overlays_dir with canape/ potes/ carte/ porte/ barre/ fin/> <out.mp4>
set -euo pipefail
C=$1; O=$2; OUT=$3
# Kling delivers HLG (HDR) tagged BT.2020. Phones then play the whole edit as HDR and the brand
# orange turns red. HLG is SDR-compatible: read the picture as is (BT.2020 matrix), composite in RGB
# and encode as plain, tagged BT.709 SDR.
SDR="scale=in_color_matrix=bt2020:in_range=tv,format=gbrp"
N="$SDR,fps=30,scale=1080:1920,setsar=1"
# Slow push-in on every shot, plus a punch zoom when the SKIP notification lands (2.2 s).
zoom() { echo "scale=w='trunc(1080*($1)/2)*2':h='trunc(1920*($1)/2)*2':eval=frame,crop=1080:1920,setsar=1"; }
ffmpeg -y -loglevel error \
  -i "$C/c1.mp4" -i "$C/c2.mp4" -i "$C/c3.mp4" -i "$C/c4.mp4" \
  -framerate 30 -i "$O/canape/f%04d.png" -framerate 30 -i "$O/potes/f%04d.png" -framerate 30 -i "$O/carte/f%04d.png" \
  -framerate 30 -i "$O/porte/f%04d.png" -framerate 30 -i "$O/barre/f%04d.png" -framerate 30 -i "$O/fin/f%04d.png" \
  -i audio/sfx-ia.wav \
  -filter_complex "
  [0:v]setpts=1.2*PTS,$N,trim=0:4.1,setpts=PTS-STARTPTS,$(zoom '1+0.012*t+0.07*min(1,max(0,(t-2.15)/0.18))')[a0];
  [1:v]$N,trim=0:3.8,setpts=PTS-STARTPTS,$(zoom '1.02+0.015*t')[b0];
  [2:v]$N,trim=1.0:3.2,setpts=PTS-STARTPTS,$(zoom '1.02+0.02*t')[d0];
  [3:v]$N,trim=0:2.8,setpts=PTS-STARTPTS,$(zoom '1.03+0.02*t+0.05*min(1,max(0,(t-1.1)/0.15))')[e0];
  [a0][4:v]overlay=format=gbrp[A]; [b0][5:v]overlay=format=gbrp[B]; [6:v]format=gbrp,setsar=1[Cc];
  [d0][7:v]overlay=format=gbrp[D]; [e0][8:v]overlay=format=gbrp[E]; [9:v]format=gbrp,setsar=1[F];
  [A][B][Cc][D][E][F]concat=n=6:v=1:a=0,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]" \
  -map "[v]" -map 10:a -c:v libx264 -crf 18 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 192k -t 20.5 "$OUT"

#!/bin/bash
# fade depends on loop otherwise invalid -loop 1 -i img

ffmpeg -loop 1 -i imgs/003.jpeg -loop 1 -i imgs/logo.png \
-filter_complex \
"color=c=black:r=60:size=800*450:d=20.0[black];\
[0:v]format=yuva420p,scale=8000x4500,zoompan=z='zoom+0.002':d=25*14:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=800*450[bg0];  \
[1:v]format=yuva420p,crop=w=200:h=200:x=50*t:y=34[logo];\
[black][bg0]overlay[bg1];\
[bg1][logo]overlay=x=400:y=(H-h)/2" \
-ss 1 -t 20 -c:v libx264 -c:a aac crop.mp4
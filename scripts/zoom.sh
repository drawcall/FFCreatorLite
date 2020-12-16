#!/bin/bash

# zoompan抖动 - 前加scale=4000x4000,
# zoompan条件 - zoompan=z='if(lte(zoom,1.5),zoom+0.005,1.51)'
# loop 1和zoompan冲突会循环缩放 - 设置setpts=PTS-STARTPTS+12/TB
# zoompan 被裁切解决办法 - pad=scale*iw:scale*ih:(ow-iw)/2:(oh-ih)/2:color=black@0, 在overlay再左移归位

ffmpeg -threads 2 -loop 1 -i imgs/003.jpeg -loop 1 -i imgs/logo.png \
-filter_complex \
"color=c=black:r=60:size=800*450:d=20.0[black];\
[0:v]format=yuva420p,pad=2*iw:2*ih:(ow-iw)/2:(oh-ih)/2:color=black@0,scale=8000x4500,zoompan=z='if(lte(zoom,1.5),zoom+0.005,1.51)':d=25*10:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1600*900,setpts=PTS-STARTPTS+0/TB,setsar=1/1[bg0];  \
[1:v]scale=4000x4000,pad=1.5*iw:1.5*ih:(ow-iw)/2:(oh-ih)/2:color=black@0,zoompan=z='zoom+0.002':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':fps=25:d=125:s=200x200,setpts=PTS-STARTPTS+0/TB[logo1]; \
[logo1]fade=t=in:st=1.0:d=2.0:alpha=1[logo];\
[black][bg0]overlay=x=-overlay_w/4:y=-overlay_h/4[bg1];\
[bg1][logo]overlay=x=100:y=100" \
-ss 1 -t 20 -c:v libx264 -c:a aac zoom.mp4
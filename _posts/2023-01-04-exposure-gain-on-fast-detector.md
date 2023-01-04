---
layout: post
title: Effects of exposure and gain on FAST detector
author: Mateo de Mayo
date: 2023-01-04 15:50:00 -0300
abstract: >
  Short video to visualize how exposure and gain values in a OV7251 sensor
  affect the false positives when doing feature detection with `cv::FAST`
  with Basalt.
brief: Short video of them.
---

## Behavior of feature detection on exposure and gain changes

An interesting behavior I'll likely reference in the future is the effect that
_exposure_ and _gain_ have on feature detection, so let's do a short blog post
out of it and show its behavior in the next video.

<div class="youtube-video"><iframe
  frameborder="0" allowfullscreen
  src="https://www.youtube-nocookie.com/embed/95pwKV5-esQ"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe></div>

In this video we can see Basalt using the FAST feature detection algorithm from
OpenCV (`cv::FAST`) on images fed from the OV7251 sensors found in a Samsung
Odyssey+ from Monado. Notice how these camera parameters affect the detected
features. In particular, notice how increasing gain also increases the false
positives and makes FAST detect a significant amount of wrong features even when
the cameras are totally covered. On the other hand, the features we obtain by
increasing exposure are a lot more stable. Keep in mind that high values of
exposure increase motion blur too, which is a no-go for tracking algorithms.

The auto exposure-gain
[algorithm](https://monado.pages.freedesktop.org/monado/u__autoexpgain_8c.html#ab320f979210a828a5bc1c1462f957578)
found in Monado
[tries](https://gitlab.freedesktop.org/monado/monado/-/merge_requests/1291) to
do a good enough trade off between these two values but even then, a significant
amount of incorrect features are detected and Basalt needs to filter them.

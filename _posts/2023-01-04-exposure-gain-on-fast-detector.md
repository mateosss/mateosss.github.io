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
features. In particular, notice how increasing gain also increases the number of
unuseful features detected by FAST even when the cameras are totally covered. On
the other hand, the features we obtain by increasing exposure are a lot more
stable. Keep in mind that high values of exposure increase motion blur too,
which is a no-go for tracking algorithms.

The auto exposure-gain
[algorithm](https://monado.pages.freedesktop.org/monado/u__autoexpgain_8c.html#ab320f979210a828a5bc1c1462f957578)
found in Monado
[tries](https://gitlab.freedesktop.org/monado/monado/-/merge_requests/1291) to
do a good enough trade off between these two values but even then, a significant
amount of incorrect features are detected, in any case Basalt is able to filter them properly and Basalt needs to filter them aft.

EDIT: Here is a quick explanation of how Basalt detects features:

- It subdivides the image in a grid
- It uses the best `cv::FAST` detected features on each grid cell starting with
  a maximum threshold (40 by default) and if it doesn't find any feature it
  halves it and tries again a couple of time until a minimum acceptable
  threshold is reached (5 by default).
- The feature is only used if it was observed in at least two keyframes and the
  triangulation between the keyframes succeeds. This observation will only
  happen if the feature was successfully tracked through optical flow between
  two keyframes; either temporally in the same camera or spatially between
  different cameras.

Hopefully this shows how having more features will likely decrease performance
in the frontend (more wrong features to compare against in the keyframe-pair
triangulation search) of the system and thus having good images makes everything
run faster and more accurate.

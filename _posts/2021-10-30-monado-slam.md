---
layout: post
title: SLAM for Monado
author: Mateo de Mayo
date: 2021-10-30 20:10:00 -0300
abstract: >
  After some time working in the integration of SLAM systems with Monado, there
  is now a starting point to try out SLAM and VIO tracking. Kimera-VIO,
  ORB-SLAM3, Basalt and Monado itself were adapted to work together in a modular
  way. It is worth noting that this is one of the first iterations and there is
  still a lot of room for improvement.
brief: Overview of the SLAM integrations with Monado.
---

## Overview

These last months I've been testing out different SLAM/VIO systems (Kimera,
ORB-SLAM3 and Basalt) and integrating them into Monado by proposing a header
[[1]][1] for this kind of tracking and implementing it in a fork of each system
(Kimera [[2]][2] [[3]][3] [[4]][4], ORB-SLAM3 [[5]][5] [[6]][6] and Basalt
[[7]][7] [[8]][8]). Then in Monado, the necessary modifications were made to
have a tracker class [[9]][9] that can talk with that header and drivers can
use.

## Trying it Out

For starters, if you want to get some SLAM working with Monado, you should pick
one of these three systems, clone my fork of it, and read the installation
section of the README. You do not need a hardware device to try it out as you
can instead use a dataset as indicated in the READMEs. Here are the links for
each fork: Kimera [[18]][18], ORB-SLAM3 [[19]][19], Basalt [[20]][20]. While I
wasn't able to get Kimera to work properly, ORB-SLAM3 and Basalt feel pretty
decent with the RealSense D455 I've been working with. From those two, I would
recommend starting with Basalt as it is a bit easier to set up.

The work done in the libraries and the interface is still very rough and has
just been an initial iteration. Right now the systems mostly just return the
last tracked pose and don't support any kind of prediction. I've mostly done the
bare minimum work to expose them as dynamic libraries that Monado can use. The
configuration is still pretty cumbersome as you need to provide config data both
for Monado and the systems separately, and each system's configuration format is
different from the others. Most of the systems' numerical errors tend to get
pretty bad and end up in crashes when you make harsh movements. Also, many
quality-of-life improvements like being able to specify where the floor is at
were not implemented. I'll be working on improving aspects like these in the
following months.

## Writing a New Driver

Regarding drivers, currently there are two that can get tracked through SLAM in
Monado: `euroc` and `realsense`. EuRoC is a standard dataset used for comparison
of SLAM systems [[10]][10], but it is also a format for storing these kinds of
datasets (basically a directory with a bunch of PNGs and CSVs with IMU data and
timestamps). The `euroc` driver has a "player" [[11]][11] to play these
datasets, it also exposes a basic device [[12]][12] to see how the dataset gets
tracked. The `realsense` driver on the other, previously focused on working with
the T265's device SLAM, now is extended to (supposedly) work with any RealSense
device that has video and IMU streams (I only tested it on a D455). It does this
by providing a `rs_source` [[13]][13] of video and IMU data, and a very basic
device `rs_hdev` [[14]][14] which gets tracked through (host) SLAM with this
source of data.

The basic idea, if you want to write a driver that uses SLAM, is to expose the
source of your video and IMU data as a derived class of the `xrt_fs` class
similar to how the `euroc_player` and `rs_source` do. The `fs` in `xrt_fs` means
*frame server*, but the concept is a bit extended here because it will be also an
*"IMU server"*, or how I usually call the whole, a *SLAM source*. Your SLAM source
will need to implement most of the methods to be an `xrt_fs`, in particular the
method `slam_stream_start` which will receive a `xrt_slam_sinks` [[15]][15],
which is where you need to send your driver's video and IMU data into. Once you
have a SLAM source that can feed SLAM sinks, you just need to start the SLAM
tracker from the device you want to get tracked, similar to how the
`euroc_device` [[16]][16] and the `rs_hdev` [[17]][17] do.

## How is it Looking

These are videos of how the implementations are looking.

### Kimera-VIO

Kimera was the first system to test and integrate, but unfortunately I wasn't
able to get good performance out of it. In the video, you can see how low its FPS
are and how the tracking starts flying away very easily when exciting the
accelerometer. Taken with a D455 camera in stereo mode, with 640x360 resolution
at 30hz and IMU samples at 250hz.

<div class="youtube-video"><iframe
  frameborder="0" allowfullscreen
  src="https://www.youtube-nocookie.com/embed/ajuqQ7E1MFw"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe></div>

### ORB-SLAM3

ORB-SLAM3 works very well and is the only system that is not just
visual-inertial odometry, but also builds and can store the map in a persistent
way. It provides good FPS and robust tracking. Towards the end, you can see it
supporting very fast movements, but also diverging with some particular abrupt
ones. Something to keep in mind is that ORB-SLAM3 is GPL and, just in case, it
is not listed in the main Monado repository, instead you will need to use a fork
of Monado that might be a bit out of sync. This fork contains two small commits
needed to make ORB-SLAM3 work. This video was also using a D455 camera with the
same configuration as in the Kimera video.

<div class="youtube-video"><iframe
  frameborder="0" allowfullscreen
  src="https://www.youtube-nocookie.com/embed/kJwWY973b10"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe></div>

### Basalt

Basalt is extremely fast and has a BSD-3 license. This paper [[21]][21] of a
privative solution shows how fast Basalt is. It is probably the system with the
best software engineering practices out of the three integrated. While it can be
less robust than ORB-SLAM3, you can get away by increasing the resolution and
frequency of samples. In this video in particular, I'm using almost twice as
many pixels with a 848x480 resolution for each camera and twice the FPS at 60hz,
IMU samples still at 250hz.

<div class="youtube-video"><iframe
  frameborder="0" allowfullscreen
  src="https://www.youtube-nocookie.com/embed/mIgRHmxbaC8"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe></div>

[1]: https://gitlab.freedesktop.org/monado/monado/-/blob/master/src/external/slam_tracker/slam_tracker.hpp
[2]: https://gitlab.freedesktop.org/mateosss/Kimera-VIO/-/blob/xrtslam/include/kimera-vio/third_party/monado/slam_tracker.hpp
[3]: https://gitlab.freedesktop.org/mateosss/Kimera-VIO/-/blob/xrtslam/examples/KimeraVIO.cpp
[4]: https://gitlab.freedesktop.org/mateosss/Kimera-VIO/-/blob/xrtslam/include/kimera-vio/pipeline/Kimera.h
[5]: https://gitlab.freedesktop.org/mateosss/ORB_SLAM3/-/blob/xrtslam/Thirdparty/monado/slam_tracker.hpp
[6]: https://gitlab.freedesktop.org/mateosss/ORB_SLAM3/-/blob/xrtslam/Examples/Monado/slam_tracker.cpp
[7]: https://gitlab.freedesktop.org/mateosss/basalt/-/blob/xrtslam/thirdparty/monado/slam_tracker.hpp
[8]: https://gitlab.freedesktop.org/mateosss/basalt/-/blob/xrtslam/src/monado/slam_tracker.cpp
[9]: https://gitlab.freedesktop.org/monado/monado/-/blob/master/src/xrt/auxiliary/tracking/t_tracker_slam.cpp
[10]: https://projects.asl.ethz.ch/datasets/doku.php?id=kmavvisualinertialdatasets
[11]: https://gitlab.freedesktop.org/monado/monado/-/blob/master/src/xrt/drivers/euroc/euroc_player.cpp
[12]: https://gitlab.freedesktop.org/monado/monado/-/blob/master/src/xrt/drivers/euroc/euroc_device.c
[13]: https://gitlab.freedesktop.org/monado/monado/-/blob/c8ee075b8d3ead346038c89f7ec70df70900d0d1/src/xrt/drivers/realsense/rs_hdev.c#L128
[14]: https://gitlab.freedesktop.org/monado/monado/-/blob/c8ee075b8d3ead346038c89f7ec70df70900d0d1/src/xrt/drivers/realsense/rs_hdev.c#L113
[15]: https://gitlab.freedesktop.org/monado/monado/-/blob/c8ee075b8d3ead346038c89f7ec70df70900d0d1/src/xrt/include/xrt/xrt_tracking.h#L167
[16]: https://gitlab.freedesktop.org/monado/monado/-/blob/c8ee075b8d3ead346038c89f7ec70df70900d0d1/src/xrt/drivers/euroc/euroc_device.c#L259
[17]: https://gitlab.freedesktop.org/monado/monado/-/blob/c8ee075b8d3ead346038c89f7ec70df70900d0d1/src/xrt/drivers/realsense/rs_hdev.c#L937
[18]: https://gitlab.freedesktop.org/mateosss/Ki\mera-VIO
[19]: https://gitlab.freedesktop.org/mateosss/ORB_SLAM3
[20]: https://gitlab.freedesktop.org/mateosss/basalt
[21]: https://arxiv.org/pdf/2106.11857.pdf#page=15

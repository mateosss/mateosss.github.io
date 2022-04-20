---
layout: post
title: Issues with SLAM metrics
author: Mateo de Mayo
date: 2021-03-21 13:10:00 -0300
abstract: >
  "When a measure becomes a target, it ceases to be a good measure"—
  Does SLAM research suffer from Goodhart's law?
brief: Are standard ATE/RTE metrics good for XR?
---


### Remarks about standard tracking metrics and their issues

ORB-SLAM3 ATE/RTE scores shown in the [previous blogpost](/blog/xrtslam-metrics) are awful compared to the ones
reported in their paper[^orbslam3]. That's because they report the error once
the entire dataset has been run, which retroactively modifies the trajectory as
new loop closures get detected. We can improve the errors in realtime for
Monado significantly by first building the map and then loading it, but as of
now, that feature is very unstable in ORB-SLAM3 (i.e., crashes a lot). There is
a good writeup about _causal_ vs _non causal_ metrics usage in the preprint
from OKVIS2[^okvis2] in section VII.

However, there was another issue hiding in plain sight that the measurement tools (also presented in the [previous blogpost](/blog/xrtslam-metrics)) made
obvious, even when considering the post processed metrics of ORB-SLAM3.

Take for example this section from the EuRoC MH01 dataset which shows Basalt
trajectory against ground truth to the left and ORB-SLAM3 _post processed_
trajectory to the right. You will need to zoom in the image.

![MH01](/assets/img/posts/2022-04-20-slam-metric-issues/MH01.png)

In this dataset, Basalt scores an absolute error (ATE)
of 0.066m while ORB-SLAM3 scores better at 0.043m. And when you see the images
you can see that indeed, ORB-SLAM3 path is _closer_ to the ground truth (the
dotted line), but the amount of jitter it has compared against Basalt is
unreasonable for VR. And remember that this is a postprocessed trajectory,
things are worse when you run ORB-SLAM3 without mapping your room first.

Then you could say, "well, surely relative metrics like RTE must show that
Basalt has a smoother trajectory". But that's not as straightforward an answer
neither. For the image above the RTE of Basalt is 0.005219m and for ORB-SLAM3 it
is 0.0077m. Sure Basalt scores better, but does that number tell you how much
better it is? See this other similar image below from the EuRoC V101 dataset:

![V101](/assets/img/posts/2022-04-20-slam-metric-issues/V101.png)

In this example Basalt scores in RTE 0.0130m while ORB-SLAM3 scores 0.0139m.
Sure it's worse, but again those numbers don't seem to be good at really telling
by how much ORB-SLAM3 is worse.

In any case, this was a bit of a ramble and yes, I'm only showing two sections
of isolated trajectories, so take what I'm saying with a pinch of salt. But even
then, I think it was worth mentioning these issues and how the usual ATE/RTE
metrics used for VIO/SLAM research might not be very well suited for XR. They
are a good starting point for sure, but I think there is value exploring new
metrics that better represent the problems XR is faced with.

### References

[^orbslam3]: ORB-SLAM3: <https://arxiv.org/abs/2007.11898>
[^okvis2]: OKVIS2: <https://arxiv.org/abs/2202.09199>

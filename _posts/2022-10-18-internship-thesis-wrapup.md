---
layout: post
title:  Internship, thesis, and FossXR
author: Mateo de Mayo
date: 2022-10-18 21:50:00 -0300
abstract: >
  After FossXR it is a good time as any other to sit down and summarize some of
  the SLAM/VIO-related milestones achieved this year.
brief: Wrapping up some important chapters.
---

## Key moments

In July 2021 I started working on an internship for
[Collabora](https://collabora.com/) and got introduced to the world of XR while
working on [Monado](https://monado.dev). More specifically, I got introduced to
the SLAM/VIO research area to develop a component that would provide inside-out
visual-inertial tracking capabilities to Monado. Step by step I started to grasp
the concepts and methods of the area, the names, the key publications and so on.
I ended up integrating three systems into Monado with one, Basalt, being the key
underlying system that would make the component useful enough. I wrote a
(lengthy and a bit boring) [blogpost](https://col.la/6dof) talking about my
internship in Collabora's blog.

After finishing the internship I took a couple of months to write down my thesis
for my Computer Science degree at [FaMAF](https://www.famaf.unc.edu.ar).
Unfortunately, the thesis is written in Spanish due to university rules but, in
case that's not a problem for you, you can find it online in this [weirdly named
repository](https://gitlab.com/mateosss/scsth) and a link to the pdf version
[here](https://gitlab.com/mateosss/scsth/-/raw/main/output/thesis.pdf). I'm
quite proud of how it came out; specially of Figures 2.3 and 2.4, yes those were
rendered in Blender, and yes those took three days to figure out how to make.

Lastly and the more recent event that got me to write this blogpost, I gave a
[talk](https://youtu.be/ZkwL5IzYCp8?t=26592) at [FossXR](https://fossxr.dev/) in Minneapolis. Enough to
say that this was my first time traveling internationally [^1]. Besides that
being nice, I feel the need to mention how cool the experience was. Imagine
being working with people that you only know through chat on Discord, and
also a bunch of other people you can only see in video meetings. And then you are
working on this very specific component, of a very specific technology, on a
very specific open source project. You have so many problems describing what you
even work on to people. This very thing of XR?, with… Open? Source?, and there
is some kind of community effort? Licenses? Windowing systems? Eigen crashes?
How abstract!

But then, you get together in Minneapolis, you see some of these Discord avatars
and some of your remote coworkers giving a talk in person, some of them giving
one virtually. And you can interact with them, and they exist. And there is
hardware! A lot of hardware! And some of these devices are running this very
abstract thing you've been working on for the past year. And you know how that
works, and you try to see how that very little bug you've been dragging affects
this very real thing. You see headsets you've never seen before running this
SLAM/VIO tracking component, and people using it in their work. And then, you
realize, how cool really is what you are working on. I _knew_ it was cool, but
_seeing_ how cool it is, was different.

Now, a photo of a squirrel from Minneapolis. We don't have squirrels in my city!

![Squirrel from Minneapolis](/assets/img/posts/2022-10-18-internship-thesis-wrapup/squirrel.jpg)

---

### Footnotes

[^1]: Excludings the ones I don't have memory of.

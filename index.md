---
layout: home
title: Mateo de Mayo
subtitle: Diving into VR and OpenXR
---

## Blog Posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}): {{ post.excerpt }}
{% endfor %}

<!-- <ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul> -->

---
layout: home
title: Mateo de Mayo
subtitle: Diving into VR and OpenXR
---

## Blog Posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}){:target="_self"}: {{ post.brief }}
{% endfor %}

<!-- <ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      {{ post.brief }}
    </li>
  {% endfor %}
</ul> -->

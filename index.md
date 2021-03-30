---
layout: home
title: Mateo de Mayo
subtitle: Diving into VR and OpenXR
---

## Blog Posts

{% for post in site.posts %}
{% unless post.hidden %}
- [{{ post.title }}]({{ post.url }}){:target="_self"}: {{ post.brief }}
{% endunless %}
{% endfor %}

<!-- <ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      {{ post.brief }}
    </li>
  {% endfor %}
</ul> -->

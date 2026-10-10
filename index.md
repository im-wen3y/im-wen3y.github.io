---
layout: default
---

<section class="intro">
  <p>
    React를 <b>코드를 읽고 동작을 예측한 뒤, 승인할지 수정을 요청할지 판단하는</b> 방식으로 공부하고 있습니다.
    직접 짜는 것보다 남의 코드를 읽는 쪽이 내가 뭘 모르는지 더 빨리 드러난다고 생각해서요.
  </p>
  <p>
    그래서 이 기록은 정리된 결론보다 <b>어디서 막혔고 무엇을 근거로 판단했는지</b>가 중심입니다.
    틀린 예측도 지우지 않고 남깁니다.
  </p>
</section>

<ul class="post-list pinned">
  <li>
    <a href="{{ '/study/' | relative_url }}">
      <time>📌 고정</time>
      <span class="post-title">앞으로 공부할 목록</span>
    </a>
  </li>
</ul>

{% assign years = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% assign current_year = years[0].name %}

<div class="year-tabs" role="tablist">
{% for y in years %}
  <button type="button" class="year-tab{% if forloop.first %} active{% endif %}" data-year="{{ y.name }}">{{ y.name }}</button>
{% endfor %}
</div>

<ul class="post-list">
{% for post in site.posts %}
  {% assign post_year = post.date | date: "%Y" %}
  <li data-year="{{ post_year }}"{% unless post_year == current_year %} hidden{% endunless %}>
    <a href="{{ post.url | relative_url }}">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
      <span class="post-title">{{ post.title }}</span>
    </a>
  </li>
{% endfor %}
</ul>

<script>
document.querySelectorAll('.year-tab').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.year-tab').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    var year = btn.dataset.year;
    document.querySelectorAll('.post-list li').forEach(function(li){
      li.hidden = li.dataset.year !== year;
    });
  });
});
</script>

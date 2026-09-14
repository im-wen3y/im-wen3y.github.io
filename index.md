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

{% assign post_days = "" %}
{% for post in site.posts %}
  {% assign pd = post.date | date: "%Y-%m-%d" %}
  {% assign post_days = post_days | append: pd | append: "," %}
{% endfor %}
{% assign post_days = post_days | append: "end" %}

<aside class="grass-card">
  <div class="grass-header">
    <p class="grass-caption">지난 3개월의 발자취</p>
    <select id="grass-range">
      <option value="3m" selected>최근 3개월</option>
      <option value="6m">최근 6개월</option>
      <option value="1y">최근 1년</option>
    </select>
  </div>
  <div class="grass-grid" data-range="3m" style="grid-template-columns:28px repeat(13, 10px);">
    {% include grass-grid.html weeks=13 post_days=post_days %}
  </div>
  <div class="grass-grid" data-range="6m" style="grid-template-columns:28px repeat(26, 10px);" hidden>
    {% include grass-grid.html weeks=26 post_days=post_days %}
  </div>
  <div class="grass-grid" data-range="1y" style="grid-template-columns:28px repeat(53, 10px);" hidden>
    {% include grass-grid.html weeks=53 post_days=post_days %}
  </div>
</aside>

<script>
document.getElementById('grass-range').addEventListener('change', function(){
  var range = this.value;
  var labels = {"3m":"지난 3개월의 발자취", "6m":"지난 6개월의 발자취", "1y":"지난 1년의 발자취"};
  document.querySelectorAll('.grass-grid').forEach(function(g){
    g.hidden = g.dataset.range !== range;
  });
  document.querySelector('.grass-caption').textContent = labels[range];
});

function positionGrassCard(){
  var win = document.querySelector('.window');
  var card = document.querySelector('.grass-card');
  if (card.parentElement !== document.body) document.body.appendChild(card);
  card.classList.remove('floating');
  card.style.top = '';
  card.style.left = '';
  var winRect = win.getBoundingClientRect();
  var cardWidth = card.offsetWidth;
  var spaceRight = window.innerWidth - winRect.right;
  if (spaceRight >= cardWidth + 24) {
    card.classList.add('floating');
    card.style.top = (winRect.top + window.scrollY) + 'px';
    card.style.left = (winRect.right + 24) + 'px';
  }
}
window.addEventListener('load', positionGrassCard);
window.addEventListener('resize', positionGrassCard);
</script>

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

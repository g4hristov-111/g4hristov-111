(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // active nav link
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(function(a){
    if(a.getAttribute('data-page') === here) a.classList.add('is-active');
  });

  // header scroll state
  var header = document.querySelector('.site-header');
  if(header){
    var onScroll = function(){
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  }
})();

/* ===== Google Ads conversions + cookie consent ===== */
(function(){
  // Етикети на реализациите от Google Ads (попълват се, когато се създадат действията)
  var CONVERSIONS = {
    lead:  '',   // изпратено запитване (страница „Благодаря“)
    phone: ''    // клик по телефонния номер
  };
  var AW = 'AW-18490693279';

  function track(kind){
    if(typeof gtag !== 'function') return;
    if(CONVERSIONS[kind]) gtag('event','conversion',{send_to: AW + '/' + CONVERSIONS[kind]});
    gtag('event', kind === 'lead' ? 'generate_lead' : 'phone_click');
  }

  if(document.body && document.body.getAttribute('data-conversion') === 'lead') track('lead');
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if(a) track('phone');
  });

  // cookie banner
  var stored = null;
  try{ stored = localStorage.getItem('vh-consent'); }catch(e){}
  if(stored) return;

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role','dialog');
  bar.setAttribute('aria-label','Бисквитки');
  bar.innerHTML =
    '<p>Използваме бисквитки, за да измерваме ефективността на рекламите си. Можете да ги приемете или откажете.</p>' +
    '<div class="cookie-actions">' +
      '<button type="button" class="btn outline" data-choice="denied">Отказвам</button>' +
      '<button type="button" class="btn" data-choice="granted">Приемам</button>' +
    '</div>';
  document.body.appendChild(bar);

  bar.addEventListener('click', function(e){
    var choice = e.target.getAttribute && e.target.getAttribute('data-choice');
    if(!choice) return;
    try{ localStorage.setItem('vh-consent', choice); }catch(err){}
    if(choice === 'granted' && typeof gtag === 'function'){
      gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
    }
    bar.remove();
  });
})();

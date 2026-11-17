(function(){
  var d=document, top=d.querySelector('.top');
  // naglowek po przewinieciu
  function sc(){ if(top) top.classList.toggle('sc', window.scrollY>8); }
  addEventListener('scroll', sc, {passive:true}); sc();
  // menu mobilne
  var bur=d.querySelector('.burger');
  if(bur){
    bur.addEventListener('click', function(){
      var o=top.classList.toggle('open'); bur.setAttribute('aria-expanded', o?'true':'false');
    });
    d.querySelectorAll('.menu a').forEach(function(a){ a.addEventListener('click', function(){ top.classList.remove('open'); bur.setAttribute('aria-expanded','false'); }); });
  }
  // aktywna pozycja menu
  var links={}; d.querySelectorAll('.menu a[href^="#"]').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ for(var k in links) links[k].classList.toggle('on', k===e.target.id); } });
    }, {rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(id){ var s=d.getElementById(id); if(s) io.observe(s); });
  }
  // karuzele: przewijanie palcem (natywnie), mysza (przeciaganie) i strzalkami
  d.querySelectorAll('.karuzela').forEach(function(k){
    var tor=k.querySelector('.tor'), prev=k.querySelector('.prev'), next=k.querySelector('.next');
    function krok(){ var c=tor.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(tor).columnGap||0) : 300; }
    function stan(){
      var max=tor.scrollWidth-tor.clientWidth-2;
      if(prev) prev.disabled = tor.scrollLeft<=2;
      if(next) next.disabled = tor.scrollLeft>=max;
      k.classList.toggle('pelna', max<=0);
    }
    if(prev) prev.addEventListener('click', function(){ tor.scrollBy({left:-krok(), behavior:'smooth'}); });
    if(next) next.addEventListener('click', function(){ tor.scrollBy({left:krok(), behavior:'smooth'}); });
    tor.addEventListener('scroll', stan, {passive:true}); addEventListener('resize', stan); stan();
    var dn=false, x0=0, s0=0, ruch=false;
    tor.addEventListener('pointerdown', function(e){ if(e.pointerType!=='mouse') return; dn=true; ruch=false; x0=e.clientX; s0=tor.scrollLeft; });
    addEventListener('pointermove', function(e){ if(!dn) return; var dx=e.clientX-x0; if(Math.abs(dx)>5){ ruch=true; tor.classList.add('ciag'); } tor.scrollLeft=s0-dx; });
    addEventListener('pointerup', function(){ if(!dn) return; dn=false; tor.classList.remove('ciag'); });
    tor.addEventListener('click', function(e){ if(ruch){ e.preventDefault(); e.stopPropagation(); ruch=false; } }, true);
    tor.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });
  // podglad zdjec (lightbox)
  var lb=d.getElementById('lb');
  if(lb){
    var img=lb.querySelector('img'), cap=lb.querySelector('p'), grupa=[], i=0;
    function pokaz(n){ i=(n+grupa.length)%grupa.length; var a=grupa[i]; img.src=a.getAttribute('href'); img.alt=a.dataset.alt||''; cap.textContent=a.dataset.alt||''; }
    d.addEventListener('click', function(e){
      var a=e.target.closest('a.lb'); if(!a) return; e.preventDefault();
      grupa=[].slice.call(d.querySelectorAll('a.lb[data-g="'+a.dataset.g+'"]')); pokaz(grupa.indexOf(a));
      if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
      d.body.classList.add('lb-on');
    });
    function zamknij(){ if(lb.close) lb.close(); else lb.removeAttribute('open'); }
    lb.addEventListener('close', function(){ d.body.classList.remove('lb-on'); img.removeAttribute('src'); });
    lb.querySelector('.lb-x').addEventListener('click', zamknij);
    lb.querySelector('.lb-p').addEventListener('click', function(){ pokaz(i-1); });
    lb.querySelector('.lb-n').addEventListener('click', function(){ pokaz(i+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) zamknij(); });
    d.addEventListener('keydown', function(e){ if(!lb.open) return; if(e.key==='ArrowLeft') pokaz(i-1); if(e.key==='ArrowRight') pokaz(i+1); });
    var tx=0; lb.addEventListener('touchstart', function(e){ tx=e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){ var dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>50) pokaz(i+(dx<0?1:-1)); });
  }
  // formularz pokazowy
  d.querySelectorAll('form.pokaz').forEach(function(f){
    f.addEventListener('submit', function(e){ e.preventDefault(); var m=f.querySelector('.msg'); if(m){ m.hidden=false; m.focus(); } });
  });
  d.querySelectorAll('.rok').forEach(function(s){ s.textContent=new Date().getFullYear(); });
})();

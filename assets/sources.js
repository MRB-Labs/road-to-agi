/* The Sources page's own script, kept out of the HTML for the same reason as
   assets/boot.js: the Content Security Policy allows no inline script. */
(function(){
  var root=document.documentElement, btn=document.getElementById('themeBtn');
  var saved=null;
  try{saved=localStorage.getItem('rta-theme')}catch(e){}
  var initial = 'dark';
  set(initial);
  function set(t){root.setAttribute('data-theme',t); btn.textContent = (t==='dark'?'Light':'Dark');}
  if(btn) btn.style.display='none';

  document.querySelectorAll('.tbl-wrap table').forEach(function(table){
    var labels=[].slice.call(table.querySelectorAll('thead th')).map(function(th){return th.textContent.trim()});
    if(!labels.length) return;
    table.querySelectorAll('tbody tr').forEach(function(row){
      [].slice.call(row.children).forEach(function(cell,i){
        if(!cell.hasAttribute('data-label')) cell.setAttribute('data-label', labels[i] || '');
      });
    });
  });

  var links=[].slice.call(document.querySelectorAll('#nav a'));
  var targets=links.map(function(a){return document.querySelector(a.getAttribute('href'))}).filter(Boolean);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        links.forEach(function(a){a.classList.toggle('on', a.getAttribute('href')==='#'+en.target.id)});
      });
    },{rootMargin:'-70px 0px -70% 0px'});
    targets.forEach(function(t){io.observe(t)});
  }
})();

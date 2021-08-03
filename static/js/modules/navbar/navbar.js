document.querySelector('nav').querySelectorAll('a').forEach(a => {
   if (a === document.querySelector('#signout-button')) return;
   if (parent.location.href === a.href) a.classList.add('focus');
})
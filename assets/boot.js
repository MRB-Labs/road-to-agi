/* Runs in <head>, before first paint: sets the theme and marks JavaScript as
   available, which is what lets the app views stand up. It lives in its own file
   because the Content Security Policy (content/csp.txt) allows no inline script. */
(function(){document.documentElement.setAttribute("data-theme","dark");/* light mode is kept in CSS but disabled publicly while it is reworked */document.documentElement.classList.add("js");})();

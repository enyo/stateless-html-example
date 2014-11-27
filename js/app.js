/**
 * This file gets loaded when the site finished loaded, because it has been
 * included with `defer`.
 *
 *
 * * * * * * *
 * DISCLAIMER
 * * * * * * *
 *
 * This page is a proof of concept and only works on modern browsers (IE9+,
 * and standard Firefox, Chrome and Opera). It would be easy to adapt the
 * code to work in older browser versions, but I wanted to keep the source
 * code as simple as possible.
 */



/**
 * The init() function gets invoked immediately to replace all links to be
 * handled by AJAX requests
 */
!function init() {

  var mainElement = document.querySelector("main");
  var fakeSlowConnectionCheckbox = document.getElementById("fake-slow-connection");


  convertLinks();


  /**
   * Converts all links to be handled by JS
   */
  function convertLinks(documentRoot) {
    if (!documentRoot) documentRoot = document;

    // Get all links
    var links = documentRoot.querySelectorAll("a");

    // Hack to convert the NodeList to an Array... JavaScript :(
    Array.prototype.slice.call(links)
      .filter(function(link) {
        // Remove all links that aren't local. We are only interested in
        // relative links.
        return link.getAttribute("href").indexOf("http") !== 0;
      })
      .forEach(function(link) {
        var title = link.innerHTML;

        link.addEventListener("click", function(e) {

          // Make sure that Cmd- or Ctrl-Click still opens the link in a new tab
          if (e.metaKey || e.ctrlKey) return;

          // Make sure that the browser doesn't actually follow the link
          e.preventDefault();

          goToPage(link.getAttribute("href"), title);
        });
      });

  }






  // Setup the history change event listener to handle when the user clicks the
  // back button.
  window.onpopstate = function(event) {
    var href = event.state.href;
    loadPage(href);
  };





  /**
   * Sets the proper history state, and calls loadPage() with the `href`
   */
  function goToPage(href, title) {
    history.pushState({ href: href }, title, href);
    loadPage(href);
  }




  var menuLinks = document.querySelectorAll("header nav a");

  /**
   * Actually loads the page from `href` and replaces the #main content with it.
   */
  function loadPage(href) {

    console.log("Loading page " + href);

    mainElement.setAttribute("aria-busy", "true");

    for (var i = 0; i < menuLinks.length; i++) {
      var link = menuLinks[i];

      if (link.getAttribute("href") == href) {
        link.classList.add("active");
      }
      else {
        link.classList.remove("active");
      }
    }


    // Firing off a standard AJAX request
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {

          var fakeDelay = fakeSlowConnectionCheckbox.checked ? 400 : 0;
          setTimeout(function() { finishedLoading(xmlhttp.response); }, fakeDelay);


        }
        else { alert("something else other than 200 was returned"); }
      }
    }

    xmlhttp.open("GET", href, true);

    // Tells the browser to retrieve the response as a HTML document
    xmlhttp.responseType = "document";

    xmlhttp.send();

  }

  function finishedLoading(responseHtml) {

    mainElement.setAttribute("aria-busy", "false");

    // Extract the #main div from the response, and update our
    // current div.
    // This is where the magic happens
    mainElement.innerHTML = responseHtml.querySelector("main").innerHTML;

    // Make sure that all links in the newly loaded main div are converted.
    convertLinks(mainElement);

  }


}();


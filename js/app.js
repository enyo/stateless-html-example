/**
 * This file gets loaded when the site finished loaded, because it has been
 * included with `defer`.
 */



var mainDiv;

/**
 * The init() function gets invoked immediately to replace all links to be
 * handled by AJAX requests
 */
!function init() {

  mainDiv = document.getElementById("main");

  // Get all links
  var links = document.querySelectorAll("a");
  
  for (var i = 0; i < links.length; i++) {
    var link = links[i];

    // Need to capture the link variable in a closure
    !function(link) {
      var href = link.getAttribute("href")
          title = link.innerHTML;

      // We are only interested in relative links
      if (href.indexOf('http') !== 0) {
        link.addEventListener('click', function(e) {
          // Make sure that the browser doesn't actually follow the link
          e.preventDefault();
          goToPage(href, title);
        });
      }
    }(link);

  }


  // Setup the history change event listener to handle when the user clicks the
  // back button.
  window.onpopstate = function(event) {
    loadPage(event.state.href);
  };




  /**
   * Sets the proper history state, and calls loadPage() with the `href`
   */
  function goToPage(href, title) {
    history.pushState({ href: href }, title, href);
    loadPage(href);
  }



  /**
   * Actually loads the page from `href` and replaces the #main content with it.
   */
  function loadPage(href) {

    document.body.classList.add("loading-content");

    console.log("Loading page " + href);

    // Firing off a standard AJAX request
    var xmlhttp = new XMLHttpRequest();

    // Tells the browser to retrieve the response as a HTML document
    xmlhttp.responseType = "document";

    xmlhttp.onreadystatechange = function() {
      document.body.classList.remove("loading-content");
      if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          // Extract the #main div from the response, and update our current div
          mainDiv.innerHTML = xmlhttp.response.querySelector("#main").innerHTML;
        }
        else {
           alert('something else other than 200 was returned')
        }
      }
    }

    xmlhttp.open("GET", href, true);
    xmlhttp.send();

  }

}();


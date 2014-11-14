/**
 * This file gets loaded when the site finished loaded, because it has been
 * included with `defer`.
 */



var mainDiv, fakeSlowConnectionCheckbox;

/**
 * The init() function gets invoked immediately to replace all links to be
 * handled by AJAX requests
 */
!function init() {

  mainDiv = document.getElementById("main");
  fakeSlowConnectionCheckbox = document.getElementById("fake-slow-connection");

  convertLinks();


  /**
   * Converts all links to be handled by JS
   */
  function convertLinks(documentRoot) {
    if (!documentRoot) documentRoot = document;

    // Get all links
    var links = documentRoot.querySelectorAll("a");
    
    for (var i = 0; i < links.length; i++) {
      var link = links[i];

      // Need to capture the link variable in a closure
      !function(link) {
        var href = link.getAttribute("href")
            title = link.innerHTML;

        // We are only interested in relative links
        if (href.indexOf("http") !== 0) {
          link.addEventListener("click", function(e) {
            // Make sure that the browser doesn't actually follow the link
            e.preventDefault();

            onClick(link);
          });
        }
      }(link);

    }
  }






  // Setup the history change event listener to handle when the user clicks the
  // back button.
  window.onpopstate = function(event) {
    var href = event.state.href;
    loadPage(href);
  };



  /**
   * Invoked when a link is clicked
   */
  function onClick(link) {
    // // Remove the active class from all links
    // for (var i = 0; i < links.length; i++) {
    //   links[i].classList.remove("active");
    // }

    // // Add active class to correct link
    // link.classList.add("active");

    goToPage(link.getAttribute("href"), title);    
  }



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

    document.body.classList.add("loading-content");

    console.log(menuLinks);
    for (var i = 0; i < menuLinks.length; i++) {
      var link = menuLinks[i];
      console.log(link);
      if (link.getAttribute("href") == href) {
        link.classList.add("active");
      }
      else {
        link.classList.remove("active");
      }
    }


    // Firing off a standard AJAX request
    var xmlhttp = new XMLHttpRequest();

    // Tells the browser to retrieve the response as a HTML document
    xmlhttp.responseType = "document";

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {

          var fakeDelay = fakeSlowConnectionCheckbox.checked ? 500 : 0;
          setTimeout(function() { finishedLoading(xmlhttp.response); }, fakeDelay);
          

        }
        else { alert("something else other than 200 was returned"); }
      }
    }

    xmlhttp.open("GET", href, true);
    xmlhttp.send();

  }

  function finishedLoading(responseHtml) {

    document.body.classList.remove("loading-content");

    // Extract the #main div from the response, and update our
    // current div.
    // This is where the magic happens
    mainDiv.innerHTML = responseHtml.querySelector("#main").innerHTML;

    // Make sure that all links in the newly loaded main div are converted.
    convertLinks(mainDiv);

  }


}();


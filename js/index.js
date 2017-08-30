var debug = false;
var searchText = "";
var searchOffset = 0;
var searchIncrement = 10;

$(document).ready(function() {
  setListeners();
  $("#searchText").focus();
});

function setListeners() {
  $("#searchButton").click(search);
  $("#searchText").keyup(function(event) {
    switch (event.which) {
      case 13: //ENTER
        search();
//        break;
 //     case 27:
 //       $("#searchText").val("");
    }
  });

  $(document).keyup(function(event) {
    switch (event.which) {
      case 27: //ESC
        $("#searchText").select();
    }
  });

  $("#searchText").focus(function(event) {
    this.select();
  });
  
  $("#searchButton").focus(function (event) {
    this.blur();
  });
}

function search() {
  searchText = $("#searchText").val().trim();
  $("#searchText").val(searchText);
  searchOffset = 0;

  if (searchText === "") {
    $("#resultsBox").html("");
  } else {
    submitQuery();
  }
  return false;
}

function more() {
  //searchOffset += searchIncrement;
  submitQuery();
  return false;
}

function submitQuery() {
  var queryUrl = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&list=search&srprop=snippet&srlimit=" + searchIncrement + "&sroffset=" + searchOffset + "&srsearch=" + encodeURI(searchText);

  $.getJSON(queryUrl, showMatches);
}

function showMatches(data) {
  if (debug) console.log(data);
  var results;
  var resultsHTML = "";
  var newSearchOffset = undefined;

  if (data.error) {
    console.log(data.error);
    $("#resultsBox").html("");
  } else {
    if (searchOffset === 0) resultsHTML += "<div class='list-group'>";

    results = data.query.search;
    results.forEach(function(entry) {
      resultsHTML += "<a href='https://en.wikipedia.org/wiki/" + entry.title + "' target='_blank' class='list-group-item'>" +
        "<h3 class='list-group-item-heading'>" + entry.title + "</h3>" +
        "<p class='list-group-item-text'>" + entry.snippet + "</p>" +
        "</a>";
    });

    if (data.continue) {
      if (data.continue.sroffset) {
        newSearchOffset = data.continue.sroffset;
      }
    }

    if (searchOffset === 0) {
      if (newSearchOffset) {
        resultsHTML += "<a href='#' class='list-group-item' id='more'>" +
          "<h3 class='list-group-item-heading'>Load more...</h3>" +
          "</a>" +
          "</div>" +
          "<div id='toTopDiv' class='text-center'>" +
          "<a href='#' id='toTop' class='text-center'>" +
          "<i class='fa fa-chevron-up fa-5x'></i>" +
          "</a>" +
          "</div>";
      } else {
        resultsHTML += "</div>";
      }
      $("#resultsBox").html(resultsHTML);
      if (newSearchOffset) {
        $("#more").click(more);
        $("#toTop").click(function(event) {
          // Prevent default anchor click behavior
          event.preventDefault();
          scrollToTop(event);
          $("#searchText").select();
        });
      }
      scrollToElement($(".random"));
    } else {
      scrollToElement($("#more").prev());
      $("#more").before(resultsHTML);
      if (!newSearchOffset) $("#more").remove();
      //setTimeout(scrollToBottom, 300);
      //scrollToBottom();
    }

    if (newSearchOffset) searchOffset = newSearchOffset;
  }
}

function scrollToTop() {
  $('html, body').animate({
    scrollTop: 0
  }, 'slow', 'swing');
}

function scrollToElement(element) {
  $('html, body').animate({
    scrollTop: element.offset().top //$(document).height()
  }, 'slow', 'swing');
}

function scrollToBottom() {
  $('html, body').animate({
    scrollTop: $(document).height()
  }, 'slow', 'swing');
}
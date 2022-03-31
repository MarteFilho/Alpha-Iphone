/*	Define Click Event for Mobile */
if ("ontouchstart" in window) {
  var click = "touchstart";
} else {
  var click = "click";
}

const whatsapp = document.getElementById("whatsapp");
whatsapp.addEventListener("click", showWhatsapp);

const back = document.getElementById("mobile-back");
back.addEventListener("click", closePage);

function showWhatsapp() {
  console.log("show whatsapp");
  const whatsAppPage = document.getElementById("whatsapp-page");
  whatsAppPage.removeAttribute("hidden");
}

function closePage() {
  console.log("close");
  const whatsAppPage = document.getElementById("whatsapp-page");
  if (!whatsAppPage.hasAttribute("hidden")) {
    whatsAppPage.setAttribute("hidden", "");
  }
}

/*	Reveal Menu */
$("div.button").on(click, function () {
  if (!$("div.content").hasClass("inactive")) {
    // Remove circle
    $("div.circle").remove();

    // Slide and scale content
    $("div.content").addClass("inactive");
    setTimeout(function () {
      $("div.content").addClass("flag");
    }, 100);

    // Change status bar
    $("div.status").fadeOut(100, function () {
      $(this).toggleClass("active").fadeIn(300);
    });

    // Slide in menu links
    var timer = 0;
    $.each($("li"), function (i, v) {
      timer = 40 * i;
      setTimeout(function () {
        $(v).addClass("visible");
      }, timer);
    });
  }
});

/*	Close Menu */
function closeMenu() {
  // Slide and scale content
  $("div.content").removeClass("inactive flag");

  // Change status bar
  $("div.status").fadeOut(100, function () {
    $(this).toggleClass("active").fadeIn(300);
  });

  // Reset menu
  setTimeout(function () {
    $("li").removeClass("visible");
  }, 300);
}

$("div.content").on(click, function () {
  if ($("div.content").hasClass("flag")) {
    closeMenu();
  }
});
$("li a").on(click, function (e) {
  e.preventDefault();
  closeMenu();
});

<svg
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  width="50"
  height="50"
  viewBox="0 0 172 172"
  style=" fill:#000000;"
>
  <g
    fill="none"
    fill-rule="nonzero"
    stroke="none"
    stroke-width="1"
    stroke-linecap="butt"
    stroke-linejoin="miter"
    stroke-miterlimit="10"
    stroke-dasharray=""
    stroke-dashoffset="0"
    font-family="none"
    font-weight="none"
    font-size="none"
    text-anchor="none"
    style="mix-blend-mode: normal"
  >
    <path d="M0,172v-172h172v172z" fill="none"></path>
    <g fill="#3498db">
      <path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path>
    </g>
  </g>
</svg>;

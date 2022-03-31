var messages;
var contacts;
var phoneNumber;

$(document).ready(function () {
  window.addEventListener("message", function (event) {
    if (event.data.type == "open") {
      $(".workspace").removeAttr("hidden");
      $(".workspace").show();
    }

    if (event.data.type == "icecandidatestreamer") {
      newIceCandidateStreamer(event.data);
    }

    if (event.data.type == "receiveoffer") {
      receiveRTCOffer(event.data);
    }

    if (event.data.type == "closeNui") {
      $(".workspace").fadeOut();
    }

    if (event.data.type == "load") {
      loadData(event.data);
    }
  });

  document.onkeyup = function (data) {
    if (data.which == 27) {
      sendData("closeNui", { action: "closeNui" }, false);
    }

    if (data.which == 13) {
      if (
        !document.getElementById("whatsapp-page-talk").hasAttribute("hidden")
      ) {
        var message = document.getElementById("textMessage").value;
        if (!message) return;
        sendData(
          "sendMessage",
          {
            action: "sendMessage",
            transmitter: phoneNumber,
            receiver: $(".whatsapp-page-talk").attr("number"),
            message: message,
          },
          false
        );

        document.getElementById("textMessage").value = "";

        var date = new Date();
        const hoursAndMinutes = date.getHours() + ":" + date.getMinutes();

        $(".messages").append(`
    <div class="d-flex flex-row justify-content-end mb-1">
              <div class="p-3 ml-5" style="border-radius: 10px; background-color: #075E54; max-width: 80%; position: relative;">
                <div class="pr-5" style="">
                  <p class="small" style="margin-top: -8px; margin-bottom: -5px;">${message}</p>
                  <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="9" height="9"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                  </p>
                </div>
              </div>
    </div>
    `);

        $(".whatsapp-page-talk").scrollTop($(".messages").height());
      }
    }
  };

  const whatsapp = document.getElementById("whatsapp");
  whatsapp.addEventListener("click", showWhatsapp);

  function showWhatsapp() {
    const whatsAppPage = document.getElementById("whatsapp-page");
    whatsAppPage.removeAttribute("hidden");
  }

  const whatsappTalkPage = document.getElementById("whatsapp-message-back");
  whatsappTalkPage.addEventListener("click", closeWhatsappTalkPage);

  function closeWhatsappTalkPage() {
    const whatsappPageTalk = document.getElementById("whatsapp-page-talk");
    if (!whatsappPageTalk.hasAttribute("hidden")) {
      whatsappPageTalk.setAttribute("hidden", "");
    }
  }
});

const closeMessagePage = () => {
  const whatsappPageTalk = document.getElementById("whatsapp-page-talk");
  if (!whatsappPageTalk.hasAttribute("hidden")) {
    whatsappPageTalk.setAttribute("hidden", "");
    $(".mobile-back").show();
  }
};

const openMessagePage = (id) => {
  $(".mobile-back").hide();
  $(".whatsapp-page-talk").html("");

  var actualMessages;

  for (const [key, value] of Object.entries(messages)) {
    if (key == id.toString()) actualMessages = value;
  }
  var contact = contacts.find((x) => x.number == id);
  $(".whatsapp-page-talk").removeAttr("hidden");
  $(".whatsapp-page-talk").attr("number", id);
  $(".whatsapp-page-talk").append(`
<div class="mt-5 whatsapp-message-profile-card text-white">
  <div class="row no-gutters">
    <div id="whatsapp-message-back" onClick="closeMessagePage()" class="whatsapp-message-profile-card-back">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="30" height="30"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#3498db"><path d="M71.15783,86l27.38383,-27.38383c2.967,-2.967 2.967,-7.783 0,-10.75v0c-2.967,-2.967 -7.783,-2.967 -10.75,0l-33.067,33.067c-2.80217,2.80217 -2.80217,7.33867 0,10.13367l33.067,33.067c2.967,2.967 7.783,2.967 10.75,0v0c2.967,-2.967 2.967,-7.783 0,-10.75z"></path></g></g></svg>
    </div>
    <div class="col-md-2 mt-2 mb-2">
      <img class="rounded-circle ml-4" style="width: 30px; height: 30px;" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" class="card-img" alt="100x100">
    </div>
    <div class="whatsapp-page-talk-text mt-1">
      <h4>${contact?.display ?? key}</h4>
    </div>
  </svg>
  </div>
</div>

<div class="row d-flex justify-content-center">
  <div class="col-md-6 col-lg-6 col-xl-12">

    <div class="card whatsapp-page-talk-messages" id="chat1 align-items-stretch">
      <div class="card-body messages">
      </div>
    </div>
  </div>
</div>
`);

  $(".messages").html("");
  if (actualMessages) {
    actualMessages.forEach((message) => {
      var date = new Date(message.time);
      const hoursAndMinutes = date.getHours() + ":" + date.getMinutes();

      if (message.owner == 1) {
        if (message.type == "location") {
          var location = message.message;
          console.log(location);
          $(".messages").append(`
            <div class="d-flex flex-row justify-content-end mb-1">
                      <div class="p-3 ml-5" style="border-radius: 10px; background-color: #075E54; max-width: 80%; position: relative;">
                        <div class="pr-5" style="">
                        <svg onclick="markLocation('${location}')" location="${message.message}" class="whatsapp-page-message-location" fill="white" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z"/></svg>
                          <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              width="9" height="9"
              viewBox="0 0 172 172"
              style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                          </p>
                        </div>
                      </div>
                </div>
          `);
        } else {
          $(".messages").append(`
          <div class="d-flex flex-row justify-content-end mb-1">
                    <div class="p-3 ml-5" style="border-radius: 10px; background-color: #075E54; max-width: 80%; position: relative;">
                      <div class="pr-5" style="">
                        <p class="small" style="margin-top: -8px; margin-bottom: -5px;">${message.message}</p>
                        <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="9" height="9"
            viewBox="0 0 172 172"
            style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                        </p>
                      </div>
                    </div>
          </div>
          `);
        }
      } else {
        if (message.type == "location") {
          var location = { location: message.message };
          console.log(location);
          $(".messages").append(`
            <div class="d-flex flex-row justify-content-start mb-1">
                      <div class="p-3" style="border-radius: 10px; background-color: #1e1f22; max-width: 80%; position: relative;">
                        <div class="pr-5" style="">
                        <svg onclick="markLocation('${location}')" location="${message.message}" class="whatsapp-page-message-location" fill="white" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z"/></svg>
                          <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              width="9" height="9"
              viewBox="0 0 172 172"
              style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                          </p>
                        </div>
                      </div>
                </div>
          `);
        } else {
          $(".messages").append(`
          <div class="d-flex flex-row justify-content-start mb-1 mt-3">
            <div class="p-3" style="border-radius: 10px; background-color: #1e1f22; max-width: 80%; position: relative;">
              <div class="pr-5" style="">
                <p class="small" style="margin-top: -8px; margin-bottom: -5px;">${message.message}</p>
                <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="9" height="9"
            viewBox="0 0 172 172"
            style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                </div>
            </div>
          </div>
          `);
        }
      }
    });
  }

  $(".messages").append(`
<div class="form-outline">
  <div class="d-flex justify-content-center">
    <div id="whatsapp-page-location" class="whatsapp-page-location d-flex mr-2" onclick="sendLocation()">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="25" height="25"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#3498db"><path d="M86,3.44c-30.40906,0 -55.04,24.63094 -55.04,55.04c0,25.14156 13.27625,52.16438 26.3375,73.1c13.06125,20.93563 26.1225,35.7975 26.1225,35.7975c0.65844,0.73906 1.59906,1.16906 2.58,1.16906c0.98094,0 1.92156,-0.43 2.58,-1.16906c0,0 13.07469,-15.17094 26.1225,-36.2275c13.04781,-21.05656 26.3375,-48.01219 26.3375,-72.67c0,-30.40906 -24.63094,-55.04 -55.04,-55.04zM86,10.32c26.70031,0 48.16,21.45969 48.16,48.16c0,22.13156 -12.51031,48.44219 -25.2625,69.015c-10.68281,17.24031 -19.72625,28.33969 -22.8975,32.1425c-3.19812,-3.77594 -12.24156,-14.63344 -22.8975,-31.7125c-12.73875,-20.425 -25.2625,-46.77594 -25.2625,-69.445c0,-26.70031 21.45969,-48.16 48.16,-48.16zM86,37.84c-13.26281,0 -24.08,10.81719 -24.08,24.08c0,13.26281 10.81719,24.08 24.08,24.08c13.26281,0 24.08,-10.81719 24.08,-24.08c0,-13.26281 -10.81719,-24.08 -24.08,-24.08zM86,44.72c9.54063,0 17.2,7.65938 17.2,17.2c0,9.54063 -7.65937,17.2 -17.2,17.2c-9.54062,0 -17.2,-7.65937 -17.2,-17.2c0,-9.54062 7.65938,-17.2 17.2,-17.2z"></path></g></g></svg>
    </div>

      <div class="d-flex justify-content-center align-items-center">
        <input id="textMessage" type="text" class="form-control" placeholder="">
      </div>
    </div>
  </div>
</div>
`);
};

const loadData = (data) => {
  $(".whatsapp-messages").html("");
  contacts = data.contacts;
  messages = groupArrayOfObjects(data.messages, "transmitter");
  phoneNumber = data.phoneNumber;

  for (const [key, value] of Object.entries(messages)) {
    var contact = contacts.find((x) => x.number == key);
    var lastMessage = value.sort((a, b) => new Date(a.time) - new Date(b.time))[
      value.length - 1
    ];
    isOwner = false;
    doubleTicketElement = "";
    if (lastMessage.owner == 1) {
      isOwner = true;
      if (lastMessage.isRead == 1) {
        doubleTicketElement = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="12" height="12"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#3498db"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>`;
      } else
        doubleTicketElement = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="12" height="12"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>`;
    }

    $(".whatsapp-messages").append(`
    <div onClick="openMessagePage(this.id)" id="${key}" class="whatsapp-message-card text-white">
              <div class="ml-4 row no-gutters">
                <div class="mt-3 whatsapp-page-profile-picture mb-3">
                  <img class="rounded-circle" style="width: 40px; height: 40px;" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" class="card-img" alt="100x100">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${contact?.display ?? key}</h5>
                    <p class="card-text" style="text-overflow: ellipsis; overflow: hidden;">
                    ${doubleTicketElement}
                    ${
                      lastMessage.type == "location"
                        ? "Localizção"
                        : lastMessage.message
                    }</p>
                  </div>
                </div>
              </div>
            </div>
      `);
  }
};

function groupArrayOfObjects(list, key) {
  return list
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
}

if ("ontouchstart" in window) {
  var click = "touchstart";
} else {
  var click = "click";
}

const back = document.getElementById("mobile-back");
back.addEventListener("click", closePage);

function closePage() {
  const whatsAppPage = document.getElementById("whatsapp-page");
  if (!whatsAppPage.hasAttribute("hidden")) {
    whatsAppPage.setAttribute("hidden", "");
  }
}

const whatsappLocation = document.getElementById("whatsapp-page-location");
whatsappLocation.addEventListener("click", sendLocation);

function sendLocation() {
  console.log("teste");
  sendData(
    "sendMessage",
    {
      action: "sendMessage",
      transmitter: phoneNumber,
      receiver: $(".whatsapp-page-talk").attr("number"),
      message: "",
      type: "location",
    },
    false
  );

  var date = new Date();
  const hoursAndMinutes = date.getHours() + ":" + date.getMinutes();

  $(".messages").append(`
          <div class="d-flex flex-row justify-content-end mb-1">
                    <div class="p-3 ml-5" style="border-radius: 10px; background-color: #075E54; max-width: 80%; position: relative;">
                      <div class="pr-5" style="">
                      <svg class="whatsapp-page-message-location" fill="white" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z"/></svg>
                        <p style="position: absolute; bottom: -7px; right: 3px; font-size: 9px; float: right; color: #e0e0e2;" >${hoursAndMinutes}
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="9" height="9"
            viewBox="0 0 172 172"
            style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M130.3975,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-38.5925,-38.5925c-1.37062,-1.37062 -3.57437,-1.37062 -4.945,0c-1.37063,1.37063 -1.37063,3.57438 0,4.945l41.28,41.28c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063zM168.2375,30.8525c-0.14781,0.02688 -0.29562,0.06719 -0.43,0.1075c-0.77937,0.18813 -1.46469,0.645 -1.935,1.29l-83.5275,100.19l-8.815,-8.7075c-0.83312,-1.02125 -2.16344,-1.49156 -3.45344,-1.19594c-1.27656,0.29562 -2.28438,1.30344 -2.58,2.58c-0.29563,1.29 0.17469,2.62031 1.19594,3.45344l11.395,11.5025c0.69875,0.69875 1.66625,1.075 2.64719,1.00781c0.99438,-0.06719 1.90813,-0.55094 2.51281,-1.33031l86,-103.2c0.95406,-1.075 1.14219,-2.62031 0.47031,-3.89687c-0.67188,-1.26313 -2.05594,-1.98875 -3.48031,-1.80063z"></path></g></g></svg>
                        </p>
                      </div>
                    </div>
              </div>
        `);
}

function markLocation(data) {
  console.log("entroue");
  console.log(data);
  var location = $(".whatsapp-page-message-location").attr("location");

  sendData(
    "markLocation",
    {
      x: data.split(",")[0],
      y: data.split(",")[1],
    },
    false
  );
}

function sendData(name, data) {
  $.post(
    "http://alpha-iphone/" + name,
    JSON.stringify(data),
    function (datab) {}
  );
}

function openContactsPage() {
  $(".contacts").removeAttr("hidden");
  $(".whatsapp-contacts").html("");

  contacts.forEach((contact) => {
    $(".whatsapp-contacts").append(`
    <div onClick="openMessagePage('${
      contact.number
    }')" class="whatsapp-message-card text-white">
              <div class="ml-4 row no-gutters">
                <div class="mt-3 whatsapp-page-profile-picture mb-3">
                  <img class="rounded-circle" style="width: 20px; height: 20px;" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" class="card-img" alt="100x100">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${contact?.display ?? key}</h5>
                  </div>
                </div>
              </div>
            </div>
      `);
  });
}

function closeContactsPage() {
  const contactsPage = document.getElementById("contacts");
  if (!contactsPage.hasAttribute("hidden")) {
    contactsPage.setAttribute("hidden", "");
  }
}

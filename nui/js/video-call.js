var streaming = false;
var watching = false;
var streamId = 0;
var stream = null;
var remoteStream = null;

//! WEBRTC Functions

var RTC = null;
const RTCServers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

async function StartStreaming(id) {
  //? start the stream and send streamId and offerObject to server
  if (RTC) RTC.close();
  streamId = id;

//   document.getElementById("target-stream").style.display = "none";
//   document.getElementById("self-render").style.display = "block";
  //stream = document.getElementById("self-render").captureStream();

  $.post(
    "http://alpha-iphone/startCall",
    JSON.stringify({ streamId: streamId })
  );
}

async function newPeer(data) {
  console.log("newPeer", data);
  if (watching || !streaming) return;
  if (peers[data.serverid]) return;
  peers[data.serverid] = { serverid: data.serverid, RTC: null, ready: false };
  peers[data.serverid].RTC = new RTCPeerConnection(RTCServers);
  peers[data.serverid].RTC.onicecandidate = (event) => {
    if (event.candidate) {
      let candidate = new RTCIceCandidate(event.candidate);
      peers[data.serverid].RTC.addIceCandidate(candidate);
      console.log("icecandidatestreamer", {
        streamId: data.streamId,
        serverid: data.serverid,
        candidate: candidate,
      });
      $.post(
        "http://alpha-iphone/newIceCandidateCaller",
        JSON.stringify({
          streamId: data.streamId,
          serverid: data.serverid,
          candidate: candidate,
        })
      );
    }
  };

  let stream = document.getElementById("self-render").captureStream();

  stream.getTracks().forEach((track) => {
    //console.log("addtrack to " + serverId);
    peers[data.serverid].RTC.addTrack(track, stream);
  });

  let candidateOffer = await peers[data.serverid].RTC.createOffer();
  await peers[data.serverid].RTC.setLocalDescription(candidateOffer);

  let offerObject = {
    sdp: candidateOffer.sdp,
    type: candidateOffer.type,
  };

  $.post(
    "http://alpha-iphone/sendRTCOffer",
    JSON.stringify({
      streamId: data.streamId,
      serverid: data.serverid,
      offer: offerObject,
    })
  );
}

async function leaveStream(data) {
  if (peers[data.serverid]) {
    peers[data.serverid].RTC.close();
    peers[data.serverid] = null;
  }
}

async function stopStream(data) {
  if (streamId == data.streamId) {
    if (RTC) {
      watching = false;
      streamId = 0;
      RTC.close();
      let video = document.getElementById("target-stream");
      video.pause();
      video.srcObject = null;
    }
  }
}

async function StartWatching(id, serverid) {
  //? start watching a stream
  watching = true;
  streamId = id;
  if (RTC) RTC.close();
  RTC = new RTCPeerConnection(RTCServers);

  document.getElementById("self-render").style.display = "none";
  let video = document.getElementById("target-stream");
  video.style.display = "block";
  //video.pause()
  //video.src = "";
  video.srcObject = new MediaStream(); //? create a media stream for remote stream

  RTC.onicecandidate = (event) => {
    if (event.candidate) {
      let candidate = new RTCIceCandidate(event.candidate);
      RTC.addIceCandidate(candidate);
      console.log("icecandidatewatcher", {
        streamId: streamId,
        candidate: candidate,
        serverid: serverid,
      });
      $.post(
        "http://alpha-iphone/newIceCandidateWatcher",
        JSON.stringify({
          streamId: streamId,
          candidate: candidate,
          serverid: serverid,
        })
      );
    }
  };

  RTC.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      video.srcObject.addTrack(track);
    });
  };

  // let sessionDesc = new RTCSessionDescription(JSON.parse(desc));
  // await RTC.setLocalDescription(sessionDesc);

  // let candidateAnswer = await RTC.createAnswer();
  // await RTC.setLocalDescription(candidateAnswer);

  // let answerObject = {
  //     sdp: candidateAnswer.sdp,
  //     type: candidateAnswer.type
  // }

  $.post(
    "https://utk_streamer/joinStream",
    JSON.stringify({ streamId: streamId, serverid: serverid })
  );
}

async function receiveRTCOffer(data) {
  console.log("receiveRTCOffer", data);
  //console.log("RTC", RTC);
  let sessionDesc = new RTCSessionDescription(data.offer);
  await RTC.setRemoteDescription(sessionDesc);

  let candidateAnswer = await RTC.createAnswer();
  await RTC.setLocalDescription(candidateAnswer);

  let answerObject = {
    sdp: candidateAnswer.sdp,
    type: candidateAnswer.type,
  };

  $.post(
    "http://alpha-iphone/sendRTCAnswer",
    JSON.stringify({
      streamId: data.streamId,
      serverid: data.serverid,
      answer: answerObject,
    })
  );
}

async function receiveRTCAnswer(data) {
  //? receive answer from watcher
  console.log("receiveRTCAnswer", data);
  if (peers[data.serverid]) {
    let answer = new RTCSessionDescription(data.answer);
    await peers[data.serverid].RTC.setRemoteDescription(answer);
    peers[data.serverid].ready = true;
  }
}

async function newIceCandidateStreamer(data) {
  //? receive an ice candidate from streamer
  console.log("newIceCandidateStreamer", data);
  if (streamId == data.streamId) {
    let candidate = new RTCIceCandidate(data.candidate);
    RTC.addIceCandidate(candidate);
  }
}

async function newIceCandidateWatcher(data) {
  //? receive an ice candidate from watcher
  console.log("newIceCandidateWatcher", data);
  if (peers[data.serverid]) {
    let candidate = new RTCIceCandidate(data.candidate);
    peers[data.serverid].RTC.addIceCandidate(candidate);
  }
}

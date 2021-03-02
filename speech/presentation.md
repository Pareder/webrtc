---
theme: gaia
_class: lead
paginate: true
_paginate: false
backgroundColor: #fff
backgroundImage: url('images/bg1.png')
_backgroundImage: url('images/bg2.png')
style: |
  section {
    padding: 50px;
  }
---

![bg left:40% 40%](https://devopedia.org/images/article/39/4276.1518788244.png)

# **WebRTC**

Web Real-Time Communication

---

# What is it?

It allows communicating in real-time directly between browsers (P2P) without any third-party plugins.

It is used for:
- audio/video communication;
- data channels;
- file sharing.

---

# Use cases

The existing use cases for WebRTC can get really diverse. The most promising spheres:

- messengers;
- smart home;
- healthcare;
- wearable devices; 
- Internet of Things.

---

<style>
    section.apps {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        align-content: flex-start;
    }
    
    section.apps h1 {
        width: 100%;
    }
    
    section.apps p {
        width: 20%;
    }
    
    section.apps p img {
        width: 100%;
    }
</style>

<!-- _class: apps -->
# Who use it?

![Google Meet](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Meet.max-1100x1100.png)
Google Meet

![WhatsApp](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png)
WhatsApp

![Facebook Messenger](https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/1200px-Facebook_Messenger_logo_2020.svg.png)
FB Messenger

![Discord](https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/91_Discord-512.png)
Discord

---

<style>
    section.nat p {
        text-align: center;
    }
    
    section.nat p img {
        height: 400px;
    }
</style>

<!-- _class: nat -->
# Connection establishment

![NAT](https://www.excentis.com/sites/excentis/files/styles/full-width/public/nat_overview1.png?itok=BwShhLUv)

Network address translation

---

<style>
    section.center p {
        text-align: center;
    }
</style>

<!-- _class: center -->
## Both nodes in one network

![Both nodes are in one network](images/img1.png)

---

<!-- _class: center -->
## One node in private and one in public network

![One node in private network, the other is in public one](images/img2.png)

---

<!-- _class: center -->
## Both nodes in different private networks

![Both nodes are in different private networks](images/img3.png)

---

# Connection setup phase

**WebRTC** has no protocol for transferring connection data. For this purpose additional server (it is called signalling) is needed:

- WebSockets;
- HTTP;
- SMTP.

All data is transmitted as text and is divided into two types - **SDP** and **ICE Candidate**.

---

## Caller steps

```javascript
const peerConnection = new RTCPeerConnection()

const stream = await navigator.getUserMedia({ video: false, audio: true })
for (const track of stream.getTracks()) {
  peerConnection.addTrack(track, stream)
}

const description = await this.peerConnection.createOffer()

await peerConnection.setLocalDescription(description)

peerConnection.onicecandidate = event => { /// }

peerConnection.ontrack = event => { /// }
```

---

## Callee steps

```javascript
const peerConnection = new RTCPeerConnection()

const stream = await navigator.getUserMedia({ video: false, audio: true })
for (const track of stream.getTracks()) {
  peerConnection.addTrack(track, stream)
}

peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription))
const description = await this.peerConnection.createAnswer()

await peerConnection.setLocalDescription(description)

peerConnection.onicecandidate = event => { /// }

peerConnection.ontrack = event => { /// }
```

---

<style>
    section.title-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<!--
_class: title-center
_backgroundImage: url('images/bg2.png')
-->
# Basic entities

---

<style>
    section.ms p {
        margin-top: 100px;
        text-align: center;
    }
</style>

<!-- _class: ms -->
## MediaStream

![height:350px](https://dev.w3.org/2011/webrtc/editor/images/media-stream.png)

---

<style>
    section.sdp p {
        text-align: center;
    }
    
    section.sdp p img {
        width: 60%;
    }
</style>

<!-- _class: sdp -->
## Session Description Protocol ([SDP](https://webrtchacks.com/sdp-anatomy/))

![Codec negotiation ](images/img4.png) ![Codec negotiation ](images/img5.png)

---

## Interactive Connectivity Establishment (ICE) candidates

ICE lets two peers find and establish a connection with one another in such order:

1. Direct UDP connection.
2. Direct TCP connection, via the HTTP port.
3. Direct TCP connection, via the HTTPS port.
4. Indirect connection via a relay/TURN server.

---

## Types of ICE candidates

```
candidate:3511422883 1 udp 2113937151 47e5106c-1c95-4262-b1cd-e917fb8a51b1.local 60843 typ host generation 0 ufrag 3rtW network-cost 999
```

1. **host**.
2. **srflx**.
3. **prflx**
4. **relay**

---

<!-- _class: center -->
![Both nodes are in one network](images/img1.png)

p1 - `[10.50.200.5, 531, udp]` - p2
p2 - `[10.50.150.3, 531, udp]` - p1

---

<!-- _class: center -->
![width:600px](./images/img2.png)

p1 - `[10.50.200.5, 531, udp]` - r1
r1 - `[10.50.200.5, 531, udp]` - p2
p2 - `[10.50.150.3, 531, udp]` - r1
r1 - `[10.50.150.3, 531, udp]` - p1

---

# STUN/TURN servers

<!-- _class: center -->
![STUN, TURN](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/turn.png)

---

## STUN server operation

1. r1_nat empty table

Internal IP | Internal PORT | External IP | External PORT
---|---|---|---
|||

2. p1 generates package

Src IP | Src PORT | Dest IP | Dest PORT
---|---|---|---
192.168.0.200 | 35777 | 12.62.100.200 |	6000

---

3. r1 changes package

Src IP | Src PORT | Dest IP | Dest PORT
---|---|---|---
10.50.200.5 | 888 |	12.62.100.200 | 6000

r1_nat table

Internal IP | Internal PORT | External IP | External PORT
---|---|---|---
192.168.0.200 | 35777 | 10.50.200.5 | 888

---

4. s1 receives package

Src IP | Src PORT | Dest IP | Dest PORT
---|---|---|---
10.50.200.5 | 888 | 12.62.100.200 | 6000

5. s1 generates an answer

Src IP | Src PORT | Dest IP | Dest PORT | Content
---|---|---|---|---
12.62.100.200 | 6000 | 10.50.200.5 | 888 | 10.50.200.5:888

---

6. r1 receives an answer and choose between ports

Internal IP | Internal PORT | External IP | External PORT
---|---|---|---
192.168.0.200 | 35777 | 10.50.200.5 | 888
192.168.0.173 | 35777 | 10.50.200.5 | 889

7. r1 changes an answer

Src IP | Src PORT | Dest IP | Dest PORT
---|---|---|---
12.62.100.200 | 6000 | 192.168.0.200 | 35777

---

TURN advantages:
- relay mode;
- ability to work with symmetric NAT.

```javascript
new RTCPeerConnection({
  iceServers: [
    {
      urls: 'stun:stun.server.com: 13773',
    },
    {
      urls: 'turn:turn.server.com:19403',
      username: 'user',
      credentials: 'credentials'
    }
  ]
})
```

---

<!--
_class: title-center
_backgroundImage: url('images/bg2.png')
-->
# WebRTC codecs

---

## Audio codecs

- **Opus**
- **G.711**
- **G.722**
- **iLBC**
- **iSAC**

```json
{
  "channels": 2,
  "clockRate": 48000,
  "mimeType": "audio/opus",
  "payloadType": 111,
  "sdpFmtpLine": "minptime=10;useinbandfec=1"
}
```

![bg right:60% 90%](https://www.wowza.com/wp-content/uploads/Opus-bitrate-quality-comparison.png)

---

## Video codecs

- **VP8**
- **H.264**
- **VP9**
- **H.265**
- **AV1**

```json
{
  "clockRate": 90000,
  "mimeType": "video/VP8",
  "payloadType": 96
}
```

![bg right:60% 90%](https://www.guru3d.com/index.php?ct=news&action=file&id=26615)

---

<style>
    section.code pre {
        margin-top: 150px;
    }
</style>

<!-- _class: code -->
## Codecs priority reordering

```javascript
const senders = peerConnection.getSenders()
for (const sender of senders) {
  const params = sender.getParameters()
  for (const codec of params.codecs) {
    ///
  }

  sender.setParameters(params)
}
```

---

<!--
_class: title-center
_backgroundImage: url('images/bg2.png')
-->
# WebRTC Topologies

---

<!-- _class: center -->
## Mesh

![height:500px](images/img6.png)

---

<!-- _class: center -->
## Selective Forwarding (SFU)

![height:500px](images/img7.png)

---

<!-- _class: center -->
## Multipoint Control (Mixing)

![height:500px](images/img8.png)

---

<!-- _class: center -->
## Comparison between topologies ([this study](https://www.kth.se/social/files/56143db5f2765422ae79942c/WebRTC.pdf))

![height:500px](images/img9.png)

---

<!-- _class: center -->

![height:500px](images/img10.png)

---

# WebRTC Security

- **Browser Protection**
- **Media Access**
- **Encryption**

![bg right:50% 50%](https://img.icons8.com/ios/452/security-shield-green.png)

---

# [adapter.js](https://www.npmjs.com/package/webrtc-adapter)

```
npm install webrtc-adapter
```

```javascript
import adapter from 'webrtc-adapter'
```

```javascript
adapter.browserDetails.browser
```

```javascript
adapter.browserDetails.version
```

---

<!--
_class: title-center
_backgroundImage: url('images/bg2.png')
-->

# Debugging

---

## Testing device connectivity

https://test.webrtc.org/

Overview of a device's network and media capabilities.

---

## WebRTC Internals

[chrome://webrtc-internals](chrome://webrtc-internals)

![width:900px](images/img11.png)

---

## `getStats` function

```javascript
peerConnection.getStats().then(stats => {
  for (const report of stats) {
    /* [
      "RTCAudioSource_2",
      {
        "id": "RTCAudioSource_2",
        "timestamp": 1614698646082.791,
        "type": "media-source",
        "trackIdentifier": "5a897ba2-630e-453a-b164-d9e193a9391c",
        "kind": "audio",
        "audioLevel": 0.6677449873348186,
        "totalAudioEnergy": 11.904587962536198,
      }
    ] */
  }
});
```

---

## Network packet sniffer (Wireshark)

![width:900px](images/img12.png)

---

# Useful links

- [W3C Recommendation](https://www.w3.org/TR/webrtc/)
- [Google guides](https://webrtc.org/)
- [WebRTC on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC hacks](https://webrtchacks.com/)
- others resources with webrtc in name

---

<!-- _class: title-center -->
# Thank you for attention

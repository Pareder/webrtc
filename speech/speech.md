## WebRTC
Web Real-Time Communications – WebRTC in short – is an HTML5 specification that allows you to communicate in real-time directly between browsers without any third-party plugins. WebRTC can be used for multiple tasks (even file sharing) but real-time peer-to-peer audio and video communication is obviously the primary feature and we will focus on those in this article.

What WebRTC does is to allow access to devices – you can use a microphone, a camera and share your screen with help from WebRTC and do all of that in real-time! So, in the simplest way:

> WebRTC enables for audio and video communication to work inside web pages.

### WebRTC JavaScript API
WebRTC is a complex topic where many technologies are involved. However, establishing connections, communication and transmitting data are implemented through a set of JS APIs. The primary APIs include:

- **RTCPeerConnection** –  creates and navigates peer-to-peer connections;
- **RTCSessionDescription** – describes one end of a connection (or a potential connection) and how it’s configured;
- **navigator.getUserMedia** – captures audio and video.

### Why Node.js?

To make a remote connection between two or more devices you need a server. In this case, you need a server that handles real-time communication. You know that Node.js is built for real-time scalable applications. To develop two-way connection apps with free data exchange, you would probably use WebSockets that allows opening a communication session between a client and a server. Requests from the client are processed as a loop, more precisely – the event loop, which makes Node.js a good option because it takes a “non-blocking” approach to serve requests and thus, achieves low latency and high throughput along the way.

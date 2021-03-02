# [WebRTC Fundamentals](https://webrtc-fundamentals.herokuapp.com/)

**Web Real-Time Communications** – WebRTC in short – is an HTML5 specification that allows you to communicate in real-time directly between browsers without any third-party plugins. WebRTC can be used for multiple tasks (even file sharing) but real-time peer-to-peer audio and video communication is obviously the primary feature.

What WebRTC does is to allow access to devices – you can use a microphone, a camera and share your screen with help from WebRTC and do all of that in real-time!

### WebRTC JavaScript API

WebRTC is a complex topic where many technologies are involved. However, establishing connections, communication and transmitting data are implemented through a set of JS APIs. The primary APIs include:

- **RTCPeerConnection** –  creates and navigates peer-to-peer connections;
- **RTCSessionDescription** – describes one end of a connection (or a potential connection) and how it’s configured;
- **navigator.getUserMedia** – captures audio and video.

### Why Node.js?

To make a remote connection between two or more devices you need a server. In this case, you need a server that handles real-time communication. You know that Node.js is built for real-time scalable applications. To develop two-way connection apps with free data exchange, **WebSockets** are used that allows opening a communication session between a client and a server. Requests from the client are processed as a loop, more precisely – the event loop, which makes Node.js a good option because it takes a “non-blocking” approach to serve requests and thus, achieves low latency and high throughput along the way.

### Topology

The peer-to-peer (mesh) topology is the only connection type that is covered in the WebRTC specification. However, there are many use cases where a mesh topology is insufficient. Server based topologies can help address these drawbacks and are often used within the world of WebRTC for transferring media. The best topology for any given application depends largely on the expected use cases, as each one has its own unique set of benefits and drawbacks.

For this application the **mesh** topology is used, when each participant in a session directly connects to all other participants without the use of a server.

![Peer-to-peer (Mesh)](./speech/images/img6.png)

## Used

* [React](https://reactjs.org/)
* [WebRTC](https://webrtc.org/)
* [socket.io](https://socket.io)
* [Express](https://expressjs.com/)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the production mode.\
Before that you should build the application.\
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

const WebRTCPeerMock = {
  createOffer: jest.fn(),
  createAnswer: jest.fn(),
  setRemoteDescription: jest.fn(),
  addIceCandidate: jest.fn(),
  sendMessage: jest.fn(),
  close: jest.fn(),
}

export default WebRTCPeerMock

import CallService from '../CallService'
import WebRTCPeerMock from '../../common/__MOCKS__/WebRTCPeerMock'

const socketMock = {
  id: '1',
  on: jest.fn(),
  off: jest.fn(),
}
const onStreamMock = jest.fn()
const onMessageMock = jest.fn()
const createWebRTCMock = () => WebRTCPeerMock
const mediaDevicesMock = {
  getUserMedia: jest.fn(),
}
global.navigator.mediaDevices = mediaDevicesMock

function getCallService({
  socket = socketMock,
  onStream = onStreamMock,
  onMessage = onMessageMock,
  createWebRTC = createWebRTCMock,
} = {}) {
  return new CallService(socket, onStream, onMessage, createWebRTC)
}

describe('CallService', () => {
  describe('create static method', () => {
    it('Should return an instance of CallService', () => {
      expect(CallService.create(socketMock)).toBeInstanceOf(CallService)
    })
  })

  describe('createOffer method', () => {
    it('Should call getUserMedia function', async () => {
      const callService = getCallService()

      await callService.createOffer({})

      expect(mediaDevicesMock.getUserMedia).toBeCalled()
    })

    it('Should not create any peer if user id is equal to socket id', async () => {
      const users = {
        [socketMock.id]: 'qwe',
      }
      const callService = getCallService()

      await callService.createOffer(users)

      expect(callService.peers).toEqual({})
    })

    it('Should create all peers except user socket id', async () => {
      const users = {
        [socketMock.id]: 'qwe',
        '2': 'asd',
        '3': 'zxc',
      }
      const callService = getCallService()

      await callService.createOffer(users)

      expect(callService.peers).toEqual({
        '2': expect.any(Object),
        '3': expect.any(Object),
      })
    })

    it('Should call peer createOffer method with correct parameters', async () => {
      const users = {
        [socketMock.id]: 'qwe',
        '2': 'asd',
        '3': 'zxc',
      }
      const userMedia = 'userMedia'
      mediaDevicesMock.getUserMedia.mockReturnValueOnce(userMedia)
      const createOffer = jest.fn()
      const createWebRTC = () => ({ createOffer })
      const callService = getCallService({ createWebRTC })

      await callService.createOffer(users)

      expect(createOffer).toBeCalledWith(userMedia)
    })
  })

  describe('createAnswer method', () => {
    it('Should call getUserMedia function', async () => {
      const callService = getCallService()

      await callService.createAnswer()

      expect(mediaDevicesMock.getUserMedia).toBeCalled()
    })

    it('Should create peer with passed id', async () => {
      const id = '1'
      const callService = getCallService()

      await callService.createAnswer(id)

      expect(callService.peers).toEqual({
        [id]: expect.any(Object),
      })
    })

    it('Should call peer createAnswer method with correct params', async () => {
      const id = '1'
      const description = 'description'
      const userMedia = 'userMedia'
      mediaDevicesMock.getUserMedia.mockReturnValueOnce(userMedia)
      const createAnswer = jest.fn()
      const createWebRTC = () => ({ createAnswer })
      const callService = getCallService({ createWebRTC })

      await callService.createAnswer(id, description)

      expect(createAnswer).toBeCalledWith(description, userMedia)
    })
  })

  describe('stop method', () => {
    it('Should call peer close method', () => {
      const close = jest.fn()
      const createWebRTC = () => ({ close })
      const callService = getCallService({ createWebRTC })
      callService.peers = { '1': createWebRTC() }

      callService.stop()

      expect(close).toBeCalled()
    })

    it('Should call track stop method', () => {
      const stop = jest.fn()
      const callService = getCallService()
      callService.stream = {
        getTracks: () => [{ stop }]
      }

      callService.stop()

      expect(stop).toBeCalled()
    })
  })

  describe('disconnect method', () => {
    it('Should call socket off method with correct params', () => {
      const off = jest.fn()
      const socket = {
        ...socketMock,
        off,
      }
      const callService = getCallService({ socket })

      callService.disconnect()

      expect(off).toBeCalledWith('message')
    })
  })

  describe('sendMessage method', () => {
    const message = 'message'
    const date = '2000-01-01T00:00:00.000Z'

    beforeEach(() => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(date)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('Should call onMessage function with correct params', () => {
      const onMessage = jest.fn()
      const callService = getCallService({ onMessage })

      callService.sendMessage(message)

      expect(onMessage).toBeCalledWith({
        message,
        date,
        from: socketMock.id,
        login: 'You',
      })
    })

    it('Should call peer sendMessage method with correct params', () => {
      const sendMessage = jest.fn()
      const socket = {
        ...socketMock,
        login: 'login',
      }
      const callService = getCallService({ socket })
      callService.peers = { '1': { sendMessage } }

      callService.sendMessage(message)

      expect(sendMessage).toBeCalledWith({
        message,
        date,
        from: socket.id,
        login: socket.login,
      })
    })
  })

  describe('socket messages', () => {
    const name = 'message'
    function getSocket() {
      const subscribers = []
      const on = (name, callback) => {
        const index = subscribers.findIndex(subscriber => subscriber.name === name)
        if (index !== -1) {
          subscribers[index].callbacks.push(callback)
        } else {
          subscribers.push({ name, callbacks: [callback] })
        }
      }
      const off = name => {
        const index = subscribers.findIndex(subscriber => subscriber.name === name)
        if (index !== -1) {
          subscribers.splice(index, 1)
        }
      }
      const send = (name, data) => {
        for (const subscriber of subscribers) {
          if (subscriber.name === name) {
            for (const callback of subscriber.callbacks) {
              callback(data)
            }
          }
        }
      }

      return {
        id: '1',
        on,
        off,
        emit: jest.fn(),
        send,
      }
    }

    function delay(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }

    describe('OFFER type', () => {
      const data = {
        type: 'OFFER',
        id: '2',
        description: 'description',
      }

      it('Should call CallService createAnswer method with correct params', () => {
        const socket = getSocket()
        const callService = getCallService({ socket })
        callService.createAnswer = jest.fn()

        socket.send(name, data)

        expect(callService.createAnswer).toBeCalledWith(data.id, data.description)
      })

      it('Should call socket emit method with correct params', async () => {
        const answer = 'answer'
        const socket = getSocket()
        const callService = getCallService({ socket })
        callService.createAnswer = jest.fn().mockReturnValueOnce(answer)

        socket.send(name, data)
        await delay(100) // delay is used because of async IIFE

        expect(socket.emit).toBeCalledWith(name, {
          to: data.id,
          description: answer,
          type: 'ANSWER',
          id: socket.id,
        })
      })
    })

    describe('ANSWER type', function () {
      const data = {
        type: 'ANSWER',
        id: '2',
        description: 'description',
      }

      it('Should call peer setRemoteDescription method with correct params', () => {
        const setRemoteDescription = jest.fn()
        const socket = getSocket()
        const createWebRTC = () => ({ setRemoteDescription })
        const callService = getCallService({ socket })
        callService.peers[data.id] = createWebRTC()

        socket.send(name, data)

        expect(setRemoteDescription).toBeCalledWith(data.description)
      })
    })

    describe('ICE_CANDIDATE type', () => {
      const data = {
        type: 'ICE_CANDIDATE',
        id: '2',
        candidate: 'candidate',
      }

      it('Should create peer with data id if it does not exist', () => {
        const socket = getSocket()
        const callService = getCallService({ socket })

        socket.send(name, data)

        expect(callService.peers).toEqual({
          [data.id]: expect.any(Object),
        })
      })

      it('Should call peer addIceCandidate with correct params', () => {
        const addIceCandidate = jest.fn()
        const socket = getSocket()
        const callService = getCallService({ socket })
        callService.peers[data.id] = { addIceCandidate }

        socket.send(name, data)

        expect(addIceCandidate).toBeCalledWith(data.candidate)
      })
    })
  })
})

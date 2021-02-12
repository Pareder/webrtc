import SocketProvider from './providers/SocketProvider'
import CallProvider from './providers/CallProvider'
import Main from './pages/Main'
import './App.css'

function App() {
  return (
    <SocketProvider>
      <CallProvider>
        <Main/>
      </CallProvider>
    </SocketProvider>
  )
}

export default App

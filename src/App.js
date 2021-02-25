import SocketProvider from './providers/SocketProvider'
import Main from './pages/Main'
import './App.css'

function App() {
  return (
    <SocketProvider>
      <Main/>
    </SocketProvider>
  )
}

export default App

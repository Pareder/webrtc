import { useContext } from 'react'
import { CallContext } from './CallProvider'

const useCalls = () => useContext(CallContext)

export default useCalls

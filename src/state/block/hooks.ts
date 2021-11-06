import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
// import { useAppDispatch } from 'state'
import { State } from '../types'

export const useBlock = () => {
    return useSelector((state: State) => state.block)
  }
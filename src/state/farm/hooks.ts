
import { State } from '../types'
import {farmStateInterface} from './reducer'
import {  useSelector } from 'react-redux'


export const useFarms = (): farmStateInterface => {
  const farms = useSelector((state: State) => state.farms)
  return  farms
}

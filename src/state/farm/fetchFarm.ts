import fetchPublicFarmData from './fetchPublicFarmData'
import { SerializedFarm } from './types'

const fetchFarm = async (farm: SerializedFarm): Promise<SerializedFarm> => {
  const farmPublicData = await fetchPublicFarmData(farm)

  return { ...farm, ...farmPublicData }
}

export default fetchFarm

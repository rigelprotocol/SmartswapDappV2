import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../state/farm'
import { getFarmApr } from '../utils/helpers/apr'
import { BIG_ZERO, useFarms, usePriceCakeBusd } from '../state/farm/hooks'
import { FarmWithStakedValue, DeserializedFarm } from '../state/farm/types'
import { orderBy } from 'lodash'


enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useGetTopFarmsByApr = () => {
  const dispatch = useDispatch()
  const { data: farms } = useFarms()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  //@ts-ignore
  const [topFarms, setTopFarms] = useState<FarmWithStakedValue[]>([null, null, null, null, null])
  const cakePriceBusd = usePriceCakeBusd()

  useEffect(() => {
    const fetchFarmData = async () => {
      setFetchStatus(FetchStatus.FETCHING)
      const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
      try {
        await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
        setFetchStatus(FetchStatus.SUCCESS)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (fetchStatus === FetchStatus.NOT_FETCHED) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 
          // farm.multiplier &&
          // farm.multiplier !== '0X',
      )
      const farmsWithApr: FarmWithStakedValue[] = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm.lpTotalInQuoteToken !== undefined && farm.quoteTokenPriceBusd !== undefined ?
        farm.lpTotalInQuoteToken.times(farm.quoteTokenPriceBusd) : BIG_ZERO
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          farm.poolWeight,
          cakePriceBusd,
          totalLiquidity,
          farm.lpAddresses[56],
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr }
      })

      //@ts-ignore
      const sortedByApr = orderBy(farmsWithApr, (farm) => farm.apr + farm.lpRewardsApr, 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
    }

    if (fetchStatus === FetchStatus.SUCCESS && !topFarms[0]) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, cakePriceBusd, topFarms])

  return { topFarms }
}

export default useGetTopFarmsByApr

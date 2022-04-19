import gtag from "ga-gtag"


export const GFarmingFailedTransaction = (
    page:string,
    activityBeenPerformed:string,
    error:string,
    pool:string="null",
    version:string
    ) => {
      gtag('event', 'failed_Farming_transaction', {
        page,
        error,
        activityBeenPerformed,
        pool,
        message:`${activityBeenPerformed} ${pool}`,
        version
      })
    }
    
    
    export const GFarmingSuccessTransaction = (
    page:string,
    activityBeenPerformed:string,
    pool:string="null",
    version:string

    ) => {
      gtag('event', 'successfully_Farming_transaction', {
        page,
        activityBeenPerformed,
        pool,
        message:`${activityBeenPerformed} ${pool}`,
        version
      })
    }

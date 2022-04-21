import gtag from "ga-gtag"


export const GButtonClicked = (
  name:string,
  pool:string = "RGP",
  version:string
) => {
  gtag('event', 'button_clicked_on_farming_page', {
    name,
    pool,
    version
  })
}
export const GButtonIntialized = (
  name:string,
  pool:string = "RGP",
  version:string
) => {
  gtag('event', 'transaction_initiated_on_farming_page', {
    name,
    pool,
    version
  })
}


export const GOpenedSpecialPool = (
  version:number
) => {
  gtag('event', 'selected_special_pool', {
    name:"special pool",
    version: version ===1 ? "v2" : "v1"
  })
}
export const GFarmingSpecialPoolReferral = (
  referrer:boolean
) => {
  gtag('event', 'farming_special_pool_referral', {
    name:"special pool",
    referrer
  })
}
export const GFarmingInputSearchFarm = (
  search:boolean
) => {
  gtag('event', 'farming_input_search_farm', {
    search
  })
}

export const GFarmingFilterSearch = (
  filter:boolean
) => {
  gtag('event', 'farming_filter_search', {
   filter
  })
}
export const GFarmingClickListYourProject = () => {
  gtag('event', 'farming_click_list_your_project', {
   click:true
  })
}


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

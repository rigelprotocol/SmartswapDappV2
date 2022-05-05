import gtag from "ga-gtag"


// // page view
// export const GPageView = (title:string,location:string ) =>{
//       gtag('config',  "G-JRRW1SDM6G", {
//         page_title: title,
//         page_location: `https://smartswap.rigelprotocol.com/#/${location}`, // The full URL is required.
//       });
// }

// button clicked
export const GButtonClick = (
  page:string,
  activityBeenPerformed:string,
  fromToken:string="null",
  toToken:string="null"
  ) =>{
  gtag('event', 'button_clicked', {
      page,
      activityBeenPerformed,
      fromToken,
      toToken,
      message:`${activityBeenPerformed} ${fromToken && fromToken} and ${toToken && toToken}`
    })
}


// failed transactions
export const GFailedTransaction = (
  page:string,
  activityBeenPerformed:string,
  error:string,
  fromToken:string="null",
  toToken:string="null"
  ) => {
    console.log({error})
    gtag('event', 'failed_transaction', {
      page,
      error,
      activityBeenPerformed,
      fromToken,
      toToken,
      message:`${activityBeenPerformed} ${fromToken && fromToken} and ${toToken && toToken}`
    })
  }


// failed transactions
export const GSuccessfullyTransaction = (
  page:string,
  activityBeenPerformed:string,
  fromToken:string="null",
  toToken:string="null"
  ) => {
    gtag('event', 'successfully_transaction', {
      page,
      activityBeenPerformed,
      fromToken,
      toToken,
      message:`${activityBeenPerformed} ${fromToken && fromToken} and ${toToken && toToken}`
    })
  }



export const GTokenDetailsTab = (
  fromToken:string="null",
  toToken:string="null"
  ) => {
    console.log({fromToken,toToken})
    gtag('event', 'token_detail_tab', {
      page:"details tab",
      fromToken,
      toToken
    })
  }


export const GTransactionSetting = (
  slippage:string,
  deadline:string | number,
  gasPrice:string
  ) => {
    gtag('event', 'transaction_setting', {
      page:"transaction setting",
      slippage: `${slippage}%`,
      deadline: `${deadline} minutes`,
      gasPrice
    })
  }


export const GMarketHistoryTab = () => {
    gtag('event', 'market_history', {
      page:"market tab",
    })
  }
export const GSocialMedia = (account:string) => {
    gtag('event', 'social_media', {
     account
    })
  }
export const GWalletConnected = (wallet:string) => {
    gtag('event', 'wallet_connected_to', {
     wallet
    })
  }
export const GRGPBreakdown = () => {
    gtag('event', 'clicked_on_RGP_breakdown', {
     clicked:true
    })
  }
export const GDisconnectWallet = () => {
    gtag('event', 'clicked_on_disconnect_wallet', {
     clicked:true
    })
  }
export const GSwitchWallet = () => {
    gtag('event', 'clicked_on_switch_wallet', {
     clicked:true
    })
  }
export const GNetworkConnectedTo = (network:string ="null") => {
  if(network!=="null"){
   gtag('event', 'network_connected_to', {
     network
    }) 
  }
    
  }

import gtag from "ga-gtag"


// page view
export const GPageView = (title:string,location:string ) =>{
      gtag('config',  "G-JRRW1SDM6G", {
        page_title: title,
        page_location: `https://smartswap.rigelprotocol.com/#/${location}`, // The full URL is required.
      });
}

// button clicked
export const GButtonClick = (
  page:string,
  activityBeenPerformed:string,
  fromToken:string="null",
  toToken:string="null"
  ) =>{
  gtag('event', 'button_clicked', {
      page,
      poll_title: 'smartswap swap',
      activityBeenPerformed,
      fromToken,
      toToken
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
    gtag('event', 'failed_transaction', {
      page,
      error,
      poll_title: 'smartswap swap',
      activityBeenPerformed,
      fromToken,
      toToken
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
      poll_title: 'smartswap swap',
      activityBeenPerformed,
      fromToken,
      toToken
    })
  }



export const GTokenDetailsTab = (
  fromToken:string="null",
  toToken:string="null"
  ) => {
    gtag('event', 'token_detail_tab', {
      page:"details tab",
      poll_title: 'smartswap swap',
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
      poll_title: 'smartswap swap',
      slippage: `${slippage}%`,
      deadline: `${deadline} minutes`,
      gasPrice
    })
  }


export const GMarketHistoryTab = () => {
    gtag('event', 'market_history', {
      page:"market tab",
      poll_title: 'smartswap swap',
    })
  }
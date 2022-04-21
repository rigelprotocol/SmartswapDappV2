import gtag from "ga-gtag"

// button clicked
export const GViewNFT = (
    id:number,
    nftName:string,
    total:number,
    unsold:number,
    image:string,
    isFeatured:boolean = false
    ) =>{
    gtag('event', 'click_on_view_NFT', {
       id,
       nftName,
       total,
       unsold,
       image,
       isFeatured
      })
  }
export const GBuyNFT = (
    id:number,
    nftName:string,
    total:number,
    unsold:number,
    image:string,
    isFeatured:boolean = false
    ) =>{
    gtag('event', 'click_on_buy_NFT', {
       id,
       nftName,
       total,
       unsold,
       image,
       isFeatured
      })
  }

 // failed transactions
export const GNFTFailedTransaction = (
    page:string,
    activityBeenPerformed:string,
    error:string,
    purchaseToken:string="null",
    nftName:string,
    image:string
    ) => {
      console.log({error})
      gtag('event', 'failed_NFT_transaction', {
        page,
        error,
        activityBeenPerformed,
        purchaseToken,
        message:`${activityBeenPerformed} ${nftName} with ${image}`
      })
    }
 // failed transactions
export const GNFTFailedApprovalTransaction = (
    page:string,
    activityBeenPerformed:string,
    error:string,
    purchaseToken:string="null",
    ) => {
      console.log({error})
      gtag('event', 'failed_NFT_approval', {
        page,
        error,
        activityBeenPerformed,
        purchaseToken,
        message:`${activityBeenPerformed} ${purchaseToken}`
      })
    }
  
  
   // failed transactions
export const GNFTSuccessfullyApprovalTransaction = (
    page:string,
    activityBeenPerformed:string,
    purchaseToken:string="null",
    ) => {
      gtag('event', 'successfully_NFT_approval', {
        page,
        activityBeenPerformed,
        purchaseToken,
        message:`${activityBeenPerformed} ${purchaseToken}`
      })
    }
export const GNFTSuccessfullyTransaction = (
    page:string,
    activityBeenPerformed:string,
    purchaseToken:string="null",
    nftName:string,
    image:string
    ) => {
      gtag('event', 'successfully_NFT_transaction', {
        page,
        activityBeenPerformed,
        purchaseToken,
        message:`${activityBeenPerformed} ${nftName} with ${image}`
      })
    }
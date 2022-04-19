import gtag from "ga-gtag"

// EVENTS BEEN MEASURED FOR ON THE STRAIGHT SWAP
// 1 - click on approval button
// 2 - click on send transaction button
// 3 - failed transaction and details
// 4 - successfully transaction and details
// 5 - details of token
// 6 - transaction seeting
// 7 - transaction history
// 8 - market history

export const GApprovalClick = () =>{
    gtag('event', 'clicks_on_swap_button', {
        poll_title: 'smartswap swap',
        data:"8333333333333333333333333333333333333333333333333"
      })
}

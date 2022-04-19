import gtag from "ga-gtag"
// page view
export const GPageView = (title:string,locatin:string ) =>{
      gtag('config',  process.env.GOOGLE_TRACKING_ID, {
        page_title: title,
        page_location: `https://smartswap.rigelprotocol.com/#/${locatin}`, // The full URL is required.
        username:"i838838388383h3ii",
      });
}
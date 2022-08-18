import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react"
import { useActiveWeb3React } from "./useActiveWeb3React"


const useGenerateRouterProtocolLink = () => {
    const {account}  = useActiveWeb3React()
    const bgColor = useColorModeValue('lightBg.100', 'darkBg.100');
    const [routerProtocolLink,setRouterProtocolLink] = useState<string>()
  useEffect(()=> {
    const baseUrl = "https://app.routerprotocol.com/swap";

    const configuration = {
      isWidget: true,
      widgetId: "40", // get your unique widget id by contacting us on Telegram
      fromChain: "56",
      toChain: "137",
      fromToken: "0xfa262f303aa244f9cc66f312f0755d89c3793192",
      dstChains: "137,56",
      srcChains: "137,56",
      ctaColor: "#319EF6",
      textColor: "white",
      backgroundColor: "#213345",
    };
  
    const paramString = new URLSearchParams(configuration).toString();
    
    
    setRouterProtocolLink(`${baseUrl}?${paramString}`)
  },[account])

  return [routerProtocolLink]
}

export default useGenerateRouterProtocolLink
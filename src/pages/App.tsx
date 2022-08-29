import React, {Suspense} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddLiquidity from "./AddLiquidity";
import Pool from "./Pool";
import RemoveLiquidity from "./RemoveLiquidity";
import Swap from "./Swap";
import Nft from './Nft'
import FarmingV1 from "./FarmingV1";
import FarmingV2 from "./FarmingV2";
import Fonts from "./../theme/fonts";
import AppWrapper from "./../components/AppWrapper";
import Navbar from "./../components/Navbar";
import Notify from "../components/Toast";
import ErrorBoundary from "../components/ErrorBoundary";
import TransactionStateModal from "../components/Modals/TransactionsModal/TransactionStateModal";
import SetPrice from "./Swap/SetPrice";
import AutoTime from "./Swap/AutoTime";
import FindPool from "./Pool/FindPool";
import Index from "./index";
import useConnectWallet from "../utils/hooks/useConnectWallet";
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {SupportedChainId} from "../constants/chains";
import ViewNFT from "./Nft/ViewNFT";
import gtag from "ga-gtag"
import YieldFarm from "./FarmingV2/YieldFarm";
import SmartBid from "./SmartBid";
import BidDetails from "./SmartBid/BidDetails";
import ROuterBridge from "./Swap/Bridge/RouterBridge";
import SpheriumBridge from "./Swap/Bridge/SpheriumBridge";


 function App() {
  useConnectWallet();

  const {chainId} = useActiveWeb3React();
 
  // useEffect(()=>{
  //   ReactGA.pageview(window.location.pathname + window.location.search)
  // })
  gtag('config', "G-JRRW1SDM6G" , {
    'page_title' : window.location.search,
    'page_path': window.location.pathname,
    'send_page_view' : true
  });
  return (
    <Suspense fallback={null}>
      <Fonts />
      <AppWrapper>
        <Router>
        <Switch>
              <Route exact strict path="/" component={Index} />
              </Switch>
          <Navbar />
          <Notify />
          <TransactionStateModal />
          <ErrorBoundary>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/pool" component={Pool} />

              <Route exact strict path="/find" component={FindPool} />
              
              <Route exact strict path="/nft" component={Nft} />
              
              <Route exact strict path="/nfts/:id" component={ViewNFT} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route
                exact
                path="/add/:currencyIdA/:currencyIdB"
                component={AddLiquidity}
              />

              <Route exact strict path="/set-price" component={chainId === SupportedChainId.BINANCETEST || chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.POLYGON || chainId===undefined  ? SetPrice : Swap } />

              <Route exact strict path="/set-price/:router" component={chainId === SupportedChainId.BINANCETEST || chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.POLYGON || chainId===undefined  ? SetPrice : Swap } />
              <Route exact strict path="/auto-period" component={chainId === SupportedChainId.BINANCETEST || chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.POLYGON || chainId===undefined  ? AutoTime : Swap } />
              <Route exact strict path="/auto-period/:router" component={chainId === SupportedChainId.BINANCETEST || chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.POLYGON || chainId===undefined  ? AutoTime : Swap } />
              <Route exact strict path="/bridge/router" component={ROuterBridge} />
              <Route exact strict path="/bridge/spherium" component={SpheriumBridge} />
              <Route
                exact
                strict
                path="/remove/:currencyIdA/:currencyIdB"
                component={RemoveLiquidity}
              />
              {/*<Route*/}
              {/*  exact*/}
              {/*  strict*/}
              {/*  path="/farming-V2/staking-RGP"*/}
              {/*  component={FarmingV2}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*  exact*/}
              {/*  strict*/}
              {/*  path="/farming-V2/product-farm"*/}
              {/*  component={FarmingV2}*/}
              {/*/>*/}
              <Route exact path="/farming" component={FarmingV1} />
              <Route path="/farm" component={FarmingV2} />
              <Route path="/farm/:deposit" component={YieldFarm} />
              <Route exact strict path={'/smartbid'} component={SmartBid}/>
              <Route path={'/smartbid/:id'} component={BidDetails}/>

              {/* <Route path="*">
                <Redirect to="/swap" />
              </Route> */}

            </Switch>
          </ErrorBoundary>
        </Router>
      </AppWrapper>
    </Suspense>
  );
}

export default App
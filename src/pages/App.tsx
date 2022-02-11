import React, {Suspense, useEffect, useMemo, useState} from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AddLiquidity from "./AddLiquidity";
import Pool from "./Pool";
import RemoveLiquidity from "./RemoveLiquidity";
import Swap from "./Swap";
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

export default function App() {
  useConnectWallet();

  return (
    <Suspense fallback={null}>
      <Fonts />
      <AppWrapper>
        <HashRouter>
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
              <Route exact path="/add" component={AddLiquidity} />
              <Route
                exact
                path="/add/:currencyIdA/:currencyIdB"
                component={AddLiquidity}
              />

              <Route exact strict path="/set-price" component={SetPrice} />
              <Route exact path="/auto-time" component={AutoTime} />
              <Route
                exact
                strict
                path="/remove/:currencyIdA/:currencyIdB"
                component={RemoveLiquidity}
              />
              <Route
                exact
                strict
                path="/farming-V2/staking-RGP"
                component={FarmingV2}
              />
              <Route exact path="/farming" component={FarmingV1} />
              <Route path="/farming-V2" component={FarmingV2} />
              {/* <Route path="*">
                <Redirect to="/swap" />
              </Route> */}

            </Switch>
          </ErrorBoundary>
        </HashRouter>
      </AppWrapper>
    </Suspense>
  );
}

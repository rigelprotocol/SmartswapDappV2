import React, { Suspense } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AddLiquidity from './AddLiquidity';
import Pool from './Pool';
import RemoveLiquidity from './RemoveLiquidity';
import Swap from './Swap';
import FarmingV1 from './FarmingV1';
import FarmingV2 from './FarmingV2';
import Fonts from './../theme/fonts';
import AppWrapper from './../components/AppWrapper';
import Navbar from './../components/Navbar';
import Notify from "../components/Toast";


export default function App() {
  return (
    <Suspense fallback={null}>
      <Fonts />
      <AppWrapper>
        <HashRouter>
          <Navbar />
          <Notify/>
          <Switch>
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/pool" component={Pool} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route
              exact
              strict
              path="/remove/:currencyIdA/:currencyIdB"
              component={RemoveLiquidity}
            />
            <Route exact path="/farming" component={FarmingV1} />
            <Route exact path="/farming-V2" component={FarmingV2} />

            <Route path="/">
              <Redirect to="/swap" />
            </Route>
          </Switch>
        </HashRouter>
      </AppWrapper>
    </Suspense>
  );
}

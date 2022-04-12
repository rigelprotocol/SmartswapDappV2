import React from 'react'
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';

const RouteChangeTracker = () => {
const history = useHistory()
   history.listen((location, action) => {
       ReactGA.set({ page: location.pathname });
       ReactGA.pageview(location.pathname);
   });

   return <div></div>;
};

export default withRouter(RouteChangeTracker);
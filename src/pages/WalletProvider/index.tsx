/**
 *
 * WalletProvider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectWalletProvider from './selectors';
import reducer from './reducer';
import saga from './saga';

export function WalletProvider() {
  useInjectReducer({ key: 'walletProvider', reducer });
  useInjectSaga({ key: 'walletProvider', saga });

  return <div />;
}

WalletProvider.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  walletProvider: makeSelectWalletProvider(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(WalletProvider);

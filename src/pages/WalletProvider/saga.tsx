import { put, all, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { notify } from '../NoticeProvider/actions';
import { WALLET_CONNECTED, WALLET_PROPS } from './constants';

export function* setWalletProps(walletProps) {
  console.log('Hello', walletProps, 'So much');
}

export function* connectWallet() {
  try {
    yield put(
      notify({
        title: 'System Error:',
        message: 'e',
        type: 'error',
      }),
    );
  } catch (e) {
    yield put(
      notify({
        title: 'System Error:',
        message: e,
        type: 'error',
      }),
    );
  }
}
export function* walletProviderSaga() {
  yield takeLatest(WALLET_CONNECTED, connectWallet);
}

export function* setWallet() {
  yield takeEvery(WALLET_PROPS, setWalletProps);
}

export default function* WalletSagas() {
  console.log('Hello')
  yield all([fork(walletProviderSaga), fork(setWallet)]);
}

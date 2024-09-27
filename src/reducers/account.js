// Import utils
import { aptosClient } from "../utils/aptos_client";
import { BrowserStorageUtils } from "../utils/browser_storage";

function _createAccount(isClean) {
  if (isClean) return null;

  return {
    balance: 0,
  };
}

function getInitialState(isClean) {
  return _createAccount(isClean);
}

function accountReducer(state = getInitialState(false), action) {
  if (action.type === "STORE_ACCOUNT") {
    const tmpState = { ...state, ...action.payload };
    return tmpState;
  }

  if (action.type === "STORE_BALANCE") {
    const tmpState = { ...state };
    tmpState.balance = action.payload;
    return tmpState;
  }

  if (action.type === "REMOVE_ACCOUNT") {
    return getInitialState(true);
  }

  return state;
}

export default accountReducer;

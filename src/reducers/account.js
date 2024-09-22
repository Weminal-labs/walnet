function _createAccount() {
  return {
    publicKey: null,
    address: null,
    signingScheme: null,
  };
}

const defState = {
  data: _createAccount(),
  information: null,
};

function accountReducer(state = defState, action) {
  if (action.type === "STORE_ACCOUNT") {
    const tmpState = { ...state };
    tmpState.data = action.payload;
    return tmpState;
  }

  if (action.type === "REMOVE_ACCOUNT") {
    const tmpState = { ...state };
    tmpState.data = _createAccount();
    return tmpState;
  }

  if (action.type === "STORE_INFORMATION") {
    const tmpState = { ...state };
    tmpState.information = action.payload;
    return tmpState;
  }

  return state;
}

export default accountReducer;

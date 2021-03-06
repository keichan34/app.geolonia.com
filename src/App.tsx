import React from "react";

import "./App.scss";
import Paperbase from "./components/Paperbase";
import AuthContainer from "./auth/container";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthContainer>
        <Paperbase />
      </AuthContainer>
    </Provider>
  );
};

export default App;

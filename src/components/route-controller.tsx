import React from "react";

type Props = {
  isLoggedIn: boolean;
  history: {
    location: {
      pathname: string;
    };
    replace: (path: string) => void;
  };
};

type State = {};

export const RouteController = (props: Props) => {
  const {
    isLoggedIn,
    history: {
      location: { pathname },
      replace
    }
  } = props;

  React.useEffect(() => {
    if (
      !isLoggedIn &&
      pathname !== "/signup" &&
      pathname !== "/resend" &&
      pathname !== "/verify" &&
      pathname !== "/forgot-password" &&
      pathname !== "/reset-password" &&
      pathname !== "/accept-invitation"
    ) {
      replace("/signin");
    }
  }, [isLoggedIn, pathname, replace]);

  return <></>;
};

export default RouteController;

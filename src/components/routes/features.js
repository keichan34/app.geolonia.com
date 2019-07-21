import React from "react";
import { __ } from "@wordpress/i18n";

export const FeaturesRoute = () => {
  return (
    <main
      className={
        "tilecloud-app uk-container uk-container-medium uk-margin uk-padding-small"
      }
    >
      <ul className={"uk-breadcrumb"}>
        <li>
          <span>{__("features", "geolonia-dashboard")}</span>
        </li>
      </ul>
      <span>{__("comming soon", "geolonia-dashboard")}</span>
    </main>
  );
};

export default FeaturesRoute;

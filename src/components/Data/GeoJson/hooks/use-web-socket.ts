import React from "react";
import { refreshSession } from "../../../../auth";
// types
import { UpstreamAuthorizeMessage, Session } from "../../../../types";

export default function useWebSocket(
  session: Session,
  teamId: string | void,
  geojsonId: string | void
): [(featureId: string) => void, boolean, () => void] {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [updateRequired, setUpdateRequired] = React.useState(false);

  // WebSocket Connection
  React.useEffect(() => {
    if (session && teamId && !socket) {
      refreshSession(session).then(session => {
        const idToken = session.getIdToken().getJwtToken();
        const ws = new WebSocket(
          `wss://ws-api.geolonia.com/${process.env.REACT_APP_STAGE}`
        );

        ws.onopen = () => {
          const message: UpstreamAuthorizeMessage = {
            action: "authorize",
            data: {
              teamId: teamId as string,
              token: idToken
            }
          };
          ws.send(JSON.stringify(message));
        };

        ws.onmessage = rawMessage => {
          try {
            const message = JSON.parse(rawMessage.data);
            if (message) {
              if (message.action === "ack") {
                setSocket(ws);
              } else if (
                message.action === "notify" &&
                geojsonId === message.data.geojsonId
              ) {
                setUpdateRequired(true);
              }
            } else {
              throw new Error();
            }
          } catch (error) {
            console.error("Web socket connection failed");
          }
        };

        ws.onerror = () => {
          setSocket(null);
        };
      });
    }
  }, [geojsonId, session, teamId, socket, updateRequired]);

  const publush = socket
    ? (featureId: string) => {
        socket.send(
          JSON.stringify({
            action: "publish",
            data: {
              geojsonId: geojsonId,
              featureId: featureId
            }
          })
        );
      }
    : () => {
        console.error("No socket found.");
      };

  return [publush, updateRequired, () => setUpdateRequired(false)];
}

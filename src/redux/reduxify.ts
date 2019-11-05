import { connect } from "react-redux";
import { AppState, Session, User, Team } from "../types";
import Redux from "redux";
import { createActions as createUserMetaActions } from "./actions/user-meta";

export const REDUXIFY = "UTIL/REDIXFY";

export type ReduxifyAction = {
  type: typeof REDUXIFY;
  payload: {
    key: keyof AppState;
    state: any;
  };
};

type StateProps = {
  appState: AppState;
  session: Session;
  user: User;
  team?: Team;
  teams: Team[];
};

type DispatchProps = {
  dispatch: Redux.Dispatch;
  setAppState: (nextAppState: Partial<AppState>) => void;
  updateUser: (user: User) => void;
};

export type ReduxifyProps = StateProps & DispatchProps;

const isReduxifyAction = (action: Redux.AnyAction): action is ReduxifyAction =>
  action.type === REDUXIFY && action.payload && !!action.payload.state;

export const appendReduxifyReducers: Redux.Reducer = (
  reducerMapObjects: Redux.ReducersMapObject
) => {
  const result: Redux.ReducersMapObject = {};

  for (const key in reducerMapObjects) {
    // Proxy all reducer composition
    result[key] = (state: any, action: Redux.AnyAction) => {
      const nextState = reducerMapObjects[key](state, action);

      if (isReduxifyAction(action) && key === action.payload.key) {
        return action.payload.state;
      } else {
        return nextState;
      }
    };
  }
  return result;
};

const reduxify = (MyComponent: any) => {
  const mapStateToProps = (appState: AppState): StateProps => {
    const user = appState.userMeta;
    const selectedTeamIndex = appState.team.selectedIndex;
    const team = appState.team.data[selectedTeamIndex];
    const teams = appState.team.data;
    const session = appState.authSupport.session;

    return { appState, session, user, team, teams };
  };
  const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => {
    const setAppState = (nextAppState: Partial<AppState>) => {
      (Object.keys(nextAppState) as (keyof AppState)[]).forEach(key => {
        const state = nextAppState[key];
        if (state) {
          dispatch({
            type: REDUXIFY,
            payload: { key, state }
          });
        }
      });
    };

    const updateUser = (user: User) => {
      dispatch(createUserMetaActions.set(user));
    };

    return {
      dispatch,
      setAppState,
      updateUser
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyComponent);
};

export default reduxify;

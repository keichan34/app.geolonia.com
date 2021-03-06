import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Save from "../custom/Save";

// API
import updateUser from "../../api/users/update";

// utils
import { __ } from "@wordpress/i18n";
import momentTimeZone from "moment-timezone";

// Redux
import { connect } from "react-redux";
import { createActions as createUserActions } from "../../redux/actions/user-meta";

// types
import { Dispatch } from "redux";

type OwnProps = {};
type StateProps = { session: Geolonia.Session; user: Geolonia.User };
type DispatchProps = {
  updateUser: (nextUser: Geolonia.User) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

type State = {
  user: Pick<Geolonia.User, "name" | "language" | "timezone">;
  email: string;
  username: string;
};

const selectStyle: React.CSSProperties = {
  marginTop: "16px",
  marginBottom: "8px"
};

export class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: {
        name: props.user.name,
        language: props.user.language,
        timezone: props.user.timezone || momentTimeZone.tz.guess()
      },
      username: props.user.username,
      email: props.user.email
    };
  }

  _setUserMeta = (key: keyof Geolonia.User, value: string) => {
    this.setState({
      user: { ...this.state.user, [key]: value }
    });
  };

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this._setUserMeta("name", e.currentTarget.value);
  };

  onNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    this._setUserMeta("name", name.trim());
  };

  onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ email: e.target.value });

  onLanguageChange = (e: any) => this._setUserMeta("language", e.target.value);
  onTimezoneChange = (e: any) => this._setUserMeta("timezone", e.target.value);

  onSaveClick = (e: any) => {
    const { session, user } = this.props;
    const nextUser = { ...user, ...this.state.user };

    // Error Handling
    return updateUser(session, nextUser).then(result => {
      if (result.error) {
        throw new Error(result.code);
      }
      this.props.updateUser(nextUser);
      // wait to show success effect
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  timezones = momentTimeZone.tz.names();

  render() {
    const {
      user: { name, language, timezone },
      email,
      username
    } = this.state;

    const saveDisabled = name === "";

    return (
      <>
        <TextField
          id="username"
          label={__("Username")}
          margin="normal"
          value={username}
          fullWidth={true}
          disabled
        />

        <TextField
          id="email"
          label={__("Email")}
          margin="normal"
          value={email}
          onChange={this.onEmailChange}
          fullWidth={true}
          // NOTE: currently disabled
          disabled
        />
        {/* <Save></Save> */}

        <TextField
          id="display-name"
          label={__("Name")}
          margin="normal"
          value={name}
          onChange={this.onNameChange}
          fullWidth={true}
          onBlur={this.onNameBlur}
        />

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-language">{__("Language")}</InputLabel>
          <Select
            id="select-language"
            fullWidth={true}
            value={language}
            onChange={this.onLanguageChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">日本語</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth={true} style={selectStyle}>
          <InputLabel htmlFor="select-timezone">{__("Time zone")}</InputLabel>
          <Select
            id="select-timezone"
            fullWidth={true}
            value={timezone}
            onChange={this.onTimezoneChange}
          >
            {this.timezones.map((timezoneName: string) => (
              <MenuItem key={timezoneName} value={timezoneName}>
                {timezoneName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Save onClick={this.onSaveClick} disabled={saveDisabled} />
      </>
    );
  }
}

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
  session: state.authSupport.session,
  user: state.userMeta
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  updateUser: (nextUser: Geolonia.User) =>
    dispatch(createUserActions.set(nextUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

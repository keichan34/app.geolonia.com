import React from 'react';
import clsx from 'clsx';
import { withStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
// import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
// import PublicIcon from '@material-ui/icons/Public';
// import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
// import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
// import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';

import './Navigator.css'

const categories = [
  {
    id: 'Maps',
    children: [
      { id: 'API Keys', icon: <PeopleIcon />, active: false },
      { id: 'Styles', icon: <DnsRoundedIcon />, active: false },
    ],
  },
  {
    id: 'Data',
    children: [
      { id: 'Features', icon: <SettingsIcon />, active: false },
    ],
  },
];

const styles = (theme: Theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
})

type Props = {
  readonly classes: any
  readonly PaperProps: any
  readonly variant?: "temporary"
  readonly open?: boolean
  readonly onClose?: () => any
}

const Navigator: React.FC<Props> = (props: Props) => {
  const { classes, ...other } = props;

  return (
    <Drawer id="navigator" variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          <Select className="team" value="default-team">
            <MenuItem value="default-team">Default</MenuItem>
            <MenuItem className="create-new-team">Create new team</MenuItem>
          </Select>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Dashboard
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem
                key={childId}
                button
                className={clsx(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);
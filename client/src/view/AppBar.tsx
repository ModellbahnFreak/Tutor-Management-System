import {
  AppBar as MuiAppBar,
  Button,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  useTheme,
  PaletteType,
  Tooltip,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Brightness7 as DarkIcon, Brightness5 as LightIcon } from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Location } from 'history';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useLogin } from '../hooks/LoginService';
import { getTutorialRelatedPath, ROUTES, RouteType } from '../util/RoutingPath';
import { GithubCircle as GitHubIcon } from 'mdi-material-ui';
import { useChangeTheme } from '../components/ContextWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    iconButton: {
      color: 'inherit',
      marginLeft: theme.spacing(0),
    },
    logoutButton: {
      marginRight: theme.spacing(2),
    },
    loggedInAsArea: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      textAlign: 'right',
    },
  })
);

const titleText: Map<string, string> = new Map(ROUTES.map(route => [route.path, route.title]));

interface Props {
  onMenuButtonClicked: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

type PropType = Props & WithSnackbarProps & RouteComponentProps;

function getTitleFromLocation(location: Location): string {
  const title: string | undefined = titleText.get(location.pathname);

  if (title) {
    return title;
  }

  const matchingRoute: RouteType | undefined = ROUTES.find(route => {
    let routePath: string = route.path;

    if (route.isTutorialRelated) {
      routePath = getTutorialRelatedPath(route, ':tutorialId');
    }

    const locationParts: string[] = location.pathname.split(/\//);
    const routePathParts: string[] = routePath.split(/\//);

    if (locationParts.length !== routePathParts.length) {
      return false;
    }

    const isPathMatching = routePathParts.reduce((prevValue, part, idx) => {
      // Ignore parts of the route path which describe a parameter (ie start with ':').
      if (!part.startsWith(':')) {
        return prevValue && part === locationParts[idx];
      }

      return prevValue;
    }, true);

    return isPathMatching;
  });

  return matchingRoute ? matchingRoute.title : 'TITLE_NOT_FOUND';
}

function AppBar(props: PropType): JSX.Element {
  const { enqueueSnackbar, onMenuButtonClicked, location } = props;

  const classes = useStyles();
  const { logout, isLoggedIn, userData } = useLogin();
  const userIsLoggedIn: boolean = isLoggedIn();
  const theme = useTheme();
  const changeTheme = useChangeTheme();

  function handleThemeChangeClicked() {
    const newType: PaletteType = theme.palette.type === 'light' ? 'dark' : 'light';
    changeTheme(newType);
  }

  function handleLogBtnClicked() {
    logout().then(() => enqueueSnackbar('Erfolgreich ausgeloggt', { variant: 'success' }));
  }

  return (
    <MuiAppBar position='static' className={classes.appBar}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          onClick={onMenuButtonClicked}
          aria-label='Menu'
          style={{ visibility: userIsLoggedIn ? 'visible' : 'hidden' }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant='h6' color='inherit' className={classes.grow}>
          {getTitleFromLocation(location)}
        </Typography>

        {userIsLoggedIn && (
          <>
            <div className={classes.loggedInAsArea}>
              <Typography variant='caption' color='inherit'>
                Angemeldet als:
              </Typography>

              <Typography variant='caption' color='inherit'>
                {userData ? `${userData.firstname} ${userData.lastname}` : 'NOT_FOUND'}
              </Typography>
            </div>

            <Button color='inherit' onClick={handleLogBtnClicked} className={classes.logoutButton}>
              Abmelden
            </Button>
          </>
        )}

        <Tooltip title='Zwischen hellem & dunklem Design wechseln.'>
          <IconButton onClick={handleThemeChangeClicked} className={classes.iconButton}>
            {theme.palette.type === 'light' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>

        <IconButton
          className={classes.iconButton}
          href='https://github.com/Dudrie/Tutor-Management-System/issues'
          target='_blank'
        >
          <GitHubIcon fontSize='default' />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}

export default withRouter(withSnackbar(AppBar));

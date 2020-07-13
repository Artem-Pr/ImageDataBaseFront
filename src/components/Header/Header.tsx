import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TabsPanel from "../TabsPanel/TabsPanel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textTransform: "uppercase"
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export const Header = () => {
  const classes = useStyles();

  return (
    <header className="App-header">
      <div>
        <AppBar position="static">
          <Toolbar className={classes.root}>
            <Typography variant="h5">Image Data Base</Typography>
          </Toolbar>
					<TabsPanel />
        </AppBar>
      </div>
    </header>
  );
};

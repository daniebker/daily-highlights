import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import SettingsIcon from "@material-ui/icons/Settings"
import HomeIcon from "@material-ui/icons/Home"
import ListItemLink from "./ListItemLink"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Box from "@material-ui/core/Box"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"
import Divider from "@material-ui/core/Divider"

import { logoutUser } from "gatsby-plugin-google-gapi"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  }
})

export default function TemporaryDrawer() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setOpen(!open)
  }

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer()}
      onKeyDown={toggleDrawer()}
    >
      <Box className={classes.spaceAround}>
        <List>
          <ListItemLink icon={SettingsIcon} to="/" primary="Home">
            <HomeIcon />
          </ListItemLink>
          <ListItemLink icon={SettingsIcon} to="/settings" primary="Settings">
            <SettingsIcon />
          </ListItemLink>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={logoutUser}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </div>
  )

  return (
    <div>
      <Button onClick={toggleDrawer()}>Menu</Button>
      <Drawer open={open} onClose={toggleDrawer()}>
        {list()}
      </Drawer>
    </div>
  )
}

import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import SettingsIcon from "@material-ui/icons/Settings"
import HomeIcon from '@material-ui/icons/Home';
import ListItemLink from "./ListItemLink"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
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
      <List>
        <ListItemLink icon={SettingsIcon} to="/" primary="Home">
          <HomeIcon />
        </ListItemLink>
        <ListItemLink icon={SettingsIcon} to="/settings" primary="Settings">
          <SettingsIcon />
        </ListItemLink>
      </List>
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

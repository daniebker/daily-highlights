import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import SettingsIcon from '@material-ui/icons/Settings';
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

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
        <ListItem button>
          <ListItemIcon>
              <SettingsIcon /> 
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
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

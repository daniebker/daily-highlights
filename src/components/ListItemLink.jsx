import React from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

import { Link } from "gatsby-theme-material-ui"

export default function ListItemLink(props) {
  const { children, primary, to } = props

  return (
    <Link to={to}>
      <ListItem button>
        <ListItemIcon>{children}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </Link>
  )
}

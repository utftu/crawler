import {ListItem, ListItemLabel} from 'baseui/list';
import {Check} from 'baseui/icon';
import {memo} from 'react';

function Links(props) {
  return (
    <ul>
      {props.links.map((link) => {
        return (
          <ListItem artwork={(props) => <Check {...props} />} key={link}>
            <ListItemLabel>{link}</ListItemLabel>
          </ListItem>
        );
      })}
    </ul>
  );
}

export default memo(Links);

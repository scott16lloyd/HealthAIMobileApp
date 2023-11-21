import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../auth/AuthContext';
import {
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';

function stringToColor(string) {
  if (string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  } else {
    let color = '#D9D9D9';
    return color;
  }
}

function stringAvatar(name) {
  if (name && typeof name === 'string') {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  } else {
    return 'n/a';
  }
}

function UserProfile() {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
      console.log('sign out sucessful');
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarStyling = {
    height: '80px',
    width: '80px',
    fontSize: '2rem',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    backdropFilter: 'blur(1.5px)',
  };
  return (
    <div style={{ display: 'flex', margin: '2rem' }}>
      <Tooltip>
        <Avatar
          style={{
            height: '80px',
            width: '80px',
            fontSize: '2rem',
            cursor: 'pointer',
          }}
          sx={avatarStyling}
          variant="outlined"
          alt="Default Profile Image"
          {...stringAvatar(user.displayName)}
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        />
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/viewProfile')}>
          <Typography>View Profile</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserProfile;

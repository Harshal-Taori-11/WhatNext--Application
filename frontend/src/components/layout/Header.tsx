import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Dashboard as BoardIcon,
  List as ListIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import { ProfileDropdown } from './ProfileDropdown';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Board', path: '/board', icon: <BoardIcon /> },
    { label: 'All Tasks', path: '/tasks', icon: <ListIcon /> },
    { label: 'Notes', path: '/notes', icon: <NoteIcon /> },
  ];

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          onClick={() => navigate('/board')}
        >
          WhatNext!
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                mr: 1,
                px: 2,
                borderRadius: 2,
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <ProfileDropdown />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

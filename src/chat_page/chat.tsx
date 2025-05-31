import React, { useState } from 'react';
import './chat.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';

export default function ChatPage() {
  return (
    <>
        <div className="navbar">
            <div className='left-navbar'>
                <img src='./src/assets/LOGO/loginlogo.png' alt='' className='Logo'/>
                <div className='title'>VGU Chatbot</div>
            </div>
            <div className='users_content'>
                <IconButton size="small">
                <span className="username">Trần Nguyễn Lâm</span>
                <ArrowDropDownIcon />
                </IconButton>
            </div>
        </div>
    </>
  );
}

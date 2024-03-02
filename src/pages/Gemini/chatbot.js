import React from 'react';
import Chatbot from '../../components/sidemenu/chat';
import SideMenu from '../../components/sidemenu/SideMenu';
import { Container } from '@mui/material';

const ChatBotPage = () => {
  return (
    <>
        <SideMenu />
        <Container maxWidth="md">
            <Chatbot />
        </Container>
    </>
  );
};

export default ChatBotPage;

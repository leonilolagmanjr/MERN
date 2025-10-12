import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import SteamLogo from '../logo.svg';

const About = () => {
  return React.createElement(Box, {
    sx: {
      minHeight: '100vh',
      bgcolor: 'var(--color-bg)',
      color: 'var(--color-text)',
      py: 6,
    }
  },
    React.createElement(Container, { maxWidth: "md" },
      // Header
      React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mb: 4 } },
        React.createElement(Avatar, { src: SteamLogo, sx: { width: 64, height: 64, mr: 2, bgcolor: 'var(--color-header-bg)' } }),
        React.createElement(Typography, { variant: "h3", fontWeight: "bold", color: 'var(--color-primary)' }, "About the Platform")
      ),

      // Developer Introduction
      React.createElement(Box, { sx: { mb: 6 } },
        React.createElement(Typography, { variant: "h4", fontWeight: "bold", color: 'var(--color-primary)', sx: { mb: 2 } }, "Developer Introduction"),
        React.createElement(Typography, { variant: "body1", sx: { lineHeight: 1.6 } },
          "Hi, I’m Leonilo Lagman Jr, a passionate solo Full Stack Developer specializing in the MERN stack (MongoDB, Express.js, React.js, Node.js). I love building scalable platforms, modern web applications, and systems that solve real-world problems. This project is heavily inspired by Steam’s community features, reimagined for job connections, collaboration, and social interaction. As a solo developer, I handle everything from backend APIs to frontend UI/UX, ensuring a smooth, polished experience."
        )
      ),

      // Project Overview
      React.createElement(Box, { sx: { mb: 6 } },
        React.createElement(Typography, { variant: "h4", fontWeight: "bold", color: 'var(--color-primary)', sx: { mb: 2 } }, "Project Overview"),
        React.createElement(Typography, { variant: "body1", sx: { lineHeight: 1.6 } },
          "This MERN website is a job matching and social networking platform that blends the functionality of a job board with the interaction of a social community. It aims to connect freelancers, developers, and creators in a more social and engaging way than typical job boards. Users can post and accept jobs (remote or on-site), chat in real time, post in forums and social feeds, share videos, images, and updates, and customize their profiles like Steam (themes, avatars, backgrounds, showcases)."
        )
      ),

      // Core Features
      React.createElement(Box, { sx: { mb: 6 } },
        React.createElement(Typography, { variant: "h4", fontWeight: "bold", color: 'var(--color-primary)', sx: { mb: 2 } }, "Core Features"),
        React.createElement(Typography, { variant: "body1", sx: { lineHeight: 1.6, mb: 2 } },
          "The platform offers a comprehensive set of features designed to foster community and facilitate job matching:"
        ),
        React.createElement('ul', { style: { paddingLeft: '20px' } },
          React.createElement('li', null, "Job Posting and Management: Users can create, browse, and manage job listings for remote or on-site opportunities."),
          React.createElement('li', null, "Real-Time Chat: Integrated chat system for instant communication between users."),
          React.createElement('li', null, "Forums and Social Feeds: Discussion forums and social media-like feeds for sharing updates, images, and videos."),
          React.createElement('li', null, "Profile Customization: Steam-inspired profiles with themes, avatars, backgrounds, and showcases."),
          React.createElement('li', null, "Video Sharing: Upload and share videos within the community."),
          React.createElement('li', null, "Payment and Transactions: Secure payment methods and transaction history for job-related payments."),
          React.createElement('li', null, "Verification: KYC verification for trusted interactions.")
        )
      ),

      // Technical Architecture
      React.createElement(Box, { sx: { mb: 6 } },
        React.createElement(Typography, { variant: "h4", fontWeight: "bold", color: 'var(--color-primary)', sx: { mb: 2 } }, "Technical Architecture"),
        React.createElement(Typography, { variant: "body1", sx: { lineHeight: 1.6, mb: 2 } },
          "The platform is built using a robust MERN stack architecture:"
        ),
        React.createElement('ul', { style: { paddingLeft: '20px' } },
          React.createElement('li', null, "MongoDB: NoSQL database for storing user data, jobs, chats, posts, and other entities."),
          React.createElement('li', null, "Express.js: Backend framework for routing, authentication, and API endpoints."),
          React.createElement('li', null, "React.js: Frontend library for building the user interface using plain JavaScript and React.createElement."),
          React.createElement('li', null, "Node.js: Runtime environment for the backend server and Socket.IO integration."),
          React.createElement('li', null, "Socket.IO: Enables real-time features like chat, notifications, and presence updates."),
          React.createElement('li', null, "Google Maps API: For location selection and marking jobs as remote or on-site."),
          React.createElement('li', null, "Material-UI (MUI): Design system for responsive layouts and consistent theming."),
          React.createElement('li', null, "JWT Authentication: Secure user sessions and login management.")
        )
      ),

      // Vision & Future Roadmap
      React.createElement(Box, { sx: { mb: 6 } },
        React.createElement(Typography, { variant: "h4", fontWeight: "bold", color: 'var(--color-primary)', sx: { mb: 2 } }, "Vision & Future Roadmap"),
        React.createElement(Typography, { variant: "body1", sx: { lineHeight: 1.6 } },
          "The vision is to create a vibrant community where freelancers and creators can find meaningful work, collaborate on projects, and build lasting professional relationships. Future enhancements include advanced AI-powered job matching, expanded social features like groups and events, mobile app development, and integration with popular tools like GitHub and LinkedIn. The platform aims to evolve into a comprehensive ecosystem for creative professionals."
        )
      ),

      React.createElement(Divider, { sx: { bgcolor: 'var(--color-primary)', my: 4 } }),

      // Developer Card
      React.createElement(Card, { sx: { bgcolor: 'var(--color-card-bg)', color: 'var(--color-text)', boxShadow: 3, maxWidth: 400, mx: 'auto', mt: 4 } },
        React.createElement(CardContent, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          React.createElement(Avatar, {
            src: "https://github.com/leonilolagmanjr",
            sx: { width: 100, height: 100, mb: 2, bgcolor: 'var(--color-bg)' }
          }),
          React.createElement(Typography, { variant: "h5", color: 'var(--color-primary)', fontWeight: "bold" }, "Leonilo Lagman Jr"),
          React.createElement(Typography, { variant: "body2", color: 'var(--color-text)', sx: { mb: 1 } }, "Solo Full Stack Developer"),
          React.createElement(Typography, { variant: "body2", color: 'var(--color-text-gray)', sx: { textAlign: 'center', mb: 2 } },
            "Experienced in building full-featured platforms and web apps. I specialize in handling projects end-to-end — from backend systems to frontend UI/UX."
          ),
          React.createElement(Button, {
            variant: "contained",
            href: "https://github.com/leonilolagmanjr",
            target: "_blank",
            sx: { bgcolor: 'var(--color-primary)', color: 'var(--color-bg)', mt: 1, textTransform: 'none', fontWeight: 'bold' }
          }, "View Portfolio")
        )
      ),

      // Footer
      React.createElement(Box, { sx: { mt: 6, textAlign: 'center' } },
        React.createElement(Typography, { variant: "body1", color: 'var(--color-text-gray)' },
          `© ${new Date().getFullYear()} Built by Leonilo Lagman Jr — All rights reserved.`
        )
      )
    )
  );
};

export default About;

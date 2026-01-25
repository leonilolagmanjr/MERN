import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Avatar, Grid } from '@mui/material';
import { fetchLeaderboard } from '../../services/api';
import LevelBar from './LevelBar';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    getLeaderboard();
  }, []);

  return (
    <Box sx={{ bgcolor: 'var(--color-card-bg)', p: 3, borderRadius: 2 }}>
      <Typography
        variant="h5"
        sx={{ color: 'var(--color-text)', textAlign: 'center', mb: 3 }}
      >
        Top Users by XP
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        {leaderboard.slice(0, 5).map((user, index) => (
          <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 'bold', minWidth: '20px' }}>
              #{index + 1}
            </Typography>
            <Avatar
              src={user.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
              variant="square"
              sx={{
                width: 62,
                height: 62,
                border: '2px solid var(--color-accent)',
                boxShadow: '0 0 0 1px var(--color-border)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text)' }}>
                {user.name}
              </Typography>
              <LevelBar xp={user.xp} level={user.level} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Leaderboard;

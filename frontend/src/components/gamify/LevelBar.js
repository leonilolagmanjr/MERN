import React from 'react';

function LevelBar({ xp, level }) {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000];
  const prevThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || 4000;
  const progress = Math.max(0, Math.min(100, ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  const getProgressColor = (progress) => {
    // Hue from 0 (red) to 120 (green) based on progress
    const hue = 120 * (progress / 100);
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg)',
      borderRadius: '10px',
      padding: '10px',
      marginBottom: '20px',
      color: 'var(--color-text)',
    }}>
      <div style={{ fontSize: '18px', marginBottom: '10px' }}>Level {level}</div>
      <div style={{
        width: '100%',
        backgroundColor: 'var(--color-button-bg)',
        height: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressColor(progress),
            height: '100%',
            borderRadius: '10px',
          }}
        />
      </div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>{xp} / {nextThreshold} XP</div>
    </div>
  );
}

export default LevelBar;

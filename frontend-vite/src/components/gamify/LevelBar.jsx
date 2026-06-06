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
      backgroundColor: '#2C3639',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '20px',
      color: '#DCD7C9',
      border: '2px solid rgba(162, 123, 92, 0.3)',
      boxShadow: '0 4px 12px rgba(44, 54, 57, 0.4)',
    }}>
      <div style={{ 
        fontSize: '18px', 
        marginBottom: '12px',
        fontWeight: '600',
        color: '#DCD7C9'
      }}>Level {level}</div>
      <div style={{
        width: '100%',
        backgroundColor: '#3F4E4F',
        height: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(162, 123, 92, 0.2)',
        marginBottom: '8px',
      }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressColor(progress),
            height: '100%',
            borderRadius: '10px',
            transition: 'width 0.5s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay for better visual appeal */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            borderRadius: '10px',
          }} />
        </div>
      </div>
      <div style={{ 
        fontSize: '14px', 
        marginTop: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#DCD7C9' }}>{xp} XP</span>
        <span style={{ 
          color: '#A27B5C',
          fontWeight: '500',
          fontSize: '13px'
        }}>{progress.toFixed(1)}%</span>
        <span style={{ color: '#DCD7C9' }}>{nextThreshold} XP</span>
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(220, 215, 201, 0.7)',
        marginTop: '4px',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        {xp - prevThreshold} / {nextThreshold - prevThreshold} XP to next level
      </div>
    </div>
  );
}

export default LevelBar;
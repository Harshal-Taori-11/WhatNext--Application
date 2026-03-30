import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';

interface AvatarProps extends Omit<MuiAvatarProps, 'src'> {
  username: string;
  profilePictureUrl?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  profilePictureUrl,
  size = 40,
  ...props
}) => {
  // Get first letter of username, uppercase
  const firstLetter = username?.charAt(0).toUpperCase() || '?';

  // Generate a consistent color based on username
  const generateColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      '#F44336', // Red
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#2196F3', // Blue
      '#03A9F4', // Light Blue
      '#00BCD4', // Cyan
      '#009688', // Teal
      '#4CAF50', // Green
      '#8BC34A', // Light Green
      '#CDDC39', // Lime
      '#FFC107', // Amber
      '#FF9800', // Orange
      '#FF5722', // Deep Orange
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (profilePictureUrl) {
    return (
      <MuiAvatar
        src={profilePictureUrl}
        alt={username}
        sx={{ width: size, height: size, ...props.sx }}
        {...props}
      >
        {firstLetter}
      </MuiAvatar>
    );
  }

  return (
    <MuiAvatar
      sx={{
        width: size,
        height: size,
        bgcolor: generateColor(username),
        fontSize: size / 2.5,
        fontWeight: 600,
        ...props.sx,
      }}
      {...props}
    >
      {firstLetter}
    </MuiAvatar>
  );
};

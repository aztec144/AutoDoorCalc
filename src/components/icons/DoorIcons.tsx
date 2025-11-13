import React from 'react';
import { DoorType } from '../../types';

interface DoorIconsProps {
  type: DoorType;
  className?: string;
}

export const DoorIcons: React.FC<DoorIconsProps> = ({ type, className }) => {
  const commonClassName = className || "w-10 h-10";

  switch (type) {
    case DoorType.SlidingDoubleLeaf:
      return (
        <svg className={commonClassName} viewBox="0 0 42 38" fill="none">
          <path d="M1 1H21M1 1V37H21M1 1H41M21 1V37M21 1H41M21 37H41V1M6.92046 19.04L14.4639 11.4023M6.77778 17.8955L14.6345 25.8505M35.2533 19.1125L27.3966 11.1575M35.2533 17.8641L27.3966 25.819" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case DoorType.SlidingSingleLeaf:
      return (
        <svg className={commonClassName} viewBox="0 0 41 38" fill="none">
          <path d="M1 1H21V37H1V1ZM1 1L41 1M15.2496 19.3572L7.39287 11.4023M15.2496 18.7228L7.39287 26.6777" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case DoorType.TelescopicTwoWay:
      return (
        <svg className={commonClassName} viewBox="0 0 42 38" fill="none">
          <path d="M41 1H21M41 1V37H21M41 1H1M21 1V37M21 1H1M21 37H1V1M4.38494 19.3572L12.2417 11.4023M4.38494 17.7228L12.2417 25.6777M9.05161 19.3572L16.9083 11.4023M9.05161 17.7228L16.9083 25.6777M37.694 19.3572L29.8373 11.4023M37.694 17.7228L29.8373 25.6777M33.0274 19.3572L25.1706 11.4023M33.0274 17.7228L25.1706 25.6777" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case DoorType.TelescopicOneWay:
        return (
          <svg className={commonClassName} viewBox="0 0 41 38" fill="none">
            <path d="M1 1H21V37H1V1ZM1 1L41 1M17.6941 19.3572L9.83731 11.4023M17.6941 17.7228L9.83731 25.6777M13.0274 19.3572L5.17064 11.4023M13.0274 17.7228L5.17064 25.6777" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    default:
      return null;
  }
};

import { useMemo } from 'react';
import { useOnResize } from '../../hooks/useOnResize';
import { StyledViewport } from './Viewport.styled';

const BASE_SIZE = {
  width: 1920,
  height: 1080,
};

type Props = {
  children?: React.ReactNode;
};

export const Viewport = ({ children }: Props): React.JSX.Element => {
  const size = useOnResize();

  // Calculate scale based on the current window size and the base size to keep the aspect ratio
  const scale = useMemo(() => {
    const targetWidth = Math.min(size.width, BASE_SIZE.width);
    const targetHeight = Math.min(size.height, BASE_SIZE.height);

    const widthScale = targetWidth / BASE_SIZE.width;
    const heightScale = targetHeight / BASE_SIZE.height;
    return Math.min(widthScale, heightScale);
  }, [size.width, size.height]);

  return (
    <StyledViewport scale={scale} id="game-view">
      {children}
    </StyledViewport>
  );
};

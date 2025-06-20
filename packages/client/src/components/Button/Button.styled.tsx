import styled, { css } from 'styled-components';
import type { theme } from '../../config/theme';
import { opacityToHex } from '../../utils/opacityToHex';

type StyledButtonProps = {
	$minWidth: string;
	$state: 'default' | 'disabled' | 'loading';
};

const stateMap: Record<
	StyledButtonProps['$state'],
	{
		background: keyof typeof theme.colors;
		backgroundOpacity?: number;
		borderColor: keyof typeof theme.colors | 'transparent';
		color: keyof typeof theme.colors;
		castShadows: boolean;
		opacity: number;
	}
> = {
	default: {
		background: 'darkBlue_1',
		borderColor: 'transparent',
		backgroundOpacity: 1,
		color: 'white_1',
		castShadows: true,
		opacity: 1,
	},
	disabled: {
		background: 'darkBlue_1',
		borderColor: 'transparent',
		color: 'gray_2',
		castShadows: false,
		opacity: 0.5,
	},
	loading: {
		background: 'darkBlue_2',
		borderColor: 'darkBlue_1',
		color: 'white_1',
		castShadows: true,
		opacity: 0.5,
	},
};

export const StyledButton = styled.button<StyledButtonProps>`
  ${({ theme, $state }) => {
		return css`
      background-color: ${`${theme.colors[stateMap[$state].background]}${stateMap[$state].backgroundOpacity ? opacityToHex(stateMap[$state].backgroundOpacity) : 'FF'}`};
      border: 1px solid
        ${
					stateMap[$state].borderColor === 'transparent'
						? 'transparent'
						: theme.colors[stateMap[$state].borderColor]
				};
      color: ${theme.colors[stateMap[$state].color]};
    `;
	}}

  ${({ $state }) => {
		if (stateMap[$state].castShadows) {
			return css`
        text-shadow: 4px 4px 6px rgba(66, 68, 90, 1);
        box-shadow: 0px 4px 8px 0px #00000033;
      `;
		}
	}}

  opacity: ${({ $state }) => stateMap[$state].opacity};
  border-radius: 8px;
  padding: 6px 16px;
  font-family: 'Strait';
  font-size: 20px;
  min-height: 36px;

  > {
    display: flex;
    align-items: center;
  }

  ${({ $minWidth }) => css`
    min-width: ${$minWidth};
  `}

  transition: background-color 0.2s ease-in-out;

  ${({ $state }) =>
		$state === 'default' &&
		css`
      &:hover {
        background: ${({ theme }) => theme.colors.dark};
        border-color: ${({ theme }) => theme.colors.darkBlue_2};
        cursor: pointer;
      }

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.colors.blue_1};
      }
    `}
`;

export const StyledButtonText = styled.div<{ $displayIcon: boolean }>`
  display: flex;
  align-items: center;
  min-height: 16px;
  user-select: none;

  ${({ $displayIcon }) =>
		$displayIcon &&
		css`
      gap: 8px;
    `}

  > {
    div:first-of-type {
      ${({ $displayIcon }) =>
				$displayIcon &&
				css`
          min-width: 20px;
        `}

      > span {
        font-size: 20px;
        color: inherit;
      }
    }

    div:last-of-type {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

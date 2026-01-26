import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

describe('Tooltip', () => {
  describe('렌더링', () => {
    it('trigger를 올바르게 렌더링한다', () => {
      render(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('trigger에 data-slot 속성을 가진다', () => {
      render(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toHaveAttribute('data-slot', 'tooltip-trigger');
    });

    it('기본 상태에서 content가 숨겨져 있다', () => {
      render(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  describe('open 상태', () => {
    it('open=true일 때 content가 표시된다', () => {
      render(
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('defaultOpen=true일 때 content가 표시된다', () => {
      render(
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('TooltipContent에 커스텀 className을 적용한다', () => {
      render(
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">Tooltip content</TooltipContent>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip');
      // className은 TooltipContent wrapper에 적용됨
      expect(tooltip.closest('[data-slot="tooltip-content"]')).toHaveClass('custom-class');
    });
  });
});

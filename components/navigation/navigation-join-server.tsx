"use client";

import { useModal } from '@/app/hooks/use-modal-store';

import { Button } from '../ui/button';

interface Props {
  label?: string;
}

const NavigationJoinServer = () => {
  const { onOpen } = useModal();

  return (
    <div className="w-full flex items-center justify-center">
      <Button onClick={() => onOpen("joinServer")}>Join server</Button>
    </div>
  );
};

export default NavigationJoinServer;

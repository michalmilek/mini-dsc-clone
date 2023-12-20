"use client";

import { Check, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { revalidateLayout } from '@/app/actions/revalidateLayout';
import {
    serverInvitationAccept, serverInvitationReject
} from '@/app/services/server/serverInvitationResponse';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Server, ServerInvitation } from '@prisma/client';

type Invitation = ServerInvitation & {
  server: Server;
};

const NavigationServerInvitation = ({
  serverInvitation,
}: {
  serverInvitation: Invitation;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <li
      title={serverInvitation.server.name + " Server invitation"}
      className={cn("w-full flex-col flex items-center justify-between px-2")}>
      <span className="text-center">{serverInvitation.server.name}</span>
      <div className="w-full flex items-center justify-between">
        <div className={cn("relative w-12 h-12")}>
          <Image
            layout="fill"
            src={serverInvitation.server.imageUrl}
            alt={serverInvitation.server.name}
            className={cn(
              "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200"
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-between py-1">
          <button
            onClick={async () => {
              try {
                await serverInvitationAccept(serverInvitation.id);
                toast({
                  variant: "success",
                  title: "Server invitation accepted",
                });
                await revalidateLayout();
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Server invitation accept failed",
                });
              }
            }}
            title="Accept invitation">
            <Check className="text-green-500" />
          </button>
          <button
            onClick={async () => {
              try {
                await serverInvitationReject(serverInvitation.id);
                toast({
                  variant: "success",
                  title: "Server invitation declined",
                });
                await revalidateLayout();
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Server invitation decline failed",
                });
              }
            }}
            title="Decline Invitation">
            <XIcon className="text-red-500" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default NavigationServerInvitation;

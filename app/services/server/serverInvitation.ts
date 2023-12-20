import axios from 'axios';

import { useMutation } from '@tanstack/react-query';

interface Body {
  serverId: string;
  receiverEmail: string;
}

export function useInviteToServer() {
  const inviteToServer = async ({ body }: { body: Body }) => {
    return axios
      .post(`/api/socket/server/invitation`, body)
      .then((res) => res.data);
  };

  return useMutation({ mutationFn: inviteToServer });
}

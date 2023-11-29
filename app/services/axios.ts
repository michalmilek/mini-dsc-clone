import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

/* async function sendRequest(url: string, { arg }: { arg: Record<string, any> }) {
  return axios
    .request({
      method: "POST",
      url,
      data: JSON.stringify(arg),
    })
    .then((res) => res.json())
}
 */

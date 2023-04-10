export default async function excuteQuery(query: string, values: any[] = []) {
  const key = process.env.REACT_APP_API_AUTH_KEY;
  return fetch("https://shoflytawseel.com/api/excute", {
    method: "POST",
    body: JSON.stringify({
      query: query,
      values: [],
    }),
    headers: {
      "content-type": "application/json",
      Authorization: key as string,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

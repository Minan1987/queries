import { useQuery } from "@tanstack/react-query";

const DataList = () => {
  const result = useQuery({
    queryKey: ["Posts"],
    queryFn: async function () {
      const data = await fetch("http://127.0.0.1:8000/ads/advertises/");
      return data.json();
    },
  });
  console.log(result.fetchStatus);
  if (!result) {
    return <h1>loading...</h1>;
  }
  return (
    <ul>
      {result.data?.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default DataList;

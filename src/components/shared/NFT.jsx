export default function NFT({ data, ...props }) {
  if (!data) {
    return <div>Empty</div>;
  }

  return (
    <div {...props}>
      <div className="border border-black p-2">
        <img src={data.current_collection.uri} />
      </div>
      <hr className="my-3 border-gray-500"></hr>
      <div>
        <p>Collection - {data.current_collection.collection_name}</p>
        <p className="truncate font-medium">{data.token_name}</p>
        <p className="text-sm">{data.description}</p>
        <p className="truncate text-sm">
          created by {data.current_collection.creator_address}
        </p>
      </div>
    </div>
  );
}

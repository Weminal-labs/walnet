export default function NFT({ data, ...props }) {
  if (!data) {
    return <div>Empty</div>;
  }

  const token = data.current_token_data;

  return (
    <div {...props}>
      <div className="border border-black p-2">
        <img src={token.current_collection.uri} />
      </div>
      <hr className="my-3 border-gray-500"></hr>
      <div>
        <p>Collection - {token.current_collection.collection_name}</p>
        <p className="truncate font-medium">{token.token_name}</p>
        <p className="text-sm">{token.description}</p>
        <p className="truncate text-sm">
          created by {token.current_collection.creator_address}
        </p>
      </div>
    </div>
  );
}

import CopyIcon from "../icons/CopyIcon";

export default function NFT({ data, ...props }) {
  if (!data) {
    return (
      <div
        {...props}
        className="bg-white dark:bg-white/[0.01] backdrop-filter backdrop-blur-3xl rounded-xl shadow-2xl max-w-sm mx-auto overflow-hidden"
      >
        {/* Skeleton for CFT CARD */}
        <div className="bg-white dark:bg-white/[0.01] backdrop-filter backdrop-blur-3xl rounded-xl shadow-2xl max-w-sm mx-auto overflow-hidden animate-pulse">
          <div className="relative">
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
            <div className="absolute top-2 left-2 bg-gray-300 dark:bg-white/10 rounded-full w-24 h-6"></div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-white/10 rounded w-3/4"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-300 dark:bg-white/10 rounded-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-white/10 rounded flex-1"></div>
              <div className="w-4 h-4 bg-gray-300 dark:bg-white/10 rounded"></div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-5/6"></div>
            <div className="flex items-center justify-between mt-4">
              <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-16"></div>
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-24"></div>
                <div className="w-4 h-4 bg-gray-300 dark:bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const token = data.current_token_data;

  return (
    <div
      {...props}
      className="bg-white dark:bg-white/[0.01] backdrop-filter backdrop-blur-3xl rounded-xl shadow-2xl max-w-sm mx-auto overflow-hidden"
    >
      <div className="relative">
        <img
          src={token.current_collection.uri}
          alt="NFT"
          className="w-full h-40 object-cover bg-[url(/img/nft_placeholder.png)] bg-cover"
        />
        <div className="absolute top-2 left-2 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <img src="/img/icon/collection.png" alt="Move" className="w-4 h-4" />
          <span className="text-black dark:text-white text-xs">My Collection</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          Collection - {token.current_collection.collection_name}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
            {token.token_name}
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
            <CopyIcon />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 hover:line-clamp-none transition-all duration-300">
          {token.description}
        </p>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Created by</span>
          <div className="flex items-center space-x-2">
            <span className="truncate max-w-[150px]">
              {token.current_collection.creator_address}
            </span>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
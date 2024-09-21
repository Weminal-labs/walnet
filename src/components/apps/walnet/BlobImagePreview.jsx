import React from "react";

// Import from utils
import { WalnetUtils } from "../../../utils/walrus";

const BlobImagePreview = ({ mime, blobData, suiBlobId, className, alt }) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const handleImageLoad = () => {
    setLoading(false); // Hình ảnh đã tải xong
  };

  if (!blobData && !suiBlobId) {
    return <p>No image data</p>;
  }

  React.useEffect(() => {
    if (suiBlobId) {
      setImageSrc(WalnetUtils.getBlobUrl(WalnetUtils.u256ToBlobId(suiBlobId)));
    } else if (blobData) {
      const objectUrl = URL.createObjectURL(blobData);
      setImageSrc(objectUrl);

      // Cleanup object URL after component unmount
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [blobData, suiBlobId]);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <div
            role="status"
            class="flex items-center justify-center h-[250px] w-[800px] max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-white/20"
          >
            <svg
              class="w-10 h-10 text-white/50"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      )}
      {imageSrc && (
        <img
          className={`${loading ? "" : "p-6"} ${className}`}
          src={imageSrc}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      )}
    </>
  );
};

export default BlobImagePreview;

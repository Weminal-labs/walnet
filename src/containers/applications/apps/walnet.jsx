import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/walnet.scss";
import dataWalnet from "./assets/walnetData.json";
import BlobImagePreview from "../../../components/apps/walnet/BlobImagePreview";

// Import from utils
import { WalnetUtils } from "../../../utils/walrus";
import { BrowserStorageUtils } from "../../../utils/browser_storage";

// SVG Search Icon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 19a8 8 0 100-16 8 8 0 000 16zm6-2l4 4"
    />
  </svg>
);

// SVG Clear (X) Icon
const ClearIcon = ({ clearSearch }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    onClick={clearSearch}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Sui Object Item
const SuiObjectListItem = ({ data, dependencies }) => {
  return (
    <div
      className={`navLink ${
        data.id === dependencies.objectIdSelected ? "selected" : ""
      }`}
      onClick={() => dependencies.aggregateInfoTransaction(data.id)}
    >
      <p className="content-item-traction truncate w-full">{data.id}</p>
    </div>
  );
};

export const Walnet = () => {
  const wnapp = useSelector((state) => state.apps.walrus);
  const [suiObjects, setSuiObjects] = useState(
    BrowserStorageUtils.getItem("objs")
  );
  const [filteredSuiObjects, setFilteredSuiObjects] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objectIdSelected, setObjectIdSelected] = useState(null);
  const [dataPreviewImage, setDataPreviewImage] = useState(null);
  const [navToUploadFile, setNavToUploadFile] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const inputFileElementRef = React.useRef(null);

  // Hàm để lọc dữ liệu dựa trên searchTerm
  const handleFilter = (value) => {
    const result = suiObjects.filter((item) => item.object_id.includes(value));
    setObjectIdSelected(null);
    setFilteredSuiObjects(result);
    setSearchTerm(value);
  };

  // Hàm để xóa searchTerm và hiển thị lại toàn bộ dữ liệu
  const clearSearch = () => {
    setFilteredSuiObjects(null);
    setSearchTerm("");
  };

  const aggregateInfoTransaction = async (objectId) => {
    if (!suiObjects) return;

    // set
    setNavToUploadFile(false);
    // clear data previewimage
    setDataPreviewImage(null);
    // set objectId
    setObjectIdSelected(objectId);

    const suiObject = suiObjects.find(
      (_suiObject) => _suiObject.id === objectId
    );

    setDataPreviewImage(suiObject);

    clearSearch();
  };

  const handleFormSubmit = async function (e) {
    e.preventDefault();
    const target = e.target;
    const file = target["uploadFile"].files[0];
    const epochs = target["epochs"].value || 1;

    if (!file) {
      return;
    }

    setIsPublishing(true);
    const blobInfo = await WalnetUtils.uploadBlob(file, epochs);
    const objectDetails = await WalnetUtils.getSuiObject(blobInfo.suiRef);

    const suiObject = {
      id: objectDetails.data.objectId,
      blobId: objectDetails.data.content.fields.blob_id,
      fileType: objectDetails.data.content.type,
      size: objectDetails.data.content.fields.size, // kích thước tính bằng byte
      certifiedEpoch: objectDetails.data.content.fields.certified_epoch,
      storedEpoch: objectDetails.data.content.fields.stored_epoch,
      blobData: null,
    };

    let _suiObjects = suiObjects;

    if (!_suiObjects) _suiObjects = [suiObject];
    else {
      _suiObjects.push(suiObject);
      BrowserStorageUtils.setItem("objs", _suiObjects);
    }

    setSuiObjects(suiObjects ? [...suiObjects, suiObject] : [suiObject]);
    setDataPreviewImage(suiObject);
    setNavToUploadFile(false);
    setIsPublishing(false);
    setObjectIdSelected(suiObject.id);
    clearSearch();
  };

  const renderableData =
    filteredSuiObjects !== null ? filteredSuiObjects : suiObjects;

  // React.useEffect(() => {
  //   WalnetUtils.getBlobIdsFromSui().then((data) => {
  //     console.log("Data:", data);
  //     setSuiObjects(data.result.data);
  //   });

  //   // For testing
  //   // setSuiObjects(dataWalnet);
  // }, []);

  React.useEffect(() => {
    // Save Sui Object in local storage.
    return function () {};
  }, []);

  return (
    <div
      className="walnetApp shadow-lg floatTab dpShad "
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <nav>
            <div className="nav_top relative">
              {/* Ô tìm kiếm */}
              <input
                type="text"
                className="search border rounded p-2 w-full"
                placeholder="Search for transaction"
                name="search"
                value={searchTerm}
                onChange={(e) => handleFilter(e.target.value)}
                autocomplete="off"
              />

              {/* Icon Tìm kiếm hoặc Xóa */}
              <div className="absolute top-[14px] right-6">
                {searchTerm ? (
                  <ClearIcon clearSearch={clearSearch} />
                ) : (
                  <SearchIcon />
                )}
              </div>
            </div>

            <div className="nav_bottom win11Scroll">
              {renderableData ? (
                <>
                  {renderableData.map((i) => (
                    <SuiObjectListItem
                      key={i.blobId}
                      data={i}
                      dependencies={{
                        objectIdSelected,
                        aggregateInfoTransaction,
                      }}
                    />
                  ))}
                  {objectIdSelected && <div className="marker"></div>}
                </>
              ) : (
                // Array.from({ length: 10 }).map((_, index) => (
                //   <div
                //     key={index}
                //     className={"navLink animate-pulse unselected"}
                //   >
                //     <div
                //       className={`h-2 bg-gray-200 rounded-full dark:bg-white/20`}
                //       style={{
                //         width: `${100 - Math.floor(Math.random() * 61)}%`,
                //       }}
                //     />
                //   </div>
                // ))
                <div className="flex justify-center px-6 w-full">
                  <p className="text-center">
                    Nothing here. You can publish your object in the{" "}
                    <strong>Publish file</strong> section
                  </p>
                </div>
              )}
            </div>
            {!navToUploadFile && (
              <div
                className="bottom-btn-upload cursor-pointer"
                onClick={() => {
                  setNavToUploadFile(true);
                  setObjectIdSelected(null);
                }}
              >
                <div className="flex flex-row items-center my">
                  <p className="me-2 my-2">Publish file</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-7 mb-1 fill-neutral-700 dark:fill-neutral-200"
                    viewBox="0 0 32 32"
                  >
                    <path
                      d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                      data-original="#000000"
                    />
                    <path
                      d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                      data-original="#000000"
                    />
                  </svg>
                </div>
              </div>
            )}
          </nav>

          {!navToUploadFile ? (
            dataPreviewImage && (
              <main>
                <div className="flex flex-col w-full h-full tilesCont win11Scroll">
                  <p className="title-preview text-2xl mt-0">Preview</p>
                  {!dataPreviewImage ? (
                    <div>
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
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>
                      <div class="flex flex-col mt-16 animate-pulse">
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[10%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[50%]"></div>
                        </div>
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[5%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[40%]"></div>
                        </div>
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[8%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[17%]"></div>
                        </div>
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[6%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[22%]"></div>
                        </div>
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[15%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[12%]"></div>
                        </div>
                        <div class="flex flex-row justify-between mb-3">
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[13%]"></div>
                          <div class="h-2 bg-gray-200 rounded-full dark:bg-white/20 w-[8%]"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center">
                        {/* Main Preview Image */}
                        <BlobImagePreview
                          mime={"image/jpeg; charset=binary"}
                          blobData={dataPreviewImage?.blobData}
                          suiBlobId={dataPreviewImage?.blobId}
                          alt="preview-image"
                          className="h-[250px] w-auto rounded-[4px] border-[6px] shadow-2xl bg-white dark:white/30 dark:bg-white/10 backdrop-blur-sm"
                          style={{
                            borderWidth: "6px",
                          }}
                        />
                      </div>
                      {/* <div className="h-[1px] my-5 bg-neutral-800 dark:bg-neutral-400" /> */}
                      <div class="mt-10">
                        <div class="space-y-4">
                          <div class="flex justify-between">
                            <span class="font-semibold">Sui Object ID</span>
                            <span>{dataPreviewImage?.id}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-semibold">Blob ID</span>
                            <span>
                              {WalnetUtils.u256ToBlobId(
                                dataPreviewImage?.blobId
                              )}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-semibold">File type</span>
                            <span>{dataPreviewImage?.fileType}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-semibold">Size</span>
                            <span>{dataPreviewImage?.size}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-semibold">Certified epoch</span>
                            <span>{dataPreviewImage?.certifiedEpoch}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-semibold">Stored Epoch</span>
                            <span>{dataPreviewImage?.storedEpoch}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            )
          ) : (
            <main>
              <form
                className="flex flex-col w-full h-full tilesCont win11Scroll"
                onSubmit={handleFormSubmit}
              >
                <p className="title-preview text-2xl mt-0">Publish file</p>

                <div className="w-full flex flex-col items-center mb-4">
                  <label
                    for="uploadFile"
                    class="text-base rounded w-full h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-11 mb-2 fill-neutral-700 dark:fill-neutral-200"
                      viewBox="0 0 32 32"
                    >
                      <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000"
                      />
                      <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000"
                      />
                    </svg>
                    <p className="my-0">Browser file</p>
                    <input
                      ref={inputFileElementRef}
                      type="file"
                      id="uploadFile"
                    />
                    <p class="text-xs font-medium">
                      PNG, JPG SVG, WEBP, and GIF are Allowed. (Max 10MiB Size)
                    </p>

                    {/* <div class="flex flex-col items-center w-full p-4 rounded-lg mt-4 max-w-[250px]">
                        <div role="status">
                          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-white/20 fill-[var(--clrPrm)]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                        <p class="text-sm">Progress: 35%</p>
                      </div> */}
                  </label>
                </div>

                <label htmlFor="epochs" className="mb-2">
                  Choose epochs :
                </label>
                <input
                  id="epochs"
                  className="input-epochs dark:placeholder-white/50 w-[150px]"
                  placeholder="Enter epochs"
                  name="epochs"
                  type="number"
                />

                <button
                  className="tile thin-blue cursor-pointer bg-red-500"
                  type="submit"
                >
                  <p className="my-2">
                    {isPublishing ? (
                      <div className="flex items-center">
                        <svg
                          aria-hidden="true"
                          class="w-3 h-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 me-3"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        Publishing...
                      </div>
                    ) : (
                      "Publish file"
                    )}
                  </p>
                </button>
              </form>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

import axios from "axios";
import { Buffer } from "buffer";

const WALRUS_AGGREGATOR_ENDPOINT = "https://aggregator-devnet.walrus.space";
const WALRUS_PUBLISHER_ENDPOINT = "https://publisher-devnet.walrus.space";
const SUI_CDN_ENDPOINT = "https://cdn.suiftly.io";
const SUI_NETWORK = "testnet";
const SUI_TESTNET_ENDPOINT = `https://fullnode.${SUI_NETWORK}.sui.io`;
const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;
const VERSION = "v1";
const SENDER_ID =
  "0xf1346af6127e9b1717f31a91df9ab26331731dcc7940a881aa2a3fd9e6df099d";
const BLOB_CONTENT_TYPE =
  "0x7e12d67a52106ddd5f26c6ff4fe740ba5dea7cfc138d5b1d33863ba9098aa6fe::blob::Blob";

export const WalnetUtils = {
  getBlobUrl(blobId) {
    return `${WALRUS_AGGREGATOR_ENDPOINT}/${VERSION}/${blobId}`;
  },

  // Helper function to fetch blob from API
  async getBlob(blobId) {
    try {
      const url = `${WALRUS_AGGREGATOR_ENDPOINT}/${VERSION}/${blobId}`;

      // Gọi API sử dụng Axios và lấy về Blob
      const response = await axios.get(url, {
        responseType: "blob", // Đảm bảo trả về dạng blob
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      // Tạo URL từ Blob để hiển thị ảnh
      // const imageUrl = URL.createObjectURL(response.data);

      // trả về dạng blob
      return response.data;
    } catch (error) {
      console.error("Error - Get blob:", error);
    }
  },

  // Helper function để fetch nhiều Blob từ API
  async getBlobs(blobIds) {
    try {
      const requests = blobIds.map((blobId) => {
        const url = `${WALRUS_AGGREGATOR_ENDPOINT}/${VERSION}/${blobId}`;
        return axios.get(url, {
          responseType: "blob",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
      });

      // Gọi tất cả các request song song
      const responses = await axios.all(requests);

      // Tạo danh sách các imageUrl từ các Blob trả về
      const blobsData = responses.map((response) => response.data);
      return blobsData;
    } catch (error) {
      console.error("Error - Get blobs:", error);
    }
  },

  async uploadBlob(inputFile, numEpochs) {
    try {
      const response = await axios.put(
        `${WALRUS_PUBLISHER_ENDPOINT}/${VERSION}/store?epochs=${numEpochs}`,
        inputFile
      );
      const data = response.data;
      let info;

      if ("alreadyCertified" in data) {
        info = {
          status: "Already certified",
          blobId: data.alreadyCertified.blobId,
          endEpoch: data.alreadyCertified.endEpoch,
          suiRefType: "Previous Sui Certified Event",
          suiRef: data.alreadyCertified.event.txDigest,
          suiBaseUrl: SUI_VIEW_TX_URL,
        };
      } else if ("newlyCreated" in data) {
        info = {
          status: "Newly created",
          blobId: data.newlyCreated.blobObject.blobId,
          endEpoch: data.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: "Associated Sui Object",
          suiRef: data.newlyCreated.blobObject.id,
          suiBaseUrl: SUI_VIEW_OBJECT_URL,
        };
      } else {
        throw Error("Unhandled successful response!");
      }

      return info;
    } catch (error) {
      console.error("Error - Upload blob:", error);
    }
  },

  async getBlobIdsFromSui() {
    try {
      const response = await axios.post(
        SUI_TESTNET_ENDPOINT,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getOwnedObjects",
          params: [
            SENDER_ID,
            {
              filter: {
                MatchAll: [
                  {
                    StructType: BLOB_CONTENT_TYPE,
                  },
                ],
              },
              options: {
                showType: false,
                showOwner: false,
                showPreviousTransaction: false,
                showDisplay: false,
                showContent: true,
                showBcs: false,
                showStorageRebate: false,
              },
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error - Get blobs id from SUI:", error);
    }
  },

  async getBlobMetadataById() {
    try {
      const response = await axios.get(`${SUI_CDN_ENDPOINT}/meta/${blobId}`);
      const [fileType, charset] = response.data.mime.split("; ");
      const result = {
        charset: charset.split("=")[1],
        fileType,
        size: data.size,
      };
      return result;
    } catch (error) {
      console.error("Error - Get blob's metadata:", error);
    }
  },

  // Convert the blob id in Sui to blob id in walrus
  u256ToBlobId(u256Value) {
    u256Value = BigInt(u256Value);

    const hexValue =
      u256Value
        .toString(16)
        .padStart(64, "0")
        .match(/.{2}/g)
        ?.reverse()
        .join("") || "";

    const hexBytes = Buffer.from(hexValue, "hex");

    const blobId = Buffer.from(hexBytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return blobId;
  },

  async getObjectDetails(objectId) {
    try {
      const response = await axios.post(
        SUI_TESTNET_ENDPOINT,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "sui_getObject",
          params: [
            objectId,
            {
              showType: false,
              showOwner: false,
              showPreviousTransaction: false,
              showDisplay: false,
              showContent: true,
              showBcs: false,
              showStorageRebate: false,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.result;
    } catch (error) {
      console.error("Error fetching object details:", error);
      throw error;
    }
  },

  async getSuiObject(txDigest) {
    const response = await axios.post(
      SUI_TESTNET_ENDPOINT,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "sui_getTransactionBlock",
        params: [
          txDigest,
          {
            showInput: true,
            showRawInput: false,
            showEffects: true,
            showEvents: true,
            showObjectChanges: false,
            showBalanceChanges: false,
            showRawEffects: false,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const modifiedObjects = response.data.result.effects.modifiedAtVersions;
    const that = this;
    const objectDetails = await Promise.all(
      modifiedObjects.map((obj) => that.getObjectDetails(obj.objectId))
    );

    console.log("Modified objects details:", objectDetails);

    const blobObject = objectDetails.find(
      (obj) => obj.data.content.type == BLOB_CONTENT_TYPE
    );

    return blobObject;
  },
};

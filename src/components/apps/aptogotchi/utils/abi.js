export const ABI = {
  address: "0x73b4639d21796c01ee707a547f9153adb39de5955739a6251380dfbf85569836",
  name: "aptogotchi",
  friends: [],
  exposed_functions: [
    {
      name: "create_aptogotchi",
      visibility: "private",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer"],
      return: [],
    },
    {
      name: "get_aptogotchi",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: ["address"],
      return: [
        "bool",
        "u8",
        "0x73b4639d21796c01ee707a547f9153adb39de5955739a6251380dfbf85569836::aptogotchi::AptogotchiParts",
      ],
    },
    {
      name: "get_aptogotchi_collection_address",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: [],
      return: ["address"],
    },
    {
      name: "get_aptogotchi_collection_creator_address",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: [],
      return: ["address"],
    },
    {
      name: "get_aptogotchi_collection_name",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: [],
      return: ["0x1::string::String"],
    },
    {
      name: "make_random_move",
      visibility: "private",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["address"],
      return: [],
    },
  ],
  structs: [
    {
      name: "Aptogotchi",
      is_native: false,
      abilities: ["key"],
      generic_type_params: [],
      fields: [
        { name: "live", type: "bool" },
        { name: "health", type: "u8" },
        {
          name: "parts",
          type: "0x73b4639d21796c01ee707a547f9153adb39de5955739a6251380dfbf85569836::aptogotchi::AptogotchiParts",
        },
        { name: "extend_ref", type: "0x1::object::ExtendRef" },
        { name: "mutator_ref", type: "0x4::token::MutatorRef" },
        { name: "burn_ref", type: "0x4::token::BurnRef" },
      ],
    },
    {
      name: "AptogotchiParts",
      is_native: false,
      abilities: ["copy", "drop", "store", "key"],
      generic_type_params: [],
      fields: [
        { name: "body", type: "u8" },
        { name: "ear", type: "u8" },
        { name: "face", type: "u8" },
      ],
    },
    {
      name: "CollectionOwnerConfig",
      is_native: false,
      abilities: ["key"],
      generic_type_params: [],
      fields: [{ name: "extend_ref", type: "0x1::object::ExtendRef" }],
    },
    {
      name: "MintAptogotchiEvent",
      is_native: false,
      abilities: ["drop", "store"],
      generic_type_params: [],
      fields: [
        { name: "aptogotchi_address", type: "address" },
        { name: "token_name", type: "0x1::string::String" },
        {
          name: "parts",
          type: "0x711c29679672fc775cabe14ffe6feeb4832a841e4421d1d26045e76abb6b3422::aptogotchi::AptogotchiParts",
        },
      ],
    },
  ],
};

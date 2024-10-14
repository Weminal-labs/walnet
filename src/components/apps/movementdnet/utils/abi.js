export const MovementDNetABI = {
  address: "0x699fdcb203e52ff2298d43066e2cc6a0f0ebe496fdc227af4b795024b9550c10",
  name: "network",
  friends: [],
  exposed_functions: [
    {
      name: "complete_task",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer", "u64", "u64"],
      return: [],
    },
    {
      name: "query_task_info",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: ["u64"],
      return: ["address", "bool", "0x1::option::Option<address>"],
    },
    {
      name: "register_node",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer"],
      return: [],
    },
    {
      name: "submit_task",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer", "u8", "u64", "u64"],
      return: [],
    },
  ],
  structs: [
    {
      name: "NetworkState",
      is_native: false,
      abilities: ["key"],
      generic_type_params: [],
      fields: [
        {
          name: "nodes",
          type: "vector<0x699fdcb203e52ff2298d43066e2cc6a0f0ebe496fdc227af4b795024b9550c10::network::NodeInfo>",
        },
        {
          name: "tasks",
          type: "vector<0x699fdcb203e52ff2298d43066e2cc6a0f0ebe496fdc227af4b795024b9550c10::network::Task>",
        },
        {
          name: "total_compute_time",
          type: "u64",
        },
        {
          name: "reward_per_compute_unit",
          type: "u64",
        },
      ],
    },
    {
      name: "NodeCapability",
      is_native: false,
      abilities: ["key"],
      generic_type_params: [],
      fields: [
        {
          name: "node_id",
          type: "u64",
        },
      ],
    },
    {
      name: "NodeInfo",
      is_native: false,
      abilities: ["copy", "drop", "store"],
      generic_type_params: [],
      fields: [
        {
          name: "addr",
          type: "address",
        },
        {
          name: "tasks_completed",
          type: "u64",
        },
        {
          name: "compute_time_contributed",
          type: "u64",
        },
        {
          name: "reputation_score",
          type: "u64",
        },
      ],
    },
    {
      name: "Task",
      is_native: false,
      abilities: ["drop", "store"],
      generic_type_params: [],
      fields: [
        {
          name: "creator",
          type: "address",
        },
        {
          name: "task_type",
          type: "u8",
        },
        {
          name: "compute_units_required",
          type: "u64",
        },
        {
          name: "reward_amount",
          type: "u64",
        },
        {
          name: "completed",
          type: "bool",
        },
        {
          name: "completed_by",
          type: "0x1::option::Option<address>",
        },
      ],
    },
  ],
};

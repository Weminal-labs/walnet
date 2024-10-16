export const MovementDNetABI = {
  "address": "0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520",
  "name": "network",
  "friends": [],
  "exposed_functions": [
    {
      "name": "check_node_exist",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "complete_task",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "join_cluster",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "query_cluster_tasks",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "vector<u64>"
      ]
    },
    {
      "name": "query_clusters_id",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "vector<u64>"
      ]
    },
    {
      "name": "query_task_info",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "address",
        "bool",
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "query_tasks",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "vector<u64>"
      ]
    },
    {
      "name": "register_cluster",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u8",
        "u8",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "register_head_node",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "register_node",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u8"
      ],
      "return": []
    },
    {
      "name": "submit_task",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "u8",
        "u64",
        "u64"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "Cluster",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store",
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "head_node_id",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "cluster_type",
          "type": "u8"
        },
        {
          "name": "cluster_processor",
          "type": "u8"
        },
        {
          "name": "nodes",
          "type": "vector<0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520::network::Node>"
        },
        {
          "name": "location",
          "type": "0x1::string::String"
        },
        {
          "name": "tasks",
          "type": "vector<0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520::network::Task>"
        },
        {
          "name": "task_ids",
          "type": "vector<u64>"
        }
      ]
    },
    {
      "name": "ClusterCapability",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "clusters_id",
          "type": "vector<u64>"
        }
      ]
    },
    {
      "name": "Network",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "clusters",
          "type": "vector<0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520::network::Cluster>"
        },
        {
          "name": "nodes",
          "type": "vector<0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520::network::Node>"
        },
        {
          "name": "tasks",
          "type": "vector<0x251cb26dc057c14a2e6781bee79646de15a12b23e75f7ba6a8588be390572520::network::Task>"
        },
        {
          "name": "total_compute_time",
          "type": "u64"
        },
        {
          "name": "reward_per_compute_unit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Node",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "node_type",
          "type": "u8"
        },
        {
          "name": "tasks_completed",
          "type": "u64"
        },
        {
          "name": "compute_time_contributed",
          "type": "u64"
        },
        {
          "name": "reputation_score",
          "type": "u64"
        },
        {
          "name": "uptime",
          "type": "u64"
        },
        {
          "name": "last_active",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NodeCapability",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "node_id",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Task",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "creator",
          "type": "address"
        },
        {
          "name": "cluster_processor",
          "type": "u8"
        },
        {
          "name": "cluster_type",
          "type": "u64"
        },
        {
          "name": "reward_amount",
          "type": "u64"
        },
        {
          "name": "completed",
          "type": "bool"
        },
        {
          "name": "completed_by",
          "type": "0x1::option::Option<address>"
        }
      ]
    },
    {
      "name": "TaskCapability",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "tasks_id",
          "type": "vector<u64>"
        }
      ]
    }
  ]
}
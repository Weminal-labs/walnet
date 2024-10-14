import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";
import { FaNetworkWired } from "react-icons/fa";

// Import components
import TaskStatus from "../../../components/apps/movementdnet/TaskStatus";
import SubmitTask from "../../../components/apps/movementdnet/SubmitTask";
import CompleteTask from "../../../components/apps/movementdnet/CompleteTask";
import RegisterNode from "../../../components/apps/movementdnet/RegisterNode";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/shared/tab-set";
import { Boxes } from "../../../components/shared/background-boxes";

export const MovementDNet = () => {
  const wnapp = useSelector((state) => state.apps.aptosdnet);

  return (
    <div
      className="relative msfiles floatTab dpShad bg-gradient-to-r from-[#1D2235] to-[#121318] overflow-hidden"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <Boxes />
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
      />
      <section className="text-white overflow-y-auto win11Scroll">
        <div className="relative w-full max-w-full p-4">
          <h1 className="text-3xl font-bold flex items-center mb-6 relative z-10">
            <FaNetworkWired className="mr-3" /> GPU Sharing DePIN Network
          </h1>

          <Tabs defaultValue="complete_task" className="w-full">
            <TabsList>
              <TabsTrigger value="query_task">Query Task</TabsTrigger>
              <TabsTrigger value="complete_task">Complete Task</TabsTrigger>
              <TabsTrigger value="register_node">Register Node</TabsTrigger>
              <TabsTrigger value="submit_task">Submit Task</TabsTrigger>
            </TabsList>
            <TabsContent value="query_task">
              <TaskStatus />
            </TabsContent>
            <TabsContent value="complete_task">
              <CompleteTask />
            </TabsContent>
            <TabsContent value="register_node">
              <RegisterNode />
            </TabsContent>
            <TabsContent value="submit_task">
              <SubmitTask />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

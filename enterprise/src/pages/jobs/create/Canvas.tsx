import React, { useCallback, useRef, useState, useEffect } from "react";
import { FileText, Code, Edit2, Trash, Book, Copy } from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/tooltip";
import { toast } from "sonner";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  IsValidConnection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Component {
  icon: React.ElementType;
  label: string;
  name: string;
  id: string;
}

interface WorkflowProps {
  setAction: (step: number) => void;
  addedComponents: Component[];
  setAddedComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  setMode: (mode: "standard" | "canvas") => void;
}

interface CustomNode extends NodeProps {
  data: {
    label: string;
    originalLabel: string;
    icon: React.ElementType;
    onNameChange: (nodeId: string, newName: string) => void;
    onDelete: (nodeId: string) => void;
  };
}

const CustomNode: React.FC<CustomNode> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onNameChange(id, nodeName);
  };

  return (
    <div
      className={`border p-5 gap-5 rounded-xl bg-input min-h-20 flex justify-start w-[500px] items-center relative 
        ${selected ? "border-blue-500" : "border-gray-300"}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#555",
          width: "20px",
          height: "20px",
          top: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {data.icon && <data.icon />}
      <div>
        <input
          ref={inputRef}
          className={`border-none outline-none bg-transparent max-w-fit transition-all ${
            isEditing ? "opacity-100 text-xl" : "opacity-50 text-base"
          }`}
          value={(nodeName as string) || ""}
          onChange={(e) => setNodeName(e.target.value)}
          onBlur={handleBlur}
          onFocus={() => setIsEditing(true)}
          readOnly={!isEditing}
        />
        <p className="text-sm opacity-50 mt-2">
          {(data?.originalLabel as string) || ""}
        </p>
      </div>
      <Tooltip content="Delete Component">
        <Trash
          className="cursor-pointer absolute right-5 text-red-500"
          size={20}
          onClick={() => data.onDelete(id)}
        />
      </Tooltip>
      <span>
        <Tooltip content="Edit Name" placement="top">
          <Edit2
            className="cursor-pointer absolute right-16 -mt-[8px]"
            size={20}
            onClick={handleEditClick}
            style={{
              transition: "transform 0.2s",
              transform: isEditing ? "scale(1.1)" : "scale(1)",
            }}
          />
        </Tooltip>
      </span>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#555",
          width: "20px",
          height: "20px",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

const Canvas: React.FC<WorkflowProps> = ({
  setAction,
  addedComponents,
  setAddedComponents,
  setMode,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const components = [
    { icon: FileText, label: "ATS", name: "ATS", id: "1" },
    { icon: Copy, label: "MCQ Assessment", name: "MCQ Assessment", id: "2" },
    { icon: Code, label: "Code Assessment", name: "Code Assessment", id: "3" },
    { icon: Book, label: "Assignment", name: "Assignment", id: "4" },
  ];

  // Load existing components from parent on mount
  useEffect(() => {
    if (addedComponents.length > 0) {
      const loadedNodes: Node[] = addedComponents.map((component, index) => ({
        id: Math.random().toString(36).substring(7),
        type: "customNode",
        data: {
          label: `${component.label} ${
            nodes.filter((n: Node) => n.data.originalLabel === component.label)
              .length
          }`,
          originalLabel: component.label,
          icon: component.icon,
          onNameChange: handleNodeNameChange,
          onDelete: handleDeleteNode,
        },
        position: {
          x: 250,
          y: index * 200 + 100,
        },
      }));

      setNodes(loadedNodes);
    }
  }, []);

  const addComponentToWorkflow = useCallback(
    (component: Component) => {
      // Count existing components
      const existingATSCount = nodes.filter(
        (n: Node) => n.data.originalLabel === "ATS"
      ).length;
      const existingComponentCounts = {
        "MCQ Assessment": nodes.filter(
          (n: Node) => n.data.originalLabel === "MCQ Assessment"
        ).length,
        "Code Assessment": nodes.filter(
          (n: Node) => n.data.originalLabel === "Code Assessment"
        ).length,
        Assignment: nodes.filter(
          (n: Node) => n.data.originalLabel === "Assignment"
        ).length,
      };

      // Validate component addition
      if (component.label === "ATS" && existingATSCount >= 1) {
        toast.error("Only one ATS component is allowed");
        return;
      }

      const maxOtherComponents = 4;
      if (component.label !== "ATS") {
        if (
          existingComponentCounts[
            component.label as keyof typeof existingComponentCounts
          ] >= maxOtherComponents
        ) {
          toast.error(
            `Maximum ${maxOtherComponents} ${component.label} components allowed`
          );
          return;
        }
      }

      // Check total steps
      if (nodes.length >= 12) {
        toast.error("Maximum 12 steps allowed");
        return;
      }

      const newNode: Node = {
        id: Math.random().toString(36).substring(7),
        type: "customNode",
        data: {
          label: `${component.label} ${
            nodes.filter((n: Node) => n.data.originalLabel === component.label)
              .length
          }`,
          originalLabel: component.label,
          icon: component.icon,
          onNameChange: handleNodeNameChange,
          onDelete: handleDeleteNode,
        },
        position: {
          x: 250,
          y: nodes.length * 200 + 100,
        },
      };

      setNodes([...nodes, newNode]);
    },
    [nodes, setNodes]
  );

  const handleNodeNameChange = useCallback(
    (nodeId: string, newName: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newName } }
            : node
        )
      );
    },
    []
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Check if source and target are different
      if (connection.source === connection.target) return false;

      // Check for existing incoming edges
      const hasIncomingEdge = edges.some(
        (edge) => edge.target === connection.target
      );

      // Check for existing outgoing edges
      const hasOutgoingEdge = edges.some(
        (edge) => edge.source === connection.source
      );

      // Allow connection only if no incoming or outgoing edges exist
      return !hasIncomingEdge && !hasOutgoingEdge;
    },
    [edges]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Only add edge if connection is valid
      if (isValidConnection(params as Connection)) {
        const newEdge = {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          style: {
            strokeWidth: 2,
            stroke: "#FF0072",
          },
          id: (edges.length + 1).toString(),
          source: params.source,
          target: params.target,
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [edges, isValidConnection]
  );

  const handleSave = () => {
    // Validate workflow
    if (edges.length === 0) {
      toast.error("Please connect your workflow components");
      return;
    }

    // Find the first node (node without incoming edges)
    const startNode = nodes.find(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    if (!startNode) {
      toast.error("Could not determine the start of the workflow");
      return;
    }

    // Traverse the workflow in order
    const orderedNodes: Node[] = [];
    const visitedNodeIds = new Set<string>();
    let currentNode: Node | undefined = startNode;

    while (currentNode) {
      orderedNodes.push(currentNode);
      visitedNodeIds.add(currentNode.id);

      // Find the next node connected to the current node
      const nextEdge = edges.find((edge) => edge.source === currentNode?.id);
      if (!nextEdge) break;

      currentNode = nodes.find((node) => node.id === nextEdge.target);
    }

    // Only save connected nodes in order
    const componentsToSave = orderedNodes.map((node) => ({
      label: node.data.originalLabel,
      icon: node.data.icon,
      name: node.data.label,
      id: node.id,
    }));

    setAddedComponents(componentsToSave as Component[]);
    setAction(3); // Move to next step (Summary)
  };

  return (
    <div className="flex gap-10 h-[88vh] justify-between">
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          isValidConnection={isValidConnection as IsValidConnection}
          minZoom={0.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </div>

      <div className="w-[40%] flex flex-col gap-5">
        <div className="flex gap-3 text-xs items-center">
          <p>Enable Canvas Mode</p>
          <Chip color="warning" size="sm">
            Beta
          </Chip>
          <Switch
            onChange={() => setMode("standard")}
            isSelected={true}
            size="sm"
          />
        </div>
        {components.map((component, index) => (
          <div
            key={index}
            className="p-5 border rounded-xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-5"
            onClick={() => addComponentToWorkflow(component)}
          >
            <component.icon />
            {component.label}
          </div>
        ))}

        <Button
          className="w-full mt-5"
          color="success"
          variant="flat"
          onClick={handleSave}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Canvas;

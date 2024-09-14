export type MSG_TYPE =
  | "IMAGE"
  | "TEXT"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENT"
  | "HOUSE"
  | "LINK"
  | "CODE";

export interface ServerToClientEvents {
  ALERT: (message: string) => void;
  DEMO: (message: string) => void;

  JOIN_ROOM: ({
    groupId,
    isPrivateGroup,
    groupName,
  }: {
    groupId: string;
    isPrivateGroup: boolean;
    groupName: string;
  }) => void;

  NEW_MESSAGE: ({
    groupId,
    message,
  }: {
    groupId: string;
    message: any;
  }) => void;
  NEW_MESSAGE_ALERT: ({ groupId }: { groupId: string }) => void;
}

export interface ClientToServerEvents {
  ALERT: (message: string) => void;
  JOIN_ROOM: ({
    groupId,
    isPrivateGroup,
    groupName,
    members,
  }: {
    groupId: string;
    isPrivateGroup: boolean;
    groupName: string;
    members?: string[];
  }) => void;
  NEW_MESSAGE: ({
    groupId,
    type,
    message,
  }: {
    groupId: string;
    type: string;
    message: string;
  }) => void;
}

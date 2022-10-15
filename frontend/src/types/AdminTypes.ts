export type WaiverClause = {
  text: string;
  required: boolean;
};

export type UpdateWaiverRequest = {
  clauses: {
    text: string;
    required: boolean;
  }[];
};

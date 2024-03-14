export type RoleType = number;

export type RoleResult = Array<{ role: string; key: RoleType }>;

export const RoleTypeName = {
  '-1': 'All',
  '0': 'Referrer',
  '1': 'Advocate',
};

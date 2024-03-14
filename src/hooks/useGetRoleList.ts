import { useRequest } from 'ahooks';
import { RoleResult } from 'types/role';
import request from 'api/axios';
import { useMemo } from 'react';

export async function getRoleList() {
  const response = await request.get<RoleResult>('app/dapps/roles');
  return response;
}

export default function useGetRoleList() {
  const { data } = useRequest(getRoleList);
  return useMemo(() => {
    if (!data) return [];
    return data as RoleResult;
  }, [data]);
}

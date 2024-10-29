import request from '@utils/request'
import { useQuery, UseQueryResult } from 'react-query'

type PostType = {
  name: string
  label: string
}

export default function usePostTypes() {
  const { data, isLoading }: UseQueryResult<{ data: PostType[] }> = useQuery({
    queryKey: ['postTypes'],
    queryFn: () => request('getPostTypes', undefined, undefined, 'GET'),
  })

  return {
    postTypes: data?.data || [],
    isLoading,
  }
}

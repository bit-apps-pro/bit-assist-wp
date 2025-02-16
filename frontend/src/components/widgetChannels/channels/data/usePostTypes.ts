import request from '@utils/request'
import { type UseQueryResult } from 'react-query'
import { useQuery } from 'react-query'

interface PostType {
  label: string
  name: string
}

export default function usePostTypes() {
  const { data, isLoading }: UseQueryResult<{ data: PostType[] }> = useQuery({
    queryFn: () => request('getPostTypes', undefined, undefined, 'GET'),
    queryKey: ['postTypes']
  })

  return {
    isLoading,
    postTypes: data?.data || []
  }
}

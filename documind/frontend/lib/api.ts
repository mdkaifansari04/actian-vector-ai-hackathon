import type {
  Instance,
  KnowledgeBase,
  Resource,
  HealthResponse,
  CollectionsResponse,
  IngestResponse,
  SearchInstanceResponse,
  QueryInstanceResponse,
  CreateInstanceRequest,
  CreateKnowledgeBaseRequest,
  IngestResourceRequest,
  SearchInstanceRequest,
  QueryInstanceRequest,
  AdvancedSearchRequest,
  AdvancedQueryRequest,
  ApiError,
} from './types'
import {
  mockInstances,
  mockKnowledgeBases,
  mockResources,
  mockHealth,
  mockCollections,
} from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: `Request failed with status ${response.status}`,
      }
      try {
        const errorData = await response.json()
        error.message = errorData.message || errorData.detail || error.message
        error.details = errorData
      } catch {
        // Response is not JSON
      }
      throw error
    }

    return response.json()
  }

  // Health
  async getHealth(): Promise<HealthResponse> {
    if (USE_MOCK) return mockHealth
    return this.request<HealthResponse>('/health')
  }

  // Instances
  async getInstances(): Promise<Instance[]> {
    if (USE_MOCK) return mockInstances
    return this.request<Instance[]>('/instances')
  }

  async createInstance(data: CreateInstanceRequest): Promise<Instance> {
    if (USE_MOCK) {
      const newInstance: Instance = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockInstances.push(newInstance)
      return newInstance
    }
    return this.request<Instance>('/instances', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Knowledge Bases
  async getKnowledgeBases(instanceId?: string): Promise<KnowledgeBase[]> {
    if (USE_MOCK) {
      if (instanceId) {
        return mockKnowledgeBases.filter(kb => kb.instance_id === instanceId)
      }
      return mockKnowledgeBases
    }
    const query = instanceId ? `?instance_id=${instanceId}` : ''
    return this.request<KnowledgeBase[]>(`/knowledge-bases${query}`)
  }

  async createKnowledgeBase(
    data: CreateKnowledgeBaseRequest
  ): Promise<KnowledgeBase> {
    if (USE_MOCK) {
      const newKb: KnowledgeBase = {
        id: crypto.randomUUID(),
        instance_id: data.instance_id,
        name: data.name,
        namespace_id: data.namespace_id,
        collection_name: `kb_${data.instance_id.slice(0, 8)}_${crypto.randomUUID().slice(0, 8)}`,
        embedding_model: data.embedding_model || 'minilm',
        embedding_profile: data.embedding_profile || 'general_text_search',
        embedding_dim: 384,
        llm_profile: data.llm_profile || 'balanced',
        distance_metric: data.distance_metric || 'cosine',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockKnowledgeBases.push(newKb)
      return newKb
    }
    return this.request<KnowledgeBase>('/knowledge-bases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Resources
  async getResources(params: {
    instance_id?: string
    namespace_id?: string
    kb_id?: string
  }): Promise<Resource[]> {
    if (USE_MOCK) {
      let filtered = [...mockResources]
      if (params.kb_id) {
        filtered = filtered.filter(r => r.knowledge_base_id === params.kb_id)
      }
      if (params.instance_id) {
        const kbIds = mockKnowledgeBases
          .filter(kb => kb.instance_id === params.instance_id)
          .map(kb => kb.id)
        filtered = filtered.filter(r => kbIds.includes(r.knowledge_base_id))
      }
      if (params.namespace_id) {
        const kbIds = mockKnowledgeBases
          .filter(kb => kb.namespace_id === params.namespace_id)
          .map(kb => kb.id)
        filtered = filtered.filter(r => kbIds.includes(r.knowledge_base_id))
      }
      return filtered
    }
    const searchParams = new URLSearchParams()
    if (params.instance_id) searchParams.set('instance_id', params.instance_id)
    if (params.namespace_id)
      searchParams.set('namespace_id', params.namespace_id)
    if (params.kb_id) searchParams.set('kb_id', params.kb_id)
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<Resource[]>(`/resources${query}`)
  }

  async ingestResource(data: IngestResourceRequest): Promise<IngestResponse> {
    if (USE_MOCK) {
      const newResource: Resource = {
        id: crypto.randomUUID(),
        knowledge_base_id: data.kb_id,
        source_type: data.source_type,
        source_ref: data.source_ref || 'inline-content',
        chunks_indexed: Math.floor(Math.random() * 20) + 5,
        status: 'done',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockResources.push(newResource)
      return { resource_id: newResource.id, chunks_indexed: newResource.chunks_indexed }
    }
    return this.request<IngestResponse>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async uploadResource(formData: FormData): Promise<IngestResponse> {
    if (USE_MOCK) {
      const file = formData.get('file') as File
      const kbId = formData.get('kb_id') as string
      const newResource: Resource = {
        id: crypto.randomUUID(),
        knowledge_base_id: kbId,
        source_type: file?.name?.endsWith('.pdf') ? 'pdf' : 'text',
        source_ref: file?.name || 'uploaded-file',
        chunks_indexed: Math.floor(Math.random() * 50) + 10,
        status: 'done',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockResources.push(newResource)
      return { resource_id: newResource.id, chunks_indexed: newResource.chunks_indexed }
    }
    const url = `${this.baseUrl}/resources`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: `Upload failed with status ${response.status}`,
      }
      try {
        const errorData = await response.json()
        error.message = errorData.message || errorData.detail || error.message
        error.details = errorData
      } catch {
        // Response is not JSON
      }
      throw error
    }

    return response.json()
  }

  // Search
  async searchInstance(
    data: SearchInstanceRequest
  ): Promise<SearchInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockSearchResults(data.query)
    }
    return this.request<SearchInstanceResponse>('/search/instance', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async searchAdvanced(
    data: AdvancedSearchRequest
  ): Promise<SearchInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockSearchResults(data.query)
    }
    return this.request<SearchInstanceResponse>('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Legacy search (kb_id scoped)
  async searchLegacy(data: {
    kb_id: string
    query: string
    top_k?: number
  }): Promise<SearchInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockSearchResults(data.query)
    }
    return this.request<SearchInstanceResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Query/Ask
  async queryInstance(
    data: QueryInstanceRequest
  ): Promise<QueryInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockQueryResponse(data.question)
    }
    return this.request<QueryInstanceResponse>('/query/instance', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async queryAdvanced(
    data: AdvancedQueryRequest
  ): Promise<QueryInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockQueryResponse(data.question)
    }
    return this.request<QueryInstanceResponse>('/query/advanced', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Legacy query (kb_id scoped)
  async queryLegacy(data: {
    kb_id: string
    question: string
    top_k?: number
  }): Promise<QueryInstanceResponse> {
    if (USE_MOCK) {
      return this.getMockQueryResponse(data.question)
    }
    return this.request<QueryInstanceResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Collections
  async getCollections(): Promise<CollectionsResponse> {
    if (USE_MOCK) return mockCollections
    return this.request<CollectionsResponse>('/collections')
  }

  // Mock helpers
  private getMockSearchResults(query: string): SearchInstanceResponse {
    return {
      results: [
        {
          id: 'chunk-1',
          text: `This is a relevant chunk about "${query}". It contains information from the Product Docs KB that matches your search query. The content includes detailed explanations and examples.`,
          score: 0.92,
          metadata: {
            source_ref: 'getting-started.md',
            kb_id: 'k1111111-1111-4111-8111-111111111111',
            namespace_id: 'product_docs',
          },
        },
        {
          id: 'chunk-2',
          text: `Another matching result for "${query}". This chunk comes from the Civillet Core documentation and provides additional context about the framework architecture.`,
          score: 0.87,
          metadata: {
            source_ref: 'routing-notes.txt',
            kb_id: 'k2222222-2222-4222-8222-222222222222',
            namespace_id: 'civillet_core',
          },
        },
        {
          id: 'chunk-3',
          text: `Svelte Runes documentation excerpt related to "${query}". Covers reactive state management and the $state, $derived, and $effect runes.`,
          score: 0.81,
          metadata: {
            source_ref: 'svelte-runes-guide.pdf',
            kb_id: 'k3333333-3333-4333-8333-333333333333',
            namespace_id: 'svelte_runes',
          },
        },
      ],
    }
  }

  private getMockQueryResponse(question: string): QueryInstanceResponse {
    return {
      answer: `Based on the available documentation, here's the answer to "${question}":\n\nThe system supports multiple knowledge bases across different instances. Each knowledge base can be configured with specific embedding models and LLM profiles to optimize retrieval and generation quality.\n\nKey points:\n1. **Instances** organize related knowledge bases together\n2. **Knowledge Bases** store vectorized content with configurable embedding models\n3. **Resources** are the source documents (markdown, text, PDF) that get chunked and indexed\n\nFor more details, refer to the getting-started.md guide in the Product Docs KB.`,
      sources: [
        {
          id: 'src-1',
          text: 'Getting started with DocuMind involves creating an instance, then adding knowledge bases within that instance...',
          score: 0.94,
          metadata: {
            source_ref: 'getting-started.md',
            kb_id: 'k1111111-1111-4111-8111-111111111111',
            namespace_id: 'product_docs',
          },
        },
        {
          id: 'src-2',
          text: 'Knowledge bases support multiple embedding models including minilm for efficient text search...',
          score: 0.88,
          metadata: {
            source_ref: 'routing-notes.txt',
            kb_id: 'k2222222-2222-4222-8222-222222222222',
            namespace_id: 'civillet_core',
          },
        },
      ],
    }
  }
}

export const api = new ApiClient()
export default api

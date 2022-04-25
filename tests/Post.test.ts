import {initializeDatabase, resetDatabase} from './__helpers'
import * as q from './__queries'
import {server} from '../api/server'

beforeAll(async () => {
  await initializeDatabase()
  await server.executeOperation({
    query: q.CREATE_AUTHOR,
    variables: {firstName: 'Mickey', lastName: 'Mouse'}
  })
  return
})
afterAll(async () => {
  return resetDatabase()
})

const validPostProps = {title: 'Nexus', body: '...', authorId: 1}

async function createValidDraft() {
  return server.executeOperation({
    query: q.CREATE_DRAFT,
    variables: validPostProps
  })
}

describe('Post objects', () => {
  test('return error on create new draft Post with invalid props', async () => {
    const result = await server.executeOperation({
      query: q.CREATE_DRAFT,
      variables: {}
    })
    expect(result.data).toBeUndefined()
    expect(result.errors).toMatchInlineSnapshot(`
Array [
  [UserInputError: Variable "$title" of required type "String!" was not provided.],
  [UserInputError: Variable "$body" of required type "String!" was not provided.],
  [UserInputError: Variable "$authorId" of required type "Int!" was not provided.],
]
`)
  })

  test('create new draft Post with all required props', async () => {
    const result = await createValidDraft()
    expect(result.errors).toBeUndefined()
    expect(result.data).toMatchObject({
      createDraft: {
        id: expect.toBeNumber(),
        title: validPostProps.title,
        body: validPostProps.body,
        published: false,
        authorId: validPostProps.authorId
      }
    })
  })

  test('publish a Post', async () => {
    const createResult = await createValidDraft()
    const id = createResult.data?.createDraft.id

    const publishResult = await server.executeOperation({
      query: q.PUBLISH_DRAFT,
      variables: {id}
    })

    expect(publishResult.errors).toBeUndefined()
    expect(publishResult.data?.publishDraft.id).toBe(id)
    expect(publishResult.data?.publishDraft.published).toBe(true)
  })

  test('revert a published Post to draft status', async () => {
    const createResult = await createValidDraft()
    const id = createResult.data?.createDraft.id
    await server.executeOperation({
      query: q.PUBLISH_DRAFT,
      variables: {id}
    })

    const recallResult = await server.executeOperation({
      query: q.RECALL_POST,
      variables: {id}
    })

    expect(recallResult.errors).toBeUndefined()
    expect(recallResult.data?.recallPost.id).toBe(id)
    expect(recallResult.data?.recallPost.published).toBe(false)
  })

  test('remove a Post', async () => {
    const createResult = await createValidDraft()
    const id = createResult.data?.createDraft.id

    const removeResult = await server.executeOperation({
      query: q.REMOVE_POST,
      variables: {id}
    })

    expect(removeResult.errors).toBeUndefined()
    expect(removeResult.data?.removePost.id).toBe(id)
    // todo: check that I cannot fetch the post
  })

  test('retrieve a Post object with a given id value', async () => {
    const createResult = await createValidDraft()
    const id = createResult.data?.createDraft.id

    const result = await server.executeOperation({
      query: q.GET_POST_BY_ID,
      variables: {id}
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toMatchObject({
      post: {
        id: id,
        title: validPostProps.title,
        body: validPostProps.body,
        published: false
      }
    })
  })

  describe('retrieve lists of Posts', () => {
    const postIds: number[] = []
    let publishedIds: number[]
    let draftIds: number[]

    beforeAll(async () => {
      // create sample posts
      for (let i = 0; i < 4; i++) {
        const createResult = await createValidDraft()
        postIds.push(createResult.data?.createDraft.id)
      }
      // publish half of the posts
      draftIds = postIds.slice(2)
      publishedIds = postIds.slice(0, 2)
      for (let id of publishedIds) {
        await server.executeOperation({
          query: q.PUBLISH_DRAFT,
          variables: {id}
        })
      }
    })

    test('retrieve all Post objects', async () => {
      const result = await server.executeOperation({
        query: q.GET_ALL_POSTS
      })

      expect(result.errors).toBeUndefined()
      expect(result.data?.allPosts).toBeDefined()
      const resultIds = result.data?.allPosts.map((p: {id: number}) => p.id)
      expect(postIds.every(id => resultIds.includes(id))).toBeTrue()
    })

    test('retrieve all draft Post objects', async () => {
      const result = await server.executeOperation({
        query: q.GET_DRAFT_POSTS
      })

      expect(result.errors).toBeUndefined()
      expect(result.data?.draftPosts).toBeDefined()
      const resultIds = result.data?.draftPosts.map((p: {id: number}) => p.id)

      expect(draftIds.every(id => resultIds.includes(id))).toBeTrue()
    })

    test('retrieve all published Post objects', async () => {
      const result = await server.executeOperation({
        query: q.GET_PUBLISHED_POSTS
      })

      expect(result.errors).toBeUndefined()
      expect(result.data?.publishedPosts).toBeDefined()
      const resultIds = result.data?.publishedPosts.map(
        (p: {id: number}) => p.id
      )

      expect(publishedIds.every(id => resultIds.includes(id))).toBeTrue()
    })
  })
})

import {gql} from 'apollo-server'

export const CREATE_DRAFT = gql`
  mutation CreateDraftPost($title: String!, $body: String!) {
    createDraft(title: $title, body: $body) {
      id
      title
      body
      published
    }
  }
`

export const RECALL_POST = gql`
  mutation RecallPost($id: Int!) {
    recallPost(postId: $id) {
      id
      published
    }
  }
`
export const PUBLISH_DRAFT = gql`
  mutation PublishDraft($id: Int!) {
    publishDraft(draftId: $id) {
      id
      published
    }
  }
`

export const REMOVE_POST = gql`
  mutation RemovePost($id: Int!) {
    removePost(postId: $id) {
      id
    }
  }
`

export const GET_POST_BY_ID = gql`
  query GetPostById($id: Int!) {
    post(postId: $id) {
      id
      title
      body
      published
    }
  }
`

export const GET_DRAFT_POSTS = gql`
  query {
    draftPosts {
      id
      title
      body
      published
    }
  }
`

export const GET_PUBLISHED_POSTS = gql`
  query {
    publishedPosts {
      id
      title
      body
      published
    }
  }
`

export const GET_ALL_POSTS = gql`
  query {
    allPosts {
      id
      title
      body
      published
    }
  }
`

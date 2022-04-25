import {objectType, extendType, stringArg, nonNull, intArg} from 'nexus'
import {Prisma} from '@prisma/client'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('body')
    t.boolean('published')
    t.int('authorId')
    t.field('author', {
      type: 'Author',
      async resolve(_root, _args, ctx) {
        return ctx.db.author.findUnique({where: {id: _root.authorId as number}})
      }
    })
  }
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('draftPosts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({where: {published: false}})
      }
    })

    t.list.field('publishedPosts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({where: {published: true}})
      }
    })

    t.list.field('allPosts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({})
      }
    })

    t.field('post', {
      type: 'Post',
      args: {
        postId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.findUnique({where: {id: args.postId}})
      }
    })
  }
})

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
        authorId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title,
          body: args.body,
          published: false,
          authorId: args.authorId
        }
        return ctx.db.post.create({data: draft})
      }
    })

    t.field('publishDraft', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: {id: args.draftId},
          data: {published: true}
        })
      }
    })

    t.field('recallPost', {
      type: 'Post',
      args: {
        postId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: {id: args.postId},
          data: {published: false}
        })
      }
    })

    t.field('updateDraft', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
        title: stringArg(),
        body: stringArg()
      },
      resolve(_root, args, ctx) {
        const {title, body} = args
        const data: {title?: string | null; body?: string | null} = {
          title,
          body
        }
        if (!title) delete data.title
        if (!body) delete data.body

        return ctx.db.post.update({
          where: {id: args.draftId},
          data: data as Prisma.PostUpdateWithoutAuthorInput
        })
      }
    })

    t.field('removePost', {
      type: 'Post',
      args: {
        postId: nonNull(intArg())
      },
      resolve(_parent, args, ctx) {
        return ctx.db.post.delete({
          where: {id: args.postId}
        })
      }
    })
  }
})

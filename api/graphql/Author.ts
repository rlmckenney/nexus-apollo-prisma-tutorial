import {objectType, extendType, stringArg, nonNull, intArg} from 'nexus'

export const Author = objectType({
  name: 'Author',
  definition(t) {
    t.int('id')
    t.string('firstName')
    t.string('lastName')
    t.list.field('posts', {
      type: 'Post',
      async resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({where: {authorId: _root.id as number}})
      }
    })
  }
})

export const AuthorQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allAuthors', {
      type: 'Author',
      resolve(_root, _args, ctx) {
        return ctx.db.author.findMany({})
      }
    })

    t.field('author', {
      type: 'Author',
      args: {
        authorId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.author.findUnique({where: {id: args.authorId}})
      }
    })
  }
})

export const AuthorMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createAuthor', {
      type: 'Author',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg())
      },
      resolve(_root, args, ctx) {
        const newAuthor = {
          firstName: args.firstName,
          lastName: args.lastName
        }
        return ctx.db.author.create({data: newAuthor})
      }
    })

    t.field('removeAuthor', {
      type: 'Author',
      args: {
        authorId: nonNull(intArg())
      },
      resolve(_parent, args, ctx) {
        return ctx.db.author.delete({
          where: {id: args.authorId}
        })
      }
    })
  }
})

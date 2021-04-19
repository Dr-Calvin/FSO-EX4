const dummy = () => {
  //   console.log(blogs)
  return 1
  // ...
}

// const totalLikesOrig = (blogs) => {
//   //   console.log(blogs)
//   const likesPerPost = blogs.map((blog) => {
//     return blog.likes
//   })
//   return likesPerPost.length === 0
//     ? 0
//     : likesPerPost.reduce((sum, item) => sum + item, 0)
// }

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, post) => sum + post.likes, 0)
}
const favouriteBlog = (blogs) => {
  const maxCallback = (max, cur) => (max.likes < cur.likes ? cur : max)

  return blogs
    .map((blog) => {
      return blog
    })
    .reduce(maxCallback, { likes: 0 })
}

const mostBlogs = (blogList) => {
  const authors = blogList.map((blog) => blog.author)
  let matches = []
  for (let x = 0; x < authors.length; x++) {
    let count = 0
    for (let y = x; y < authors.length; y++) {
      if (authors[x] === authors[y]) count++
    }
    matches.push(count)
  }
  // console.log(matches)
  const matchIndex = matches.indexOf(Math.max(...matches))
  return { author: authors[matchIndex], blogs: matches[matchIndex] }
}

const mostLikes = (blogList) => {
  const authors = blogList.map((blog) => blog.author)
  let matches = []
  for (let x = 0; x < authors.length; x++) {
    let count = 0
    for (let y = x; y < authors.length; y++) {
      if (authors[x] === authors[y]) count += blogList[y].likes
    }
    matches.push(count)
  }

  const matchIndex = matches.indexOf(Math.max(...matches))
  return { author: authors[matchIndex], likes: matches[matchIndex] }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}

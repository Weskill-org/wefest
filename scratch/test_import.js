import { BLOG_POSTS } from '../src/lib/blog-data.ts';

let withContent = 0;
let withoutContent = 0;
let emptyContentCount = 0;
let withoutContentSlugs = [];

for (const blog of BLOG_POSTS) {
  if (blog.content) {
    withContent++;
    if (blog.content.trim() === '') {
      emptyContentCount++;
    }
  } else {
    withoutContent++;
    withoutContentSlugs.push(blog.slug);
  }
}

console.log('Total blogs in array:', BLOG_POSTS.length);
console.log('Blogs with content property:', withContent);
console.log('Blogs with empty content:', emptyContentCount);
console.log('Blogs without content property:', withoutContent);
console.log('Slugs of first 20 blogs without content:', withoutContentSlugs.slice(0, 20));

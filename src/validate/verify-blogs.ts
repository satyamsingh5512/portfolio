import { addBlog, deleteBlog, getBlogs } from "../lib/blog-service";

async function verify() {
  console.log("--- Starting Verification ---");

  // 1. Initial State
  console.log("1. Fetching initial blogs...");
  const initialBlogs = await getBlogs();
  console.log("Initial count:", initialBlogs.length);

  // 2. Add Blog
  console.log("2. Adding test blog...");
  const newBlog = await addBlog({
    title: "Test Blog",
    description: "This is a test blog entry.",
    url: "https://example.com/test-blog",
  });
  console.log("Added blog:", newBlog.id);

  // 3. Verify Addition
  const updatedBlogs = await getBlogs();
  console.log("Updated count:", updatedBlogs.length);
  const found = updatedBlogs.find((b) => b.id === newBlog.id);
  if (found) {
    console.log("✅ Blog found in list");
  } else {
    console.error("❌ Blog NOT found");
  }

  // 4. Delete Blog (Clean up)
  console.log("4. Cleaning up (Deleting blog)...");
  await deleteBlog(newBlog.id);

  const finalBlogs = await getBlogs();
  console.log("Final count:", finalBlogs.length);

  if (finalBlogs.length === initialBlogs.length) {
    console.log("✅ Blog deleted successfully. Verification Passed.");
  } else {
    console.error("❌ Failed to delete blog");
  }
}

verify();

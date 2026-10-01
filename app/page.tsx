"use client";

import { useEffect, useState } from "react";
import PostCard from "./components/PostCard";
import { posts as mockPosts, type Post } from "./mocks/posts";
import { supabase } from "./utils/supabase";

export default function Home() {

  

  const [posts, setPosts] = useState <Post[]>([])

   useEffect(() => {
  async function getPosts() {
    const { data: postsFromDb } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsFromDb) {
      // Importar los mocks (arriba del archivo)
      // import { posts as mockPosts } from "./mocks/posts";

      const postsWithUser = postsFromDb.map((post, index) => {
        // Reutilizar los usuarios de los mocks en ciclo
        const mockUser = mockPosts[index % mockPosts.length].user;

        return {
          ...post,
          user: mockUser, // username + avatar del mock
          likes: post.likes ?? 0,
          isLiked: false,
          created_at: new Date(post.created_at),
        };
      });

      setPosts(postsWithUser);
    }
  }

  getPosts();
}, []);

  const handleLike = (postId: number | string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to from-primary to-accent bg-clip-text text-transparent">
            Supagram
          </h1>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </main>
    </div>
  );
}

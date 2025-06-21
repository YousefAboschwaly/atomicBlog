"use client"

import { memo, useEffect, useState } from "react"
import { createRandomPost, PostProvider, usePost } from "./PostContext"

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("fake-dark-mode")
  }, [isFakeDark])

  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className={isLoaded ? "app-loaded" : ""}>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
        style={{ transform: isFakeDark ? "rotate(360deg)" : "rotate(0deg)", transition: "transform 0.5s ease" }}
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      <PostProvider>
        <Header />
        <Main />
        <Archive show={false} />
        <Footer />
      </PostProvider>
    </section>
  )
}

function Header() {
  const { onClearPosts } = usePost()
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  )
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePost()

  return <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." />
}

function Results() {
  const { posts } = usePost()
  return <p>🚀 {posts.length} atomic posts found</p>
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  )
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  )
}

function FormAddPost() {
  const { onAddPost } = usePost()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!body || !title) return

    setIsSubmitting(true)

    // Add a small delay to show the animation
    setTimeout(() => {
      onAddPost({ title, body })
      setTitle("")
      setBody("")
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} style={{ transform: isSubmitting ? "scale(0.98)" : "scale(1)" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Post body" />
      <button disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add post"}</button>
    </form>
  )
}

function List() {
  const { posts } = usePost()
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i} style={{ "--index": i }}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}

const Archive= memo( function Archive({show}) {
  // Using state to store these posts as an optimization technique
  const [posts] = useState(() =>
    // Creating 10 posts instead of 100 to avoid performance issues but still demonstrate functionality
    Array.from({ length: 1000 }, () => (createRandomPost())),
  )

  const { onAddPost } = usePost()
  const [showArchive, setShowArchive] = useState(show)

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      <ul className={showArchive ? "show" : ""}>
        {posts.map((post, i) => (
          <li key={i} style={{ "--index": i }}>
            <p>
              <strong>{post.title}:</strong> {post.body}
            </p>
            <button onClick={() => onAddPost(post)}>Add as new post</button>
          </li>
        ))}
      </ul>
    </aside>
  )
})

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>
}

export default App

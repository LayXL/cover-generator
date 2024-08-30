import { useNavigate } from "react-router-dom"

export const Projects = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Projects page</h1>

      <button onClick={() => navigate("/editor")}>New project</button>
    </div>
  )
}

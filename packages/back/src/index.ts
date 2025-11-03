import { serve } from "bun"
import { initDatabase } from "./server/db"
import type {
  CreateEtudiantPayload,
  UpdateEtudiantPayload,
} from "./server/models/Etudiant"
import {
  createEtudiant,
  deleteEtudiant,
  getAllEtudiants,
  getEtudiantById,
  updateEtudiant,
} from "./server/services/etudiant/etudiants.service"
import type {
  CreateParcoursPayload,
  UpdateParcoursPayload,
} from "./server/models/Parcours"
import {
  createParcours,
  deleteParcours,
  getAllParcours,
  getParcoursById,
  getParcoursWithInscrits,
  updateParcours,
} from "./server/services/parcours/parcours.service"

initDatabase()

function addCORSHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response)
  newResponse.headers.set(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  )
  newResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  newResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )
  newResponse.headers.set("Access-Control-Allow-Credentials", "true")
  return newResponse
}

const server = serve({
  port: 3001,
  routes: {
    "/api/etudiants": {
      GET: async () => {
        const etudiants = getAllEtudiants()
        return Response.json(etudiants, { status: 200 })
      },

      POST: async (req: Request) => {
        try {
          const body = (await req.json()) as CreateEtudiantPayload

          if (!body.nom || !body.prenom || !body.email) {
            return Response.json(
              { error: "Nom, prenom and email are required" },
              { status: 400 }
            )
          }

          const existingEtudiant = getEtudiantById(
            getAllEtudiants().find((e) => e.email === body.email)?.id || -1
          )
          if (existingEtudiant) {
            return Response.json(
              { error: "Student with this email already exists" },
              { status: 409 }
            )
          }

          const etudiant = await createEtudiant(body)
          if (!etudiant) {
            return Response.json(
              { error: "Failed to create student" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Student created successfully", etudiant },
            { status: 201 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/etudiants/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const etudiant = getEtudiantById(id)
        if (!etudiant) {
          return Response.json({ error: "Student not found" }, { status: 404 })
        }

        return Response.json(etudiant, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as UpdateEtudiantPayload

          const etudiant = getEtudiantById(id)
          if (!etudiant) {
            return Response.json(
              { error: "Student not found" },
              { status: 404 }
            )
          }

          const updated = updateEtudiant(id, body)
          if (!updated) {
            return Response.json(
              { error: "Failed to update student" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Student updated successfully", etudiant: updated },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },

      DELETE: async (req) => {
        const id = parseInt(req.params.id)

        const etudiant = getEtudiantById(id)
        if (!etudiant) {
          return Response.json({ error: "Student not found" }, { status: 404 })
        }

        const deleted = deleteEtudiant(id)
        if (!deleted) {
          return Response.json(
            { error: "Failed to delete student" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "Student deleted successfully" },
          { status: 200 }
        )
      },
    },

    "/api/parcours": {
      GET: async () => {
        const parcours = getAllParcours()
        return Response.json(parcours, { status: 200 })
      },

      POST: async (req: Request) => {
        try {
          const body = (await req.json()) as CreateParcoursPayload

          if (!body.nomParcours) {
            return Response.json(
              { error: "nomParcours is required" },
              { status: 400 }
            )
          }

          const parcours = await createParcours(body)
          if (!parcours) {
            return Response.json(
              { error: "Failed to create parcours" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Parcours created successfully", parcours },
            { status: 201 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },
    },

    "/api/parcours/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        return Response.json(parcours, { status: 200 })
      },

      PUT: async (req) => {
        try {
          const id = parseInt(req.params.id)
          const body = (await req.json()) as UpdateParcoursPayload

          const parcours = getParcoursById(id)
          if (!parcours) {
            return Response.json(
              { error: "Parcours not found" },
              { status: 404 }
            )
          }

          const updated = updateParcours(id, body)
          if (!updated) {
            return Response.json(
              { error: "Failed to update parcours" },
              { status: 500 }
            )
          }

          return Response.json(
            { message: "Parcours updated successfully", parcours: updated },
            { status: 200 }
          )
        } catch (_error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          )
        }
      },

      DELETE: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const deleted = deleteParcours(id)
        if (!deleted) {
          return Response.json(
            { error: "Failed to delete parcours" },
            { status: 500 }
          )
        }

        return Response.json(
          { message: "Parcours deleted successfully" },
          { status: 200 }
        )
      },
    },

    "/api/parcours/:id/inscrits": {
      GET: async (req) => {
        const id = parseInt(req.params.id)

        const parcours = getParcoursById(id)
        if (!parcours) {
          return Response.json({ error: "Parcours not found" }, { status: 404 })
        }

        const parcoursWithInscrits = getParcoursWithInscrits(id)
        return Response.json(parcoursWithInscrits, { status: 200 })
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },

  fetch: async (req, server) => {
    // Handle OPTIONS requests for CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      })
    }

    const response = await server.fetch(req)
    return addCORSHeaders(response)
  },
})

console.log(`🚀 Server running at ${server.url}`)

const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://vladislavlazutkin64:DreamFall2121@cluster0.1decaqm.mongodb.net/?retryWrites=true&w=majority')
    app.listen(PORT, () => console.log(`serve started on port ${PORT}`))
  }
  catch (e) {
    console.error(e, "error")
  }
}

start()
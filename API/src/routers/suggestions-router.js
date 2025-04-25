import { Router } from "express";
import { SuggestionsSearchEquipmet } from "../controller/suggestions-search-controller.js"
import { SuggestionsSearchSector } from "../controller/suggestions-search-controller.js"
import { SuggestionsSearchUnits } from "../controller/suggestions-search-controller.js"

const suggestionsSearchEquipmet = new SuggestionsSearchEquipmet()
const suggestionsSearchSector = new SuggestionsSearchSector()
const suggestionsSearchUnits = new SuggestionsSearchUnits()

export const suggestionsRouter = Router()

// Equipment
suggestionsRouter.get('/equipment', suggestionsSearchEquipmet.index)
suggestionsRouter.post('/equipment', suggestionsSearchEquipmet.insert)

// Sector
suggestionsRouter.get('/sector', suggestionsSearchSector.index)
suggestionsRouter.post('/sector', suggestionsSearchSector.insert)

// Units
suggestionsRouter.get('/units', suggestionsSearchUnits.index) 
suggestionsRouter.post('/sector', suggestionsSearchUnits.insert)



